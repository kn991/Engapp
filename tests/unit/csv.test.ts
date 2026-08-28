import { describe, expect, it } from 'vitest'
import { parseCsv, toCsv, toCsvTable, VOCABULARY_CSV_TEMPLATE } from '@/lib/csv'
import { buildCloze } from '@/lib/cloze'

describe('parseCsv', () => {
  it('reads plain rows', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('keeps commas inside quoted fields', () => {
    expect(parseCsv('a,b\n"one, two",three')).toEqual([
      ['a', 'b'],
      ['one, two', 'three'],
    ])
  })

  it('unescapes doubled quotes', () => {
    expect(parseCsv('a\n"He said ""no"""')).toEqual([['a'], ['He said "no"']])
  })

  it('handles Windows line endings and a trailing newline', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('drops a byte order mark from the first header', () => {
    expect(parseCsv('﻿lemma,cefr\navoid,B1')[0]?.[0]).toBe('lemma')
  })

  it('skips blank lines', () => {
    expect(parseCsv('a\n\nb')).toEqual([['a'], ['b']])
  })

  it('preserves non-Latin text', () => {
    expect(parseCsv('russian\nизбегать')).toEqual([['russian'], ['избегать']])
  })
})

describe('toCsvTable', () => {
  it('keys rows by lower-cased header', () => {
    const table = toCsvTable('Lemma,CEFR\navoid,B1')
    expect(table.headers).toEqual(['lemma', 'cefr'])
    expect(table.rows[0]).toEqual({ lemma: 'avoid', cefr: 'B1' })
  })

  it('fills missing trailing columns with empty strings', () => {
    const table = toCsvTable('lemma,cefr,russian\navoid,B1')
    expect(table.rows[0]?.russian).toBe('')
  })

  it('returns nothing useful for an empty file', () => {
    expect(toCsvTable('')).toEqual({ headers: [], rows: [] })
  })
})

describe('toCsv', () => {
  it('quotes only what needs quoting', () => {
    expect(toCsv([['a', 'b, c', 'd"e']])).toBe('a,"b, c","d""e"')
  })

  it('round-trips through the parser', () => {
    const rows = [
      ['lemma', 'note'],
      ['put off', 'delay, postpone'],
    ]
    expect(parseCsv(toCsv(rows))).toEqual(rows)
  })
})

describe('VOCABULARY_CSV_TEMPLATE', () => {
  it('parses into a header and one example row', () => {
    const table = toCsvTable(VOCABULARY_CSV_TEMPLATE)
    expect(table.headers).toContain('lemma')
    expect(table.rows).toHaveLength(1)
  })
})

describe('buildCloze', () => {
  it('replaces the target word with a gap', () => {
    expect(buildCloze('I try to avoid conflict.', 'avoid')).toBe('I try to ___ conflict.')
  })

  it('is case insensitive', () => {
    expect(buildCloze('Avoid conflict.', 'avoid')).toBe('___ conflict.')
  })

  it('does not match inside a longer word', () => {
    expect(buildCloze('She is avoiding it.', 'avoid')).toBeNull()
  })

  it('returns null when the word is absent', () => {
    expect(buildCloze('Nothing here.', 'avoid')).toBeNull()
  })

  it('is safe with regex characters in the word', () => {
    expect(buildCloze('That costs $5 (roughly).', 'roughly')).toBe('That costs $5 (___).')
  })
})
