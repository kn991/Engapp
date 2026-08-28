import { INTERVAL_LADDER, SCHEDULER } from './config'
import type { RecallBand, UserWordState } from './types'

export interface ScheduleInput {
  state: UserWordState
  band: RecallBand
  hintLevel: number
  /** Attempt time. Injected so the scheduler stays pure and testable. */
  now: Date
  /** Deterministic 0-1 value used for interval fuzzing. */
  random?: number
}

export interface ScheduleResult {
  intervalDays: number
  nextReviewAt: Date
  /** True when the word should come back inside the current session/day. */
  relearnToday: boolean
}

/**
 * Spaced repetition tuned for production rather than recognition.
 *
 * Standard SM-2 asks "did you remember it?". That is the wrong question here,
 * because the learner usually does remember it - eventually. This scheduler
 * asks "did it come out fast enough to use in a sentence?", so a correct but
 * nine-second answer earns almost no extra spacing, and an instant one earns
 * a big jump.
 */
export function scheduleNextReview({
  state,
  band,
  hintLevel,
  now,
  random = 0.5,
}: ScheduleInput): ScheduleResult {
  if (band === 'failed') {
    const next = new Date(now.getTime() + SCHEDULER.relearnMinutes * 60_000)
    return { intervalDays: 0, nextReviewAt: next, relearnToday: true }
  }

  const currentIndex = ladderIndexFor(state.intervalDays)
  const bandStep = SCHEDULER.bandStep[band]
  const hintPenalty = SCHEDULER.hintStepPenalty[Math.min(hintLevel, SCHEDULER.hintStepPenalty.length - 1)] ?? 0

  let nextIndex = currentIndex + bandStep - hintPenalty
  nextIndex = Math.max(0, Math.min(nextIndex, INTERVAL_LADDER.length - 1))

  let intervalDays: number = INTERVAL_LADDER[nextIndex] ?? 1

  // A word that keeps falling over does not deserve a long holiday, even after
  // one good answer.
  if (state.lapses >= SCHEDULER.lapsePenaltyThreshold) {
    intervalDays = Math.max(0, intervalDays * SCHEDULER.lapsePenalty)
  }

  if (intervalDays <= 0) {
    const next = new Date(now.getTime() + SCHEDULER.relearnMinutes * 60_000)
    return { intervalDays: 0, nextReviewAt: next, relearnToday: true }
  }

  intervalDays = Math.min(intervalDays, SCHEDULER.maxIntervalDays)

  const fuzz = 1 + (random * 2 - 1) * SCHEDULER.fuzzRatio
  const fuzzed = Math.max(0.5, intervalDays * fuzz)
  const nextReviewAt = new Date(now.getTime() + fuzzed * 24 * 60 * 60 * 1000)

  return {
    intervalDays: roundInterval(intervalDays),
    nextReviewAt,
    relearnToday: false,
  }
}

/** Nearest ladder position at or below the current interval. */
export function ladderIndexFor(intervalDays: number): number {
  let index = 0
  for (let i = 0; i < INTERVAL_LADDER.length; i += 1) {
    const value = INTERVAL_LADDER[i] ?? 0
    if (value <= intervalDays) index = i
    else break
  }
  return index
}

function roundInterval(days: number): number {
  return days < 1 ? Number(days.toFixed(2)) : Math.round(days)
}

export function isDue(state: UserWordState, now: Date): boolean {
  if (!state.nextReviewAt) return true
  return new Date(state.nextReviewAt).getTime() <= now.getTime()
}

/** `Tomorrow`, `In 3 days`, `Sep 2` - short enough for a list row. */
export function formatNextReview(
  nextReviewAt: string | Date | null,
  now: Date = new Date(),
  locale = 'en-US'
): string {
  if (!nextReviewAt) return 'Ready now'
  const target = typeof nextReviewAt === 'string' ? new Date(nextReviewAt) : nextReviewAt
  if (Number.isNaN(target.getTime())) return '—'

  const diffMs = target.getTime() - now.getTime()
  if (diffMs <= 0) return 'Ready now'

  const diffDays = diffMs / (24 * 60 * 60 * 1000)
  if (diffDays < 1) {
    const minutes = Math.round(diffMs / 60_000)
    if (minutes < 60) return `In ${Math.max(1, minutes)} min`
    return `In ${Math.round(minutes / 60)} h`
  }
  if (diffDays < 2) return 'Tomorrow'
  if (diffDays < 7) return `In ${Math.round(diffDays)} days`
  return target.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
