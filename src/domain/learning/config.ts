import type { ExerciseType, RecallBand, WordStatus } from './types'

/**
 * Every tunable number in the learning engine lives here so the algorithm can
 * be adjusted without hunting through the code.
 */

/** Recall-speed thresholds, in milliseconds. */
export const LATENCY_THRESHOLDS = {
  instant: 2_500,
  good: 5_000,
  slow: 10_000,
} as const

/** Attempts longer than this are almost always "walked away from the phone". */
export const MAX_CREDITED_LATENCY_MS = 120_000

export const BAND_LABELS: Record<RecallBand, string> = {
  instant: 'Instant',
  good: 'Good',
  slow: 'Slow',
  fragile: 'Fragile',
  failed: 'Missed',
}

/** Mastery deltas applied on top of the base value for each band. */
export const MASTERY_DELTAS: Record<RecallBand, number> = {
  instant: 12,
  good: 8,
  slow: 3,
  fragile: 1,
  failed: -18,
}

/** Extra penalty per hint level used (1 = context, 2 = first letter, 3 = more). */
export const HINT_MASTERY_PENALTY = [0, 3, 6, 9] as const

/** A spelling slip still shows recall happened; it just costs a little. */
export const SPELLING_SLIP_MASTERY_PENALTY = 4
export const SPELLING_SLIP_MAX_EDIT_DISTANCE = 2
/** Below this length a single wrong letter usually means a different word. */
export const SPELLING_TOLERANCE_MIN_LENGTH = 5

export const MASTERY_BOUNDS = { min: 0, max: 100 } as const

/** Lower bound of each status band. */
export const STATUS_THRESHOLDS: Array<{ status: WordStatus; min: number }> = [
  { status: 'active', min: 90 },
  { status: 'strong', min: 75 },
  { status: 'activating', min: 50 },
  { status: 'weak', min: 25 },
  { status: 'new', min: 0 },
]

/**
 * A word only becomes ACTIVE when retrieval is reliably fast, unaided and
 * repeated across separate days. One lucky answer is never enough.
 */
export const ACTIVATION_RULES = {
  minMastery: 90,
  minSuccessDays: 3,
  minFastRecalls: 3,
  /** The most recent unaided recall must be at least this quick. */
  maxRecentLatencyMs: LATENCY_THRESHOLDS.good,
} as const

/** Scheduler intervals, in days. `0` means "come back inside this session". */
export const INTERVAL_LADDER = [0, 1, 3, 7, 14, 30, 60, 120, 240] as const

export const SCHEDULER = {
  /** Minutes until a failed item is offered again inside the same day. */
  relearnMinutes: 10,
  /** Multipliers applied to the ladder step chosen for the band. */
  bandStep: {
    instant: 2,
    good: 1,
    slow: 0,
    fragile: -1,
    failed: -3,
  } satisfies Record<RecallBand, number>,
  /** Hints cap how far the interval can grow. */
  hintStepPenalty: [0, 1, 2, 2] as const,
  /** Multiplier applied to the resulting interval for words that keep lapsing. */
  lapsePenalty: 0.6,
  lapsePenaltyThreshold: 3,
  /** Randomise due dates by +/- this fraction so reviews do not clump. */
  fuzzRatio: 0.1,
  maxIntervalDays: 240,
} as const

/** Target composition of a daily session, as fractions of the total. */
export const SESSION_MIX = {
  due: 0.5,
  weak: 0.2,
  new: 0.15,
  maintenance: 0.1,
  challenge: 0.05,
} as const

export const SESSION = {
  /** Roughly how long one item takes, used to turn minutes into item counts. */
  secondsPerItem: 14,
  minItems: 8,
  maxItems: 40,
  /** Never introduce more than this many unseen words in one session. */
  maxNewPerSession: 8,
  /** Do not repeat the same word within this many items. */
  minGapBetweenSameWord: 4,
  /** Avoid more than this many identical exercise types back to back. */
  maxConsecutiveSameType: 3,
} as const

/**
 * Exercise ladder: as a word gets more active we remove the Russian scaffolding
 * and push towards English-only production.
 */
export const EXERCISE_LADDER: Array<{ minMastery: number; types: ExerciseType[] }> = [
  { minMastery: 85, types: ['definition_recall', 'cloze', 'collocation', 'word_family'] },
  { minMastery: 65, types: ['definition_recall', 'cloze', 'context_recall', 'collocation'] },
  { minMastery: 40, types: ['context_recall', 'cloze', 'definition_recall'] },
  { minMastery: 0, types: ['translation_recall', 'context_recall'] },
]

/** After a lapse, drop back to explicit cues for this many reviews. */
export const LAPSE_SCAFFOLD_REVIEWS = 2

export const XP = {
  correctBase: 10,
  bandBonus: {
    instant: 8,
    good: 4,
    slow: 1,
    fragile: 0,
    failed: 0,
  } satisfies Record<RecallBand, number>,
  noHintBonus: 3,
  spellingSlipPenalty: 3,
  comboStep: 5,
  comboBonusPerStep: 6,
  maxComboBonus: 30,
  sessionCompleteBonus: 25,
  dailyGoalBonus: 40,
  wordActivatedBonus: 30,
  challengeCompleteBonus: 30,
} as const

/** XP needed to reach each level; index 0 is level 1. */
export const LEVEL_CURVE_BASE = 220
export const LEVEL_CURVE_GROWTH = 1.18
export const MAX_LEVEL = 60

export const STREAK = {
  /** Minimum reviews in a day for the day to count towards the streak. */
  minReviewsForDay: 5,
  /** Freezes cover a missed day automatically. */
  maxFreezes: 3,
  /** Earn one freeze after this many consecutive counted days. */
  freezeEarnedEveryDays: 7,
} as const

export const DAILY_GOAL_OPTIONS = [5, 10, 15, 20] as const
export type DailyGoalMinutes = (typeof DAILY_GOAL_OPTIONS)[number]

/** Diagnostic test taken during onboarding. */
export const DIAGNOSTIC = {
  itemCount: 24,
  /** Level buckets are chosen from these, weighted by the declared level. */
  levelWeights: {
    A2: { A2: 0.5, B1: 0.35, B2: 0.15, C1: 0 },
    B1: { A2: 0.25, B1: 0.4, B2: 0.3, C1: 0.05 },
    B2: { A2: 0.1, B1: 0.3, B2: 0.4, C1: 0.2 },
    C1: { A2: 0.05, B1: 0.2, B2: 0.4, C1: 0.35 },
    unsure: { A2: 0.25, B1: 0.35, B2: 0.3, C1: 0.1 },
  } as Record<string, Record<string, number>>,
} as const

/** How many words the first personal set contains. */
export const INITIAL_SET_SIZE = 60
