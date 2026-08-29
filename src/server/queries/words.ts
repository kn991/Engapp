import 'server-only'

import { toUserWordState, toWord, WORD_SELECT, type WordRowWithDetails } from '@/server/mappers'
import { createServerSupabase } from '@/lib/supabase/server'
import type { UserWordState, Word, WordStatus } from '@/domain/learning'
import type { RecallBandDb } from '@/types/database'

export type WordFilter = 'all' | 'active' | 'activating' | 'weak' | 'new' | 'custom'

export interface WordListEntry {
  word: Word
  state: UserWordState
}

export interface WordListResult {
  entries: WordListEntry[]
  hasMore: boolean
}

const PAGE_SIZE = 30

const STATUS_BY_FILTER: Partial<Record<WordFilter, WordStatus[]>> = {
  active: ['active'],
  activating: ['activating', 'strong'],
  weak: ['weak'],
  new: ['new'],
}

/** The Words list: user state joined with the dictionary entry. */
export async function loadWordList({
  userId,
  filter,
  search,
  page = 0,
}: {
  userId: string
  filter: WordFilter
  search: string
  page?: number
}): Promise<WordListResult> {
  const supabase = await createServerSupabase()

  let query = supabase
    .from('user_words')
    .select(`*, words!inner(${WORD_SELECT})`)
    .eq('user_id', userId)

  const statuses = STATUS_BY_FILTER[filter]
  if (statuses) query = query.in('status', statuses)
  if (filter === 'custom') query = query.not('words.created_by', 'is', null)

  const term = search.trim()
  if (term.length > 0) {
    const escaped = term.replace(/[%,()]/g, ' ').trim()
    if (escaped.length > 0) {
      query = query.or(
        `lemma.ilike.%${escaped}%,russian.ilike.%${escaped}%,tags.cs.{${escaped}}`,
        { referencedTable: 'words' }
      )
    }
  }

  const { data, error } = await query
    .order('next_review_at', { ascending: true, nullsFirst: true })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  if (error || !data) return { entries: [], hasMore: false }

  const rows = data.slice(0, PAGE_SIZE)
  const entries: WordListEntry[] = []
  for (const row of rows) {
    const wordRow = (row as unknown as { words: WordRowWithDetails | null }).words
    if (!wordRow) continue
    entries.push({ word: toWord(wordRow), state: toUserWordState(row) })
  }

  return { entries, hasMore: data.length > PAGE_SIZE }
}

export interface WordDetail extends WordListEntry {
  history: Array<{ day: string; latencyMs: number; wasCorrect: boolean; band: RecallBandDb }>
}

export async function loadWordDetail(
  userId: string,
  wordId: string
): Promise<WordDetail | null> {
  const supabase = await createServerSupabase()

  const [{ data: row }, { data: history }] = await Promise.all([
    supabase
      .from('user_words')
      .select(`*, words!inner(${WORD_SELECT})`)
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .maybeSingle(),
    supabase.rpc('word_latency_history', { p_word_id: wordId, p_limit: 40 }),
  ])

  if (!row) return null
  const wordRow = (row as unknown as { words: WordRowWithDetails | null }).words
  if (!wordRow) return null

  return {
    word: toWord(wordRow),
    state: toUserWordState(row),
    history: [...(history ?? [])]
      .reverse()
      .map((entry) => ({
        day: entry.day,
        latencyMs: entry.latency_ms,
        wasCorrect: entry.was_correct,
        band: entry.band,
      })),
  }
}
