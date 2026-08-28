/**
 * Domain types for the learning engine.
 *
 * Everything in `src/domain` is pure and framework-free: no React, no
 * Supabase, no `window`. That keeps the algorithms unit-testable and lets us
 * change the storage layer without touching the learning rules.
 */

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type CefrLevel = (typeof CEFR_LEVELS)[number]

export const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'phrasal_verb',
  'collocation',
  'idiom',
] as const
export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number]

/** Productive mastery buckets, ordered from unknown to fully active. */
export const WORD_STATUSES = ['new', 'weak', 'activating', 'strong', 'active'] as const
export type WordStatus = (typeof WORD_STATUSES)[number]

/** The exercise formats, ordered by how much scaffolding they give. */
export const EXERCISE_TYPES = [
  'translation_recall',
  'context_recall',
  'definition_recall',
  'cloze',
  'collocation',
  'word_family',
] as const
export type ExerciseType = (typeof EXERCISE_TYPES)[number]

/** How quickly the answer surfaced. This is the product's core signal. */
export const RECALL_BANDS = ['instant', 'good', 'slow', 'fragile', 'failed'] as const
export type RecallBand = (typeof RECALL_BANDS)[number]

export interface WordExample {
  sentence: string
  /** Same sentence with the target replaced by `___`. */
  clozeSentence: string | null
  translation: string | null
}

export interface WordCollocation {
  collocation: string
  /** The collocation with the tested part replaced by `___`. */
  pattern: string
  meaningRu: string | null
}

export interface WordFamilyMember {
  form: string
  partOfSpeech: PartOfSpeech
  gloss: string | null
}

/** A dictionary entry, curated or user-created. */
export interface Word {
  id: string
  lemma: string
  partOfSpeech: PartOfSpeech
  cefr: CefrLevel
  russian: string
  definition: string | null
  /** Short disambiguating hint shown with the Russian cue. */
  contextHint: string | null
  primaryAnswer: string
  acceptedAnswers: string[]
  tags: string[]
  examples: WordExample[]
  collocations: WordCollocation[]
  family: WordFamilyMember[]
  isCustom: boolean
}

/** Per-user learning state for one word. */
export interface UserWordState {
  wordId: string
  status: WordStatus
  mastery: number
  reviewCount: number
  correctCount: number
  incorrectCount: number
  fastRecalls: number
  slowRecalls: number
  lapses: number
  hintCount: number
  avgLatencyMs: number | null
  recentLatencyMs: number | null
  bestLatencyMs: number | null
  /** Number of distinct calendar days with a hint-free, at-least-good recall. */
  successDays: number
  lastSuccessDay: string | null
  intervalDays: number
  lastReviewedAt: string | null
  nextReviewAt: string | null
  activatedAt: string | null
}

/** One question inside a training session. */
export interface SessionItem {
  /** Stable id so review events are idempotent across retries. */
  id: string
  word: Word
  state: UserWordState
  exerciseType: ExerciseType
  /** Main cue shown large in the middle of the screen. */
  prompt: string
  /** Secondary line under the prompt (disambiguating sentence / definition). */
  promptSecondary: string | null
  /** Language of the secondary line, so screen readers and speech get it right. */
  promptSecondaryLang: 'ru' | 'en'
  /** Language of the primary prompt, for `lang` attributes and speech. */
  promptLang: 'ru' | 'en'
  /** What the learner has to type. */
  answer: string
  acceptedAnswers: string[]
  /** Sentence to show in the feedback panel. */
  reveal: string | null
  /** Why this item is in the queue - drives the composition rules. */
  source: SessionItemSource
}

export type SessionItemSource =
  | 'due'
  | 'weak'
  | 'slow'
  | 'new'
  | 'maintenance'
  | 'challenge'
  | 'diagnostic'

/** A learner's answer to one item, as recorded on the client. */
export interface AttemptInput {
  latencyMs: number
  hintLevel: number
  submittedAnswer: string
  wasCorrect: boolean
  isSpellingSlip: boolean
  revealed: boolean
}

/** The result of grading + scheduling one attempt. */
export interface AttemptOutcome {
  band: RecallBand
  masteryBefore: number
  masteryAfter: number
  statusBefore: WordStatus
  statusAfter: WordStatus
  nextReviewAt: string
  intervalDays: number
  xp: number
  justActivated: boolean
  nextState: UserWordState
}
