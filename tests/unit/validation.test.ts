import { describe, expect, it } from 'vitest'
import {
  acceptAnswerSchema,
  attemptSchema,
  customWordSchema,
  reviewBatchSchema,
  settingsSchema,
} from '@/lib/validation'

const validAttempt = {
  clientEventId: '3f1a7a10-0000-4000-8000-000000000001',
  wordId: '3f1a7a10-0000-4000-8000-000000000002',
  exerciseType: 'translation_recall',
  promptRef: 'избегать',
  submittedAnswer: 'avoid',
  latencyMs: 1_800,
  hintLevel: 0,
  revealed: false,
  localDay: '2026-03-01',
  fuzz: 0.4,
}

describe('attemptSchema', () => {
  it('accepts a well formed attempt', () => {
    expect(attemptSchema.safeParse(validAttempt).success).toBe(true)
  })

  it('rejects an unknown exercise type', () => {
    expect(
      attemptSchema.safeParse({ ...validAttempt, exerciseType: 'telepathy' }).success
    ).toBe(false)
  })

  it('rejects an impossible latency', () => {
    expect(attemptSchema.safeParse({ ...validAttempt, latencyMs: -1 }).success).toBe(false)
    expect(attemptSchema.safeParse({ ...validAttempt, latencyMs: 10 ** 9 }).success).toBe(false)
  })

  it('rejects a malformed day', () => {
    expect(attemptSchema.safeParse({ ...validAttempt, localDay: '1 March' }).success).toBe(false)
  })

  it('rejects an id that is not a uuid', () => {
    expect(attemptSchema.safeParse({ ...validAttempt, wordId: 'word-1' }).success).toBe(false)
  })

  it('caps the length of a stored answer', () => {
    const long = { ...validAttempt, submittedAnswer: 'a'.repeat(500) }
    expect(attemptSchema.safeParse(long).success).toBe(false)
  })

  it('drops a user id smuggled into the payload', () => {
    const parsed = attemptSchema.parse({ ...validAttempt, userId: 'someone-else' })
    expect(parsed).not.toHaveProperty('userId')
  })
})

describe('reviewBatchSchema', () => {
  it('requires at least one attempt and caps the batch size', () => {
    expect(reviewBatchSchema.safeParse({ sessionId: null, attempts: [] }).success).toBe(false)
    expect(
      reviewBatchSchema.safeParse({
        sessionId: null,
        attempts: Array.from({ length: 61 }, () => validAttempt),
      }).success
    ).toBe(false)
  })

  it('allows a batch with no session, for offline replay', () => {
    expect(
      reviewBatchSchema.safeParse({ sessionId: null, attempts: [validAttempt] }).success
    ).toBe(true)
  })
})

describe('customWordSchema', () => {
  it('requires the English word and its meaning', () => {
    expect(
      customWordSchema.safeParse({ partOfSpeech: 'verb', cefr: 'B1', russian: 'решать' }).success
    ).toBe(false)
  })

  it('trims and accepts a minimal entry', () => {
    const parsed = customWordSchema.parse({
      lemma: '  decide ',
      partOfSpeech: 'verb',
      cefr: 'B1',
      russian: 'решать',
    })
    expect(parsed.lemma).toBe('decide')
    expect(parsed.acceptedAnswers).toEqual([])
  })

  it('rejects a level outside the CEFR scale', () => {
    expect(
      customWordSchema.safeParse({
        lemma: 'decide',
        partOfSpeech: 'verb',
        cefr: 'Z9',
        russian: 'решать',
      }).success
    ).toBe(false)
  })
})

describe('settingsSchema', () => {
  it('keeps the daily goal inside a sensible range', () => {
    expect(settingsSchema.safeParse({ dailyGoalMinutes: 10 }).success).toBe(true)
    expect(settingsSchema.safeParse({ dailyGoalMinutes: 0 }).success).toBe(false)
    expect(settingsSchema.safeParse({ dailyGoalMinutes: 600 }).success).toBe(false)
  })

  it('validates the reminder time format', () => {
    expect(settingsSchema.safeParse({ reminderTime: '19:30' }).success).toBe(true)
    expect(settingsSchema.safeParse({ reminderTime: '25:00' }).success).toBe(false)
  })
})

describe('acceptAnswerSchema', () => {
  it('requires a word id and a non-empty answer', () => {
    expect(
      acceptAnswerSchema.safeParse({
        wordId: '3f1a7a10-0000-4000-8000-000000000002',
        answer: 'obtain',
      }).success
    ).toBe(true)
    expect(acceptAnswerSchema.safeParse({ wordId: 'nope', answer: 'obtain' }).success).toBe(false)
    expect(
      acceptAnswerSchema.safeParse({
        wordId: '3f1a7a10-0000-4000-8000-000000000002',
        answer: '   ',
      }).success
    ).toBe(false)
  })
})
