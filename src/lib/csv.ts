/**
 * A small RFC 4180 style CSV reader.
 *
 * Vocabulary imports contain commas, quotes and non-Latin text, so splitting
 * on commas is not enough. This handles quoted fields, escaped quotes and
 * both line ending styles, and nothing else.
 */

export function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0

  // A BOM from Excel would otherwise become part of the first header.
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input

  while (i < text.length) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += char
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      i += 1
      continue
    }
    if (char === '\r') {
      i += 1
      continue
    }
    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
      continue
    }

    field += char
    i += 1
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((entry) => entry.some((value) => value.trim().length > 0))
}

export interface CsvTable {
  headers: string[]
  rows: Array<Record<string, string>>
}

/** Turns a CSV into objects keyed by lower-cased header. */
export function toCsvTable(input: string): CsvTable {
  const parsed = parseCsv(input)
  const [headerRow, ...dataRows] = parsed
  if (!headerRow) return { headers: [], rows: [] }

  const headers = headerRow.map((header) => header.trim().toLowerCase())
  const rows = dataRows.map((values) => {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = (values[index] ?? '').trim()
    })
    return record
  })

  return { headers, rows }
}

export function toCsv(rows: Array<Array<string | number | null>>): string {
  return rows
    .map((row) =>
      row
        .map((value) => {
          const text = value === null ? '' : String(value)
          return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
        })
        .join(',')
    )
    .join('\n')
}

export const VOCABULARY_CSV_COLUMNS = [
  'lemma',
  'part_of_speech',
  'cefr',
  'russian',
  'definition',
  'context',
  'example',
  'accepted_answers',
  'tags',
] as const

export const VOCABULARY_CSV_TEMPLATE = toCsv([
  [...VOCABULARY_CSV_COLUMNS],
  [
    'hesitate',
    'verb',
    'B1',
    'колебаться',
    'to pause before doing something because you are not certain',
    'You stop for a moment because you are not sure.',
    'Do not hesitate to ask if anything is unclear.',
    'pause',
    'communication;emotions',
  ],
])
