'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'
import { buildCloze } from '@/lib/cloze'
import { toCsvTable, VOCABULARY_CSV_COLUMNS } from '@/lib/csv'
import { logError } from '@/lib/logger'
import { fail, GENERIC_ERROR, ok, type ActionResult } from '@/lib/result'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { customWordSchema, uuidSchema } from '@/lib/validation'

/** Creates one word that belongs to this learner only. */
export async function createCustomWord(
  input: unknown
): Promise<ActionResult<{ wordId: string }>> {
  const parsed = customWordSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return fail(issue?.message ?? 'Check the form.', issue?.path[0]?.toString())
  }

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const data = parsed.data

  try {
    const { data: word, error } = await supabase
      .from('words')
      .insert({
        lemma: data.lemma,
        part_of_speech: data.partOfSpeech,
        cefr: data.cefr,
        russian: data.russian,
        definition: data.definition || null,
        context_hint: data.contextHint || null,
        primary_answer: data.lemma,
        accepted_answers: data.acceptedAnswers,
        tags: data.tags,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        return fail('You have already added that word.', 'lemma')
      }
      throw error
    }

    if (data.example) {
      await supabase.from('word_examples').insert({
        word_id: word.id,
        sentence: data.example,
        cloze_sentence: buildCloze(data.example, data.lemma),
        position: 0,
      })
    }

    // Adding a word means you want to train it, so it enters the queue now.
    await supabase.from('user_words').upsert(
      { user_id: user.id, word_id: word.id, next_review_at: new Date().toISOString() },
      { onConflict: 'user_id,word_id', ignoreDuplicates: true }
    )

    revalidatePath('/words')
    return ok({ wordId: word.id })
  } catch (error) {
    logError('createCustomWord', error, { userId: user.id })
    return fail(GENERIC_ERROR)
  }
}

export async function deleteCustomWord(wordId: unknown): Promise<ActionResult<undefined>> {
  const parsed = uuidSchema.safeParse(wordId)
  if (!parsed.success) return fail('Unknown word.')

  const user = await requireUser()
  const supabase = await createServerSupabase()

  const { error } = await supabase
    .from('words')
    .delete()
    .eq('id', parsed.data)
    .eq('created_by', user.id)

  if (error) {
    logError('deleteCustomWord', error, { userId: user.id })
    return fail('We could not delete that word.')
  }

  revalidatePath('/words')
  return ok(undefined)
}

export interface ImportIssue {
  row: number
  message: string
}

export interface ImportSummary {
  imported: number
  skipped: number
  issues: ImportIssue[]
}

const importRowSchema = z.object({
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

/**
 * Imports a CSV of personal words.
 *
 * Nothing is written until every row has been checked, and the caller is told
 * exactly which rows failed and why rather than silently dropping them.
 */
export async function importCustomWords(csv: unknown): Promise<ActionResult<ImportSummary>> {
  if (typeof csv !== 'string' || csv.trim().length === 0) {
    return fail('Choose a CSV file first.')
  }
  if (csv.length > 400_000) {
    return fail('That file is too large. Split it into smaller batches.')
  }

  const user = await requireUser()
  const table = toCsvTable(csv)

  const missing = ['lemma', 'part_of_speech', 'cefr', 'russian'].filter(
    (column) => !table.headers.includes(column)
  )
  if (missing.length > 0) {
    return fail(`Missing required column(s): ${missing.join(', ')}. Expected: ${VOCABULARY_CSV_COLUMNS.join(', ')}.`)
  }
  if (table.rows.length === 0) return fail('That file has no data rows.')
  if (table.rows.length > 500) return fail('Import at most 500 rows at a time.')

  const issues: ImportIssue[] = []
  const valid: Array<z.infer<typeof importRowSchema>> = []
  const seen = new Set<string>()

  table.rows.forEach((row, index) => {
    const parsed = importRowSchema.safeParse(row)
    if (!parsed.success) {
      issues.push({
        row: index + 2,
        message: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
      })
      return
    }
    const key = `${parsed.data.lemma.toLowerCase()}::${parsed.data.part_of_speech}`
    if (seen.has(key)) {
      issues.push({ row: index + 2, message: 'Duplicate of an earlier row in this file.' })
      return
    }
    seen.add(key)
    valid.push(parsed.data)
  })

  if (valid.length === 0) {
    return ok({ imported: 0, skipped: table.rows.length, issues })
  }

  const supabase = await createServerSupabase()

  try {
    // Words the learner already added. Filtering here rather than relying on
    // an upsert keeps the duplicate report accurate and avoids depending on
    // index inference for a partial unique index.
    const { data: owned } = await supabase
      .from('words')
      .select('lemma, part_of_speech')
      .eq('created_by', user.id)

    const ownedKeys = new Set(
      (owned ?? []).map((row) => `${row.lemma.toLowerCase()}::${row.part_of_speech}`)
    )

    const fresh = valid.filter((row) => {
      const key = `${row.lemma.toLowerCase()}::${row.part_of_speech}`
      if (ownedKeys.has(key)) {
        issues.push({ row: 0, message: `“${row.lemma}” is already in your words.` })
        return false
      }
      return true
    })

    if (fresh.length === 0) {
      return ok({ imported: 0, skipped: table.rows.length, issues })
    }

    const { data: inserted, error } = await supabase
      .from('words')
      .insert(
        fresh.map((row) => ({
          lemma: row.lemma,
          part_of_speech: row.part_of_speech,
          cefr: row.cefr,
          russian: row.russian,
          definition: row.definition || null,
          context_hint: row.context || null,
          primary_answer: row.lemma,
          accepted_answers: splitList(row.accepted_answers),
          tags: splitList(row.tags),
          created_by: user.id,
        }))
      )
      .select('id, lemma, part_of_speech')

    if (error) throw error

    const rows = inserted ?? []
    const byKey = new Map(rows.map((row) => [`${row.lemma.toLowerCase()}::${row.part_of_speech}`, row.id]))

    const examples = fresh
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

    if (examples.length > 0) {
      await supabase.from('word_examples').insert(examples)
    }

    if (rows.length > 0) {
      await supabase.from('user_words').upsert(
        rows.map((row) => ({
          user_id: user.id,
          word_id: row.id,
          next_review_at: new Date().toISOString(),
        })),
        { onConflict: 'user_id,word_id', ignoreDuplicates: true }
      )
    }

    revalidatePath('/words')
    return ok({
      imported: rows.length,
      skipped: table.rows.length - rows.length,
      issues,
    })
  } catch (error) {
    logError('importCustomWords', error, { userId: user.id, rows: valid.length })
    return fail('The import failed. Nothing was changed.')
  }
}

function splitList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[;|]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, 12)
}
