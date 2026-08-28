import type {
  UserWordState,
  Word,
  WordCollocation,
  WordExample,
  WordFamilyMember,
} from '@/domain/learning'
import type { Tables } from '@/types/database'

/**
 * Translation between database rows and the domain model.
 *
 * The domain layer never sees snake_case rows, so the learning algorithms stay
 * independent of the storage schema.
 */

export interface WordRowWithDetails extends Tables<'words'> {
  word_examples?: Tables<'word_examples'>[] | null
  word_collocations?: Tables<'word_collocations'>[] | null
  word_family_members?: Tables<'word_family_members'>[] | null
}

export const WORD_SELECT =
  '*, word_examples(*), word_collocations(*), word_family_members(*)' as const

export function toWord(row: WordRowWithDetails, extraAccepted: string[] = []): Word {
  const examples: WordExample[] = (row.word_examples ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((example) => ({
      sentence: example.sentence,
      clozeSentence: example.cloze_sentence,
      translation: example.translation,
    }))

  const collocations: WordCollocation[] = (row.word_collocations ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((collocation) => ({
      collocation: collocation.collocation,
      pattern: collocation.pattern,
      meaningRu: collocation.meaning_ru,
    }))

  const family: WordFamilyMember[] = (row.word_family_members ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((member) => ({
      form: member.form,
      partOfSpeech: member.part_of_speech,
      gloss: member.gloss,
    }))

  return {
    id: row.id,
    lemma: row.lemma,
    partOfSpeech: row.part_of_speech,
    cefr: row.cefr,
    russian: row.russian,
    definition: row.definition,
    contextHint: row.context_hint,
    primaryAnswer: row.primary_answer,
    acceptedAnswers: [...row.accepted_answers, ...extraAccepted],
    tags: row.tags,
    examples,
    collocations,
    family,
    isCustom: row.created_by !== null,
  }
}

export function toUserWordState(row: Tables<'user_words'>): UserWordState {
  return {
    wordId: row.word_id,
    status: row.status,
    mastery: row.mastery,
    reviewCount: row.review_count,
    correctCount: row.correct_count,
    incorrectCount: row.incorrect_count,
    fastRecalls: row.fast_recalls,
    slowRecalls: row.slow_recalls,
    lapses: row.lapses,
    hintCount: row.hint_count,
    avgLatencyMs: row.avg_latency_ms,
    recentLatencyMs: row.recent_latency_ms,
    bestLatencyMs: row.best_latency_ms,
    successDays: row.success_days,
    lastSuccessDay: row.last_success_day,
    intervalDays: Number(row.interval_days),
    lastReviewedAt: row.last_reviewed_at,
    nextReviewAt: row.next_review_at,
    activatedAt: row.activated_at,
  }
}

export function toUserWordUpdate(
  userId: string,
  state: UserWordState,
  firstLatencyMs: number | null
) {
  return {
    user_id: userId,
    word_id: state.wordId,
    status: state.status,
    mastery: state.mastery,
    review_count: state.reviewCount,
    correct_count: state.correctCount,
    incorrect_count: state.incorrectCount,
    fast_recalls: state.fastRecalls,
    slow_recalls: state.slowRecalls,
    lapses: state.lapses,
    hint_count: state.hintCount,
    avg_latency_ms: state.avgLatencyMs,
    recent_latency_ms: state.recentLatencyMs,
    best_latency_ms: state.bestLatencyMs,
    first_latency_ms: firstLatencyMs,
    success_days: state.successDays,
    last_success_day: state.lastSuccessDay,
    interval_days: state.intervalDays,
    last_reviewed_at: state.lastReviewedAt,
    next_review_at: state.nextReviewAt,
    activated_at: state.activatedAt,
    was_weak: state.status === 'weak' || state.lapses > 0,
  }
}
