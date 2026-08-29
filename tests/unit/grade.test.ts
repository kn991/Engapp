import { describe, expect, it } from 'vitest'
import { gradeAttempt, initialWordState } from '@/domain/learning/grade'
import type { UserWordState } from '@/domain/learning/types'

const NOW = new Date('2026-03-01T09:00:00.000Z')

function state(overrides: Partial<UserWordState> = {}): UserWordState {
  return { ...initialWordState('word-1'), ...overrides }
}

const base = {
  now: NOW,
  day: '2026-03-01',
  submittedAnswer: 'avoid',
  isSpellingSlip: false,
  revealed: false,
  comboLength: 0,
  random: 0.5,
}

describe('gradeAttempt', () => {
  it('records a fast unaided answer as instant and moves everything forward', () => {
    const outcome = gradeAttempt({
      ...base,
      state: state(),
      latencyMs: 1_400,
      hintLevel: 0,
      wasCorrect: true,
    })

    expect(outcome.band).toBe('instant')
    expect(outcome.masteryAfter).toBeGreaterThan(outcome.masteryBefore)
    expect(outcome.nextState.reviewCount).toBe(1)
    expect(outcome.nextState.correctCount).toBe(1)
    expect(outcome.nextState.fastRecalls).toBe(1)
    expect(outcome.nextState.recentLatencyMs).toBe(1_400)
    expect(outcome.nextState.bestLatencyMs).toBe(1_400)
    expect(outcome.nextState.lastSuccessDay).toBe('2026-03-01')
    expect(outcome.xp).toBeGreaterThan(0)
  })

  it('records a lapse and reschedules for the same session', () => {
    const outcome = gradeAttempt({
      ...base,
      state: state({ reviewCount: 5, mastery: 70, intervalDays: 14 }),
      latencyMs: 8_000,
      hintLevel: 0,
      wasCorrect: false,
    })

    expect(outcome.band).toBe('failed')
    expect(outcome.nextState.lapses).toBe(1)
    expect(outcome.nextState.incorrectCount).toBe(1)
    expect(outcome.intervalDays).toBe(0)
    expect(outcome.xp).toBe(0)
    expect(new Date(outcome.nextReviewAt).getTime()).toBeGreaterThan(NOW.getTime())
  })

  it('does not count a first attempt as a lapse', () => {
    const outcome = gradeAttempt({
      ...base,
      state: state(),
      latencyMs: 8_000,
      hintLevel: 0,
      wasCorrect: false,
    })
    expect(outcome.nextState.lapses).toBe(0)
  })

  it('keeps the best latency when a later attempt is slower', () => {
    const outcome = gradeAttempt({
      ...base,
      state: state({ reviewCount: 3, correctCount: 3, bestLatencyMs: 1_200 }),
      latencyMs: 4_000,
      hintLevel: 0,
      wasCorrect: true,
    })
    expect(outcome.nextState.bestLatencyMs).toBe(1_200)
  })

  it('treats a spelling slip as recall that still cost something', () => {
    const clean = gradeAttempt({
      ...base,
      state: state({ mastery: 40 }),
      latencyMs: 1_500,
      hintLevel: 0,
      wasCorrect: true,
    })
    const slipped = gradeAttempt({
      ...base,
      state: state({ mastery: 40 }),
      latencyMs: 1_500,
      hintLevel: 0,
      wasCorrect: true,
      isSpellingSlip: true,
    })
    expect(slipped.masteryAfter).toBeLessThan(clean.masteryAfter)
    expect(slipped.masteryAfter).toBeGreaterThan(40)
  })

  it('does not record a success day when a hint was used', () => {
    const outcome = gradeAttempt({
      ...base,
      state: state({ mastery: 50 }),
      latencyMs: 1_500,
      hintLevel: 1,
      wasCorrect: true,
    })
    expect(outcome.nextState.lastSuccessDay).toBeNull()
    expect(outcome.nextState.hintCount).toBe(1)
  })

  it('stamps the activation time exactly once', () => {
    const ready = state({
      mastery: 88,
      successDays: 2,
      fastRecalls: 3,
      lastSuccessDay: '2026-02-27',
      reviewCount: 8,
      correctCount: 8,
    })

    const first = gradeAttempt({ ...base, state: ready, latencyMs: 1_200, hintLevel: 0, wasCorrect: true })
    expect(first.justActivated).toBe(true)
    expect(first.nextState.activatedAt).toBe(NOW.toISOString())

    const second = gradeAttempt({
      ...base,
      state: first.nextState,
      day: '2026-03-02',
      latencyMs: 1_100,
      hintLevel: 0,
      wasCorrect: true,
    })
    expect(second.justActivated).toBe(false)
    expect(second.nextState.activatedAt).toBe(first.nextState.activatedAt)
  })

  it('is deterministic, so the client preview matches the server record', () => {
    const args = {
      ...base,
      state: state({ reviewCount: 2, mastery: 55, intervalDays: 3 }),
      latencyMs: 2_100,
      hintLevel: 0,
      wasCorrect: true,
    }
    expect(gradeAttempt(args)).toEqual(gradeAttempt(args))
  })
})
