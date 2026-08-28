import { describe, expect, it } from 'vitest'
import { formatNextReview, isDue, ladderIndexFor, scheduleNextReview } from '@/domain/learning/scheduler'
import { initialWordState } from '@/domain/learning/grade'
import { INTERVAL_LADDER, SCHEDULER } from '@/domain/learning/config'
import type { UserWordState } from '@/domain/learning/types'

const NOW = new Date('2026-03-01T09:00:00.000Z')

function state(overrides: Partial<UserWordState> = {}): UserWordState {
  return { ...initialWordState('word-1'), ...overrides }
}

function daysUntil(date: Date): number {
  return (date.getTime() - NOW.getTime()) / (24 * 60 * 60 * 1000)
}

describe('ladderIndexFor', () => {
  it('finds the ladder position at or below the current interval', () => {
    expect(ladderIndexFor(0)).toBe(0)
    expect(ladderIndexFor(1)).toBe(1)
    expect(ladderIndexFor(5)).toBe(2)
    expect(ladderIndexFor(1_000)).toBe(INTERVAL_LADDER.length - 1)
  })
})

describe('scheduleNextReview', () => {
  it('brings a failed word back within the same session', () => {
    const result = scheduleNextReview({
      state: state({ intervalDays: 14 }),
      band: 'failed',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(result.relearnToday).toBe(true)
    expect(result.intervalDays).toBe(0)
    expect(result.nextReviewAt.getTime()).toBe(
      NOW.getTime() + SCHEDULER.relearnMinutes * 60_000
    )
  })

  it('gives a correct but very slow answer almost no extra spacing', () => {
    const result = scheduleNextReview({
      state: state({ intervalDays: 3 }),
      band: 'fragile',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(result.intervalDays).toBeLessThan(3)
  })

  it('advances one rung for a good answer', () => {
    const result = scheduleNextReview({
      state: state({ intervalDays: 3 }),
      band: 'good',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(result.intervalDays).toBe(7)
  })

  it('jumps two rungs for an instant answer', () => {
    const result = scheduleNextReview({
      state: state({ intervalDays: 3 }),
      band: 'instant',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(result.intervalDays).toBe(14)
  })

  it('never schedules further out than the configured maximum', () => {
    const result = scheduleNextReview({
      state: state({ intervalDays: 240 }),
      band: 'instant',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(result.intervalDays).toBeLessThanOrEqual(SCHEDULER.maxIntervalDays)
  })

  it('pulls the next review closer when a hint was used', () => {
    const unaided = scheduleNextReview({
      state: state({ intervalDays: 7 }),
      band: 'instant',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    const hinted = scheduleNextReview({
      state: state({ intervalDays: 7 }),
      band: 'instant',
      hintLevel: 1,
      now: NOW,
      random: 0.5,
    })
    expect(hinted.intervalDays).toBeLessThan(unaided.intervalDays)
  })

  it('shortens intervals for a word that keeps lapsing', () => {
    const steady = scheduleNextReview({
      state: state({ intervalDays: 14, lapses: 0 }),
      band: 'good',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    const fragile = scheduleNextReview({
      state: state({ intervalDays: 14, lapses: 5 }),
      band: 'good',
      hintLevel: 0,
      now: NOW,
      random: 0.5,
    })
    expect(fragile.intervalDays).toBeLessThan(steady.intervalDays)
  })

  it('spreads due dates with a bounded fuzz', () => {
    const early = scheduleNextReview({
      state: state({ intervalDays: 7 }),
      band: 'good',
      hintLevel: 0,
      now: NOW,
      random: 0,
    })
    const late = scheduleNextReview({
      state: state({ intervalDays: 7 }),
      band: 'good',
      hintLevel: 0,
      now: NOW,
      random: 1,
    })
    expect(early.intervalDays).toBe(late.intervalDays)
    const nominal = early.intervalDays
    expect(daysUntil(early.nextReviewAt)).toBeCloseTo(nominal * (1 - SCHEDULER.fuzzRatio), 4)
    expect(daysUntil(late.nextReviewAt)).toBeCloseTo(nominal * (1 + SCHEDULER.fuzzRatio), 4)
  })

  it('is deterministic for the same inputs', () => {
    const args = {
      state: state({ intervalDays: 3 }),
      band: 'good' as const,
      hintLevel: 0,
      now: NOW,
      random: 0.42,
    }
    expect(scheduleNextReview(args)).toEqual(scheduleNextReview(args))
  })
})

describe('isDue', () => {
  it('treats a word that was never scheduled as due', () => {
    expect(isDue(state(), NOW)).toBe(true)
  })

  it('compares the scheduled time against now', () => {
    expect(isDue(state({ nextReviewAt: '2026-02-28T09:00:00.000Z' }), NOW)).toBe(true)
    expect(isDue(state({ nextReviewAt: '2026-03-05T09:00:00.000Z' }), NOW)).toBe(false)
  })
})

describe('formatNextReview', () => {
  it('reads naturally at each range', () => {
    expect(formatNextReview(null, NOW)).toBe('Ready now')
    expect(formatNextReview('2026-02-28T09:00:00.000Z', NOW)).toBe('Ready now')
    expect(formatNextReview('2026-03-01T09:30:00.000Z', NOW)).toBe('In 30 min')
    expect(formatNextReview('2026-03-02T09:00:00.000Z', NOW)).toBe('Tomorrow')
    expect(formatNextReview('2026-03-04T09:00:00.000Z', NOW)).toBe('In 3 days')
    expect(formatNextReview('2026-04-02T09:00:00.000Z', NOW)).toBe('Apr 2')
  })
})
