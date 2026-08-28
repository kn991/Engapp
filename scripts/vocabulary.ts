import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { z } from 'zod'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '../src/domain/learning/types'

/**
 * Parser for `data/vocabulary.txt`.
 *
 * The source file is a pipe separated text format rather than JSON so that
 * adding a word stays a one line edit and diffs stay readable.
 */

const exampleSchema = z.object({
  sentence: z.string().min(1).max(400),
  cloze: z.string().max(400).nullable(),
})

const collocationSchema = z.object({
  collocation: z.string().min(1).max(120),
  pattern: z.string().min(1).max(120),
  meaningRu: z.string().max(200).nullable(),
})

const familySchema = z.object({
  form: z.string().min(1).max(80),
  partOfSpeech: z.enum(PARTS_OF_SPEECH),
  gloss: z.string().max(200).nullable(),
})

export const entrySchema = z.object({
  lemma: z.string().min(1).max(80),
  partOfSpeech: z.enum(PARTS_OF_SPEECH),
  cefr: z.enum(CEFR_LEVELS),
  russian: z.string().min(1).max(200),
  definition: z.string().max(300).nullable(),
  contextHint: z.string().max(300).nullable(),
  tags: z.array(z.string().min(1).max(30)).max(12),
  examples: z.array(exampleSchema).max(5),
  collocations: z.array(collocationSchema).max(6),
  family: z.array(familySchema).max(6),
  accepted: z.array(z.string().min(1).max(80)).max(12),
})

export type VocabularyEntry = z.infer<typeof entrySchema>

/** UUID v5 so the same lemma always gets the same id across environments. */
const NAMESPACE = '6f1d0b3a-3d1a-4f4d-9d38-2b7d1e5c9a41'

export function deterministicUuid(name: string): string {
  const nsBytes = Buffer.from(NAMESPACE.replace(/-/g, ''), 'hex')
  const hash = createHash('sha1').update(nsBytes).update(name, 'utf8').digest()
  const bytes = Buffer.from(hash.subarray(0, 16))
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x50
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function wordId(entry: Pick<VocabularyEntry, 'lemma' | 'partOfSpeech'>): string {
  return deterministicUuid(`${entry.lemma.toLowerCase()}::${entry.partOfSpeech}`)
}

function splitList(value: string, separator: string): string[] {
  return value
    .split(separator)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function nullable(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : null
}

export function parseVocabulary(source: string): VocabularyEntry[] {
  const entries: VocabularyEntry[] = []
  const seen = new Set<string>()

  source.split('\n').forEach((rawLine, index) => {
    const line = rawLine.trim()
    if (line.length === 0 || line.startsWith('#')) return

    const cols = line.split('|')
    if (cols.length < 10) {
      throw new Error(`Line ${index + 1}: expected at least 10 columns, got ${cols.length}`)
    }

    const candidate = {
      lemma: (cols[0] ?? '').trim(),
      partOfSpeech: (cols[1] ?? '').trim(),
      cefr: (cols[2] ?? '').trim(),
      russian: (cols[3] ?? '').trim(),
      definition: nullable(cols[4]),
      contextHint: nullable(cols[5]),
      tags: splitList(cols[6] ?? '', ','),
      examples: splitList(cols[7] ?? '', ';;').map((chunk) => {
        const [sentence, cloze] = chunk.split('~')
        return { sentence: (sentence ?? '').trim(), cloze: nullable(cloze) }
      }),
      collocations: splitList(cols[8] ?? '', ';;').map((chunk) => {
        const [collocation, pattern, meaningRu] = chunk.split('~')
        return {
          collocation: (collocation ?? '').trim(),
          pattern: (pattern ?? '').trim(),
          meaningRu: nullable(meaningRu),
        }
      }),
      family: splitList(cols[9] ?? '', ';;').map((chunk) => {
        const [form, pos, gloss] = chunk.split('~')
        return {
          form: (form ?? '').trim(),
          partOfSpeech: (pos ?? '').trim(),
          gloss: nullable(gloss),
        }
      }),
      accepted: splitList(cols[10] ?? '', ','),
    }

    const parsed = entrySchema.safeParse(candidate)
    if (!parsed.success) {
      throw new Error(
        `Line ${index + 1} (${candidate.lemma}): ${parsed.error.issues
          .map((i) => `${i.path.join('.')} ${i.message}`)
          .join('; ')}`
      )
    }

    const key = `${parsed.data.lemma.toLowerCase()}::${parsed.data.partOfSpeech}`
    if (seen.has(key)) {
      throw new Error(`Line ${index + 1}: duplicate entry for ${key}`)
    }
    seen.add(key)

    // A pattern without a gap cannot be turned into a question.
    for (const collocation of parsed.data.collocations) {
      if (!collocation.pattern.includes('___')) {
        throw new Error(
          `Line ${index + 1} (${parsed.data.lemma}): collocation pattern must contain ___`
        )
      }
    }

    entries.push(parsed.data)
  })

  return entries
}

export function loadVocabulary(path = 'data/vocabulary.txt'): VocabularyEntry[] {
  return parseVocabulary(readFileSync(path, 'utf8'))
}

export function sqlString(value: string | null): string {
  if (value === null) return 'null'
  return `'${value.replace(/'/g, "''")}'`
}

export function sqlTextArray(values: readonly string[]): string {
  if (values.length === 0) return `'{}'`
  const inner = values.map((v) => `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')
  return `'{${inner.replace(/'/g, "''")}}'`
}
