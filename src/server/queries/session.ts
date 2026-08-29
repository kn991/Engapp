import 'server-only'

import {
  buildSession,
  DIAGNOSTIC,
  initialWordState,
  type CandidateWord,
  type SessionItem,
  type Word,
} from '@/domain/learning'
import { seedFromString } from '@/domain/learning/random'
import { createServerSupabase } from '@/lib/supabase/server'
import { toUserWordState, toWord, WORD_SELECT, type WordRowWithDetails } from '@/server/mappers'
import type { CefrLevelDb } from '@/types/database'

/** How many stored words we consider before the builder narrows the queue. */
const CANDIDATE_LIMIT = 140
const NEW_CANDIDATE_LIMIT = 25

export interface SessionQueue {
  items: SessionItem[]
  /** Words waiting for review right now, for the home screen. */
  dueCount: number
}

interface LoadOptions {
  userId: string
  goalMinutes: number
  itemCount?: number
  levels?: CefrLevelDb[]
  seed?: string
}

/**
 * Builds one session's queue in a single round trip pair: stored words with
 * their state, plus a handful of untouched curated words. Everything else is
 * decided in the pure session builder.
 */
export async function loadSessionQueue({
  userId,
  goalMinutes,
  itemCount,
  levels,
  seed,
}: LoadOptions): Promise<SessionQueue> {
  const supabase = await createServerSupabase()
  const now = new Date()

  const [{ data: userWordRows }, { data: newWordRows }, { data: acceptedRows }] = await Promise.all([
    supabase
      .from('user_words')
      .select(`*, words!inner(${WORD_SELECT})`)
      .eq('user_id', userId)
      .order('next_review_at', { ascending: true, nullsFirst: true })
      .limit(CANDIDATE_LIMIT),
    supabase.rpc('new_word_candidates', {
      p_limit: NEW_CANDIDATE_LIMIT,
      p_levels: levels ?? null,
    }),
    supabase.from('user_accepted_answers').select('word_id, answer').eq('user_id', userId),
  ])

  const acceptedByWord = new Map<string, string[]>()
  for (const row of acceptedRows ?? []) {
    const list = acceptedByWord.get(row.word_id) ?? []
    list.push(row.answer)
    acceptedByWord.set(row.word_id, list)
  }

  const candidates: CandidateWord[] = []
  let dueCount = 0

  for (const row of userWordRows ?? []) {
    const wordRow = (row as unknown as { words: WordRowWithDetails }).words
    if (!wordRow) continue
    const word = toWord(wordRow, acceptedByWord.get(wordRow.id) ?? [])
    const state = toUserWordState(row)
    candidates.push({ word, state })
    if (!state.nextReviewAt || new Date(state.nextReviewAt).getTime() <= now.getTime()) {
      dueCount += 1
    }
  }

  // New words arrive without detail rows from the RPC, so fetch those in bulk.
  const newIds = (newWordRows ?? []).map((row) => row.id)
  if (newIds.length > 0) {
    const { data: detailed } = await supabase
      .from('words')
      .select(WORD_SELECT)
      .in('id', newIds)
    for (const row of (detailed ?? []) as WordRowWithDetails[]) {
      candidates.push({ word: toWord(row), state: initialWordState(row.id) })
    }
  }

  const built = buildSession({
    candidates,
    now,
    goalMinutes,
    itemCount,
    seed: seedFromString(seed ?? `${userId}:${now.toISOString().slice(0, 13)}`),
  })

  return { items: built.items, dueCount }
}

/**
 * The onboarding diagnostic uses the same machinery but draws only from
 * untouched words, weighted towards the level the learner declared.
 */
export async function loadDiagnosticQueue(
  userId: string,
  declaredLevel: string
): Promise<SessionItem[]> {
  const supabase = await createServerSupabase()
  const weights = DIAGNOSTIC.levelWeights[declaredLevel] ?? DIAGNOSTIC.levelWeights.unsure ?? {}

  const { data } = await supabase.rpc('new_word_candidates', {
    p_limit: 100,
    p_levels: null,
  })

  const byLevel = new Map<string, Word[]>()
  const rows = (data ?? []) as WordRowWithDetails[]

  const detailIds = rows.map((row) => row.id)
  const { data: detailed } = detailIds.length
    ? await supabase.from('words').select(WORD_SELECT).in('id', detailIds)
    : { data: [] }

  for (const row of (detailed ?? []) as WordRowWithDetails[]) {
    const list = byLevel.get(row.cefr) ?? []
    list.push(toWord(row))
    byLevel.set(row.cefr, list)
  }

  const picked: CandidateWord[] = []
  for (const [level, share] of Object.entries(weights)) {
    const pool = byLevel.get(level) ?? []
    const take = Math.round(DIAGNOSTIC.itemCount * share)
    for (const word of pool.slice(0, take)) {
      picked.push({ word, state: initialWordState(word.id) })
    }
  }

  // Top up if a level bucket was short.
  if (picked.length < DIAGNOSTIC.itemCount) {
    const used = new Set(picked.map((c) => c.word.id))
    for (const list of byLevel.values()) {
      for (const word of list) {
        if (picked.length >= DIAGNOSTIC.itemCount) break
        if (used.has(word.id)) continue
        used.add(word.id)
        picked.push({ word, state: initialWordState(word.id) })
      }
    }
  }

  const built = buildSession({
    candidates: picked,
    now: new Date(),
    goalMinutes: 10,
    itemCount: DIAGNOSTIC.itemCount,
    seed: seedFromString(`${userId}:diagnostic`),
  })

  // The diagnostic always uses the most explicit cue: we are measuring how fast
  // a known meaning turns into a word, not how well someone reads definitions.
  return built.items.map((item) => ({
    ...item,
    source: 'diagnostic' as const,
    exerciseType: 'translation_recall' as const,
    prompt: item.word.russian,
    promptSecondary:
      item.word.examples.find((example) => example.clozeSentence)?.clozeSentence ??
      item.word.contextHint,
    promptLang: 'ru' as const,
    promptSecondaryLang: 'en' as const,
    answer: item.word.primaryAnswer,
    acceptedAnswers: item.word.acceptedAnswers,
  }))
}
