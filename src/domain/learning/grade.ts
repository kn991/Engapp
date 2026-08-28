import { LAPSE_SCAFFOLD_REVIEWS } from './config'
import { classifyRecall, clampLatency, isSuccessBand, updateAverageLatency } from './latency'
import { computeMastery } from './mastery'
import { scheduleNextReview } from './scheduler'
import { xpForAttempt } from './xp'
import type { AttemptInput, AttemptOutcome, UserWordState } from './types'

export interface GradeInput extends AttemptInput {
  state: UserWordState
  now: Date
  /** Learner-local calendar day, `YYYY-MM-DD`. */
  day: string
  /** Consecutive instant recalls including this one, for combo XP. */
  comboLength: number
  random?: number
}

/**
 * The single place where one answer becomes new learning state.
 *
 * Classify how fast it came out, move mastery, decide when the word comes
 * back, and award XP. Everything downstream (UI, database writes, summaries)
 * reads the result of this function rather than recomputing it.
 */
export function gradeAttempt(input: GradeInput): AttemptOutcome {
  const { state, now, day } = input
  const latencyMs = clampLatency(input.latencyMs)

  const band = classifyRecall({
    latencyMs,
    wasCorrect: input.wasCorrect,
    hintLevel: input.hintLevel,
    revealed: input.revealed,
  })

  const mastery = computeMastery({
    state,
    band,
    hintLevel: input.hintLevel,
    isSpellingSlip: input.isSpellingSlip,
    latencyMs,
    day,
  })

  const schedule = scheduleNextReview({
    state,
    band,
    hintLevel: input.hintLevel,
    now,
    random: input.random,
  })

  const xp = xpForAttempt({
    band,
    hintLevel: input.hintLevel,
    isSpellingSlip: input.isSpellingSlip,
    comboLength: input.comboLength,
  })

  const succeeded = isSuccessBand(band)
  const failed = band === 'failed'
  const unaidedSuccess = succeeded && input.hintLevel === 0 && !input.isSpellingSlip

  const nextState: UserWordState = {
    ...state,
    status: mastery.status,
    mastery: mastery.mastery,
    reviewCount: state.reviewCount + 1,
    correctCount: state.correctCount + (input.wasCorrect ? 1 : 0),
    incorrectCount: state.incorrectCount + (input.wasCorrect ? 0 : 1),
    fastRecalls: state.fastRecalls + (succeeded ? 1 : 0),
    slowRecalls: state.slowRecalls + (band === 'slow' || band === 'fragile' ? 1 : 0),
    lapses: state.lapses + (failed && state.reviewCount > 0 ? 1 : 0),
    hintCount: state.hintCount + (input.hintLevel > 0 ? 1 : 0),
    avgLatencyMs: input.wasCorrect
      ? updateAverageLatency(state.avgLatencyMs, state.correctCount, latencyMs)
      : state.avgLatencyMs,
    recentLatencyMs: input.wasCorrect ? latencyMs : state.recentLatencyMs,
    bestLatencyMs:
      input.wasCorrect && (state.bestLatencyMs == null || latencyMs < state.bestLatencyMs)
        ? latencyMs
        : state.bestLatencyMs,
    successDays: mastery.successDays,
    lastSuccessDay: unaidedSuccess ? day : state.lastSuccessDay,
    intervalDays: schedule.intervalDays,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: schedule.nextReviewAt.toISOString(),
    activatedAt:
      mastery.justActivated && !state.activatedAt ? now.toISOString() : state.activatedAt,
  }

  return {
    band,
    masteryBefore: state.mastery,
    masteryAfter: mastery.mastery,
    statusBefore: state.status,
    statusAfter: mastery.status,
    nextReviewAt: schedule.nextReviewAt.toISOString(),
    intervalDays: schedule.intervalDays,
    xp,
    justActivated: mastery.justActivated,
    nextState,
  }
}

/**
 * After a lapse we deliberately go back to explicit cues for a couple of
 * reviews. Mastery already falls on failure, which pulls the exercise ladder
 * down; this makes the intent explicit for callers that need it.
 */
export function needsScaffolding(state: UserWordState): boolean {
  if (state.lapses === 0) return false
  return state.reviewCount - state.correctCount <= LAPSE_SCAFFOLD_REVIEWS
}

/** Fresh state for a word the learner has never seen. */
export function initialWordState(wordId: string): UserWordState {
  return {
    wordId,
    status: 'new',
    mastery: 0,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    fastRecalls: 0,
    slowRecalls: 0,
    lapses: 0,
    hintCount: 0,
    avgLatencyMs: null,
    recentLatencyMs: null,
    bestLatencyMs: null,
    successDays: 0,
    lastSuccessDay: null,
    intervalDays: 0,
    lastReviewedAt: null,
    nextReviewAt: null,
    activatedAt: null,
  }
}
