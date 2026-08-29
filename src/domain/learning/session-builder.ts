import { LATENCY_THRESHOLDS, SESSION, SESSION_MIX } from './config'
import { buildSessionItem, chooseExerciseType } from './exercise'
import { createRandom, shuffle } from './random'
import type { SessionItem, SessionItemSource, UserWordState, Word } from './types'

export interface CandidateWord {
  word: Word
  state: UserWordState
}

export interface BuildSessionInput {
  candidates: CandidateWord[]
  now: Date
  /** Daily goal in minutes; drives how many items we queue. */
  goalMinutes: number
  seed: number
  /** Hard override for the item count, used by the diagnostic. */
  itemCount?: number
}

export interface BuiltSession {
  items: SessionItem[]
  counts: Record<SessionItemSource, number>
}

/**
 * Builds the queue for one session.
 *
 * Priorities, in order: words that are overdue, words that keep failing, words
 * that come back but come back slowly, a small number of new words to activate,
 * and a few already-active words for maintenance. The final pass interleaves
 * everything so the learner never gets the same word twice in a row or a run of
 * identical exercise formats.
 */
export function buildSession({
  candidates,
  now,
  goalMinutes,
  seed,
  itemCount,
}: BuildSessionInput): BuiltSession {
  const random = createRandom(seed)
  const target = itemCount ?? targetItemCount(goalMinutes)

  const buckets = partition(candidates, now)

  const quota: Array<[SessionItemSource, number]> = [
    ['due', Math.round(target * SESSION_MIX.due)],
    ['weak', Math.round(target * SESSION_MIX.weak)],
    ['new', Math.min(Math.round(target * SESSION_MIX.new), SESSION.maxNewPerSession)],
    ['maintenance', Math.round(target * SESSION_MIX.maintenance)],
    ['challenge', Math.round(target * SESSION_MIX.challenge)],
  ]

  const used = new Set<string>()
  const picked: Array<{ candidate: CandidateWord; source: SessionItemSource }> = []

  for (const [source, count] of quota) {
    const pool = buckets[source].filter((c) => !used.has(c.word.id))
    for (const candidate of pool.slice(0, Math.max(0, count))) {
      used.add(candidate.word.id)
      picked.push({ candidate, source })
    }
  }

  // Backfill from whatever is left so short queues still fill the session.
  if (picked.length < target) {
    const order: SessionItemSource[] = ['due', 'weak', 'slow', 'maintenance', 'new', 'challenge']
    for (const source of order) {
      for (const candidate of buckets[source]) {
        if (picked.length >= target) break
        if (used.has(candidate.word.id)) continue
        used.add(candidate.word.id)
        picked.push({ candidate, source })
      }
      if (picked.length >= target) break
    }
  }

  const items = picked.map(({ candidate, source }, index) =>
    buildSessionItem({
      word: candidate.word,
      state: candidate.state,
      exerciseType: chooseExerciseType(candidate.word, candidate.state, random),
      source,
      id: `${candidate.word.id}:${index}`,
      random,
    })
  )

  const ordered = interleave(items, random)

  const counts = ordered.reduce<Record<SessionItemSource, number>>(
    (acc, item) => {
      acc[item.source] += 1
      return acc
    },
    { due: 0, weak: 0, slow: 0, new: 0, maintenance: 0, challenge: 0, diagnostic: 0 }
  )

  return { items: ordered, counts }
}

export function targetItemCount(goalMinutes: number): number {
  const raw = Math.round((goalMinutes * 60) / SESSION.secondsPerItem)
  return Math.max(SESSION.minItems, Math.min(SESSION.maxItems, raw))
}

function partition(
  candidates: CandidateWord[],
  now: Date
): Record<SessionItemSource, CandidateWord[]> {
  const buckets: Record<SessionItemSource, CandidateWord[]> = {
    due: [],
    weak: [],
    slow: [],
    new: [],
    maintenance: [],
    challenge: [],
    diagnostic: [],
  }

  for (const candidate of candidates) {
    const { state } = candidate
    const isNew = state.reviewCount === 0
    const due = !state.nextReviewAt || new Date(state.nextReviewAt).getTime() <= now.getTime()

    if (isNew) {
      buckets.new.push(candidate)
      continue
    }
    if (state.status === 'weak' || state.lapses >= 2) {
      buckets.weak.push(candidate)
      if (due) buckets.due.push(candidate)
      continue
    }
    if (
      state.recentLatencyMs != null &&
      state.recentLatencyMs >= LATENCY_THRESHOLDS.good &&
      state.status !== 'active'
    ) {
      buckets.slow.push(candidate)
      if (due) buckets.due.push(candidate)
      continue
    }
    if (due) {
      buckets.due.push(candidate)
      continue
    }
    if (state.status === 'active' || state.status === 'strong') {
      buckets.maintenance.push(candidate)
      continue
    }
    buckets.challenge.push(candidate)
  }

  // Most overdue first, then slowest.
  buckets.due.sort((a, b) => dueScore(b.state, now) - dueScore(a.state, now))
  buckets.weak.sort((a, b) => a.state.mastery - b.state.mastery)
  buckets.slow.sort((a, b) => (b.state.recentLatencyMs ?? 0) - (a.state.recentLatencyMs ?? 0))
  buckets.maintenance.sort((a, b) => dueScore(b.state, now) - dueScore(a.state, now))

  return buckets
}

function dueScore(state: UserWordState, now: Date): number {
  if (!state.nextReviewAt) return Number.MAX_SAFE_INTEGER
  return now.getTime() - new Date(state.nextReviewAt).getTime()
}

/**
 * Reorders the queue so the same word never appears twice close together and
 * the exercise format keeps changing. Sessions that vary feel shorter and stop
 * the learner from pattern-matching one format.
 */
export function interleave(items: SessionItem[], random: () => number): SessionItem[] {
  const pool = shuffle(items, random)
  const result: SessionItem[] = []

  while (pool.length > 0) {
    let chosenIndex = 0
    for (let i = 0; i < pool.length; i += 1) {
      const candidate = pool[i]
      if (!candidate) continue
      if (isPlacementOk(result, candidate)) {
        chosenIndex = i
        break
      }
    }
    const [chosen] = pool.splice(chosenIndex, 1)
    if (chosen) result.push(chosen)
  }

  return result
}

function isPlacementOk(placed: SessionItem[], candidate: SessionItem): boolean {
  const window = placed.slice(-SESSION.minGapBetweenSameWord)
  if (window.some((item) => item.word.id === candidate.word.id)) return false

  const tail = placed.slice(-SESSION.maxConsecutiveSameType)
  if (
    tail.length === SESSION.maxConsecutiveSameType &&
    tail.every((item) => item.exerciseType === candidate.exerciseType)
  ) {
    return false
  }
  return true
}
