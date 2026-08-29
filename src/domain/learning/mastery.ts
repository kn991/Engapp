import {
  ACTIVATION_RULES,
  HINT_MASTERY_PENALTY,
  MASTERY_BOUNDS,
  MASTERY_DELTAS,
  SPELLING_SLIP_MASTERY_PENALTY,
  STATUS_THRESHOLDS,
} from './config'
import { isSuccessBand } from './latency'
import type { RecallBand, UserWordState, WordStatus } from './types'

export interface MasteryInput {
  state: UserWordState
  band: RecallBand
  hintLevel: number
  isSpellingSlip: boolean
  latencyMs: number
  /** Calendar day of the attempt in the learner's timezone, `YYYY-MM-DD`. */
  day: string
}

export interface MasteryResult {
  mastery: number
  status: WordStatus
  successDays: number
  justActivated: boolean
}

export function clampMastery(value: number): number {
  return Math.max(MASTERY_BOUNDS.min, Math.min(MASTERY_BOUNDS.max, Math.round(value)))
}

/** Maps a mastery number to its named band. */
export function statusForMastery(mastery: number): WordStatus {
  for (const entry of STATUS_THRESHOLDS) {
    if (mastery >= entry.min) return entry.status
  }
  return 'new'
}

/**
 * The mastery number answers one question: how reliably can this learner
 * produce this word under time pressure? Speed moves it as much as
 * correctness, and help received moves it back.
 */
export function computeMastery(input: MasteryInput): MasteryResult {
  const { state, band, hintLevel, isSpellingSlip } = input

  let delta = MASTERY_DELTAS[band]

  if (delta > 0) {
    delta -= HINT_MASTERY_PENALTY[Math.min(hintLevel, HINT_MASTERY_PENALTY.length - 1)] ?? 0
    if (isSpellingSlip) delta -= SPELLING_SLIP_MASTERY_PENALTY
    // Progress gets harder near the top: the last ten points are the ones that
    // separate "usually finds it" from "always finds it".
    if (state.mastery >= 75) delta *= 0.6
    else if (state.mastery >= 50) delta *= 0.85
    delta = Math.max(delta, 1)
  } else if (delta < 0) {
    // Words that were solid do not collapse from one bad morning.
    if (state.mastery >= 90) delta *= 0.7
  }

  const mastery = clampMastery(state.mastery + delta)

  const unaidedSuccess = isSuccessBand(band) && hintLevel === 0 && !isSpellingSlip
  const isNewDay = unaidedSuccess && state.lastSuccessDay !== input.day
  const successDays = state.successDays + (isNewDay ? 1 : 0)

  const fastRecalls = state.fastRecalls + (isSuccessBand(band) ? 1 : 0)

  const meetsActivation =
    mastery >= ACTIVATION_RULES.minMastery &&
    successDays >= ACTIVATION_RULES.minSuccessDays &&
    fastRecalls >= ACTIVATION_RULES.minFastRecalls &&
    unaidedSuccess &&
    input.latencyMs <= ACTIVATION_RULES.maxRecentLatencyMs

  let status = statusForMastery(mastery)
  // Reaching 90 is necessary but not sufficient: without repeated unaided
  // recalls on separate days the word is strong, not yet active.
  if (status === 'active' && !meetsActivation && !state.activatedAt) {
    status = 'strong'
  }

  const justActivated = status === 'active' && !state.activatedAt

  return { mastery, status, successDays, justActivated }
}

/** Progress towards the next status band, 0-1, for progress bars. */
export function masteryProgressWithinStatus(mastery: number): number {
  const sorted = [...STATUS_THRESHOLDS].sort((a, b) => a.min - b.min)
  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i]
    const next = sorted[i + 1]
    if (!current) break
    if (!next) return 1
    if (mastery >= current.min && mastery < next.min) {
      return (mastery - current.min) / (next.min - current.min)
    }
  }
  return 0
}

export const STATUS_LABELS: Record<WordStatus, string> = {
  new: 'New',
  weak: 'Weak',
  activating: 'Activating',
  strong: 'Strong',
  active: 'Active',
}

export const STATUS_DESCRIPTIONS: Record<WordStatus, string> = {
  new: 'Not trained yet.',
  weak: 'Comes back slowly, or not at all.',
  activating: 'Surfacing, but still needs a moment.',
  strong: 'Almost there. A few more clean recalls.',
  active: 'You can retrieve it reliably.',
}
