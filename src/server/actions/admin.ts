'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'
import { buildCloze } from '@/lib/cloze'
import { toCsvTable, VOCABULARY_CSV_COLUMNS } from '@/lib/csv'
import { logError } from '@/lib/logger'
import { fail, GENERIC_ERROR, ok, type ActionResult } from '@/lib/result'
import { requireAdmin } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { adminWordSchema, uuidSchema } from '@/lib/validation'

/**
 * Curated vocabulary management.
 *
 * Every action re-checks the admin flag on the server. The database enforces
 * the same rule independently through row level security and a trigger, so a
 * crafted request cannot write curated rows even if it reaches the API.
 */

export async function saveCuratedWord(
  input: unknown
): Promise<ActionResult<{ wordId: string }>> {
  const parsed = adminWordSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return fail(issue?.message ?? 'Check the form.', issue?.path[0]?.toString())
  }

  await requireAdmin()
  const supabase = await createServerSupabase()
  const data = parsed.data

  try {
    const row = {
      lemma: data.lemma,
      part_of_speech: data.partOfSpeech,
      cefr: data.cefr,
      russian: data.russian,
      definition: data.definition || null,
      context_hint: data.contextHint || null,
      primary_answer: data.lemma,
      accepted_answers: data.acceptedAnswers,
      tags: data.tags,
      is_archived: data.isArchived ?? false,
      created_by: null,
    }

    let wordId = data.id
    if (wordId) {
      const { error } = await supabase.from('words').update(row).eq('id', wordId)
      if (error) throw error
    } else {
      const { data: inserted, error } = await supabase
        .from('words')
        .insert(row)
        .select('id')
        .single()
      if (error) {
        if (error.code === '23505') return fail('That word already exists.', 'lemma')
        throw error
      }
      wordId = inserted.id
    }

    // Detail rows are replaced wholesale: simpler and always consistent.
    await supabase.from('word_examples').delete().eq('word_id', wordId)
    if (data.examples.length > 0) {
      await supabase.from('word_examples').insert(
        data.examples.map((example, position) => ({
          word_id: wordId as string,
          sentence: example.sentence,
          cloze_sentence: example.clozeSentence ?? buildCloze(example.sentence, data.lemma),
          position,
        }))
      )
    }

    await supabase.from('word_collocations').delete().eq('word_id', wordId)
    if (data.collocations.length > 0) {
      await supabase.from('word_collocations').insert(
        data.collocations.map((collocation, position) => ({
          word_id: wordId as string,
          collocation: collocation.collocation,
          pattern: collocation.pattern,
          meaning_ru: collocation.meaningRu,
          position,
        }))
      )
    }

    revalidatePath('/admin')
    return ok({ wordId: wordId as string })
  } catch (error) {
    logError('saveCuratedWord', error)
    return fail(GENERIC_ERROR)
  }
}

export async function setWordArchived(
  wordId: unknown,
  archived: unknown
): Promise<ActionResult<undefined>> {
  const id = uuidSchema.safeParse(wordId)
  const flag = z.boolean().safeParse(archived)
  if (!id.success || !flag.success) return fail('Unknown word.')

  await requireAdmin()
  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('words')
    .update({ is_archived: flag.data })
    .eq('id', id.data)
    .is('created_by', null)

  if (error) {
    logError('setWordArchived', error)
    return fail(GENERIC_ERROR)
  }

  revalidatePath('/admin')
  return ok(undefined)
}

export interface AdminImportRow {
  row: number
  lemma: string
  status: 'new' | 'duplicate' | 'invalid'
  message?: string
}

export interface AdminImportPreview {
  rows: AdminImportRow[]
  validCount: number
  invalidCount: number
  duplicateCount: number
}

const importSchema = z.object({
  lemma: z.string().trim().min(1).max(80),
  part_of_speech: z.enum(PARTS_OF_SPEECH),
  cefr: z.enum(CEFR_LEVELS),
  russian: z.string().trim().min(1).max(200),
  definition: z.string().trim().max(300).optional(),
  context: z.string().trim().max(300).optional(),
  example: z.string().trim().max(400).optional(),
  accepted_answers: z.string().max(300).optional(),
  tags: z.string().max(300).optional(),
})

/** Validates a CSV without writing anything, so the result can be reviewed. */
export async function previewCuratedImport(
  csv: unknown
): Promise<ActionResult<AdminImportPreview>> {
  const check = await validateCsv(csv)
  if (!check.ok) return check
  return ok(check.data.preview)
}

/** Writes only the rows that passed validation. */
export async function commitCuratedImport(
  csv: unknown
): Promise<ActionResult<{ imported: number; skipped: number }>> {
  const check = await validateCsv(csv)
  if (!check.ok) return check

  const supabase = await createServerSupabase()
  const rows = check.data.valid

  if (rows.length === 0) return ok({ imported: 0, skipped: check.data.preview.rows.length })

  try {
    // Duplicates were already filtered out during validation, so a plain
    // insert is enough and the reported counts stay exact.
    const { data: inserted, error } = await supabase
      .from('words')
      .insert(
        rows.map((row) => ({
          lemma: row.lemma,
          part_of_speech: row.part_of_speech,
          cefr: row.cefr,
          russian: row.russian,
          definition: row.definition || null,
          context_hint: row.context || null,
          primary_answer: row.lemma,
          accepted_answers: splitList(row.accepted_answers),
          tags: splitList(row.tags),
          created_by: null,
        }))
      )
      .select('id, lemma, part_of_speech')

    if (error) throw error

    const byKey = new Map(
      (inserted ?? []).map((row) => [`${row.lemma.toLowerCase()}::${row.part_of_speech}`, row.id])
    )

    const examples = rows
      .filter((row) => row.example)
      .map((row) => ({
        word_id: byKey.get(`${row.lemma.toLowerCase()}::${row.part_of_speech}`),
        sentence: row.example as string,
        cloze_sentence: buildCloze(row.example as string, row.lemma),
        position: 0,
      }))
      .filter((row): row is { word_id: string; sentence: string; cloze_sentence: string | null; position: number } =>
        typeof row.word_id === 'string'
      )

    if (examples.length > 0) await supabase.from('word_examples').insert(examples)

    revalidatePath('/admin')
    return ok({
      imported: inserted?.length ?? 0,
      skipped: check.data.preview.rows.length - (inserted?.length ?? 0),
    })
  } catch (error) {
    logError('commitCuratedImport', error)
    return fail('The import failed. Nothing was changed.')
  }
}

async function validateCsv(csv: unknown): Promise<
  ActionResult<{ preview: AdminImportPreview; valid: Array<z.infer<typeof importSchema>> }>
> {
  if (typeof csv !== 'string' || csv.trim().length === 0) return fail('Choose a CSV file first.')
  if (csv.length > 1_000_000) return fail('That file is too large.')

  await requireAdmin()
  const table = toCsvTable(csv)

  const missing = ['lemma', 'part_of_speech', 'cefr', 'russian'].filter(
    (column) => !table.headers.includes(column)
  )
  if (missing.length > 0) {
    return fail(
      `Missing column(s): ${missing.join(', ')}. Expected: ${VOCABULARY_CSV_COLUMNS.join(', ')}.`
    )
  }
  if (table.rows.length === 0) return fail('That file has no data rows.')
  if (table.rows.length > 1000) return fail('Import at most 1000 rows at a time.')

  const supabase = await createServerSupabase()
  const { data: existing } = await supabase
    .from('words')
    .select('lemma, part_of_speech')
    .is('created_by', null)

  const existingKeys = new Set(
    (existing ?? []).map((row) => `${row.lemma.toLowerCase()}::${row.part_of_speech}`)
  )

  const preview: AdminImportRow[] = []
  const valid: Array<z.infer<typeof importSchema>> = []
  const seen = new Set<string>()

  table.rows.forEach((row, index) => {
    const rowNumber = index + 2
    const parsed = importSchema.safeParse(row)
    if (!parsed.success) {
      preview.push({
        row: rowNumber,
        lemma: row.lemma ?? '',
        status: 'invalid',
        message: parsed.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; '),
      })
      return
    }

    const key = `${parsed.data.lemma.toLowerCase()}::${parsed.data.part_of_speech}`
    if (existingKeys.has(key) || seen.has(key)) {
      preview.push({ row: rowNumber, lemma: parsed.data.lemma, status: 'duplicate' })
      return
    }

    seen.add(key)
    valid.push(parsed.data)
    preview.push({ row: rowNumber, lemma: parsed.data.lemma, status: 'new' })
  })

  return ok({
    preview: {
      rows: preview,
      validCount: preview.filter((row) => row.status === 'new').length,
      invalidCount: preview.filter((row) => row.status === 'invalid').length,
      duplicateCount: preview.filter((row) => row.status === 'duplicate').length,
    },
    valid,
  })
}

function splitList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[;|]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, 12)
}
