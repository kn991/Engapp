import { describe, expect, it } from 'vitest'
import { applyTrainingDay, displayStreak, meetsDayThreshold } from '@/domain/learning/streak'
import { STREAK } from '@/domain/learning/config'

const fresh = { currentStreak: 0, longestStreak: 0, lastActiveDay: null, freezes: 0 }

describe('applyTrainingDay', () => {
  it('starts a streak on the first counted day', () => {
    const result = applyTrainingDay(fresh, '2026-03-01')
    expect(result.currentStreak).toBe(1)
    expect(result.lastActiveDay).toBe('2026-03-01')
  })

  it('is a no-op when the same day is applied twice', () => {
    const first = applyTrainingDay(fresh, '2026-03-01')
    const second = applyTrainingDay(first, '2026-03-01')
    expect(second.currentStreak).toBe(first.currentStreak)
    expect(second.extended).toBe(false)
  })

  it('extends across consecutive days', () => {
    const result = applyTrainingDay(
      { currentStreak: 4, longestStreak: 4, lastActiveDay: '2026-02-28', freezes: 0 },
      '2026-03-01'
    )
    expect(result.currentStreak).toBe(5)
    expect(result.longestStreak).toBe(5)
  })

  it('resets after a missed day with no freeze banked', () => {
    const result = applyTrainingDay(
      { currentStreak: 9, longestStreak: 9, lastActiveDay: '2026-02-26', freezes: 0 },
      '2026-03-01'
    )
    expect(result.currentStreak).toBe(1)
    expect(result.longestStreak).toBe(9)
  })

  it('spends a freeze to bridge exactly one missed day', () => {
    const result = applyTrainingDay(
      { currentStreak: 9, longestStreak: 9, lastActiveDay: '2026-02-27', freezes: 1 },
      '2026-03-01'
    )
    expect(result.currentStreak).toBe(10)
    expect(result.freezeUsed).toBe(true)
    expect(result.freezes).toBe(0)
  })

  it('banks a freeze for sustained regularity', () => {
    const result = applyTrainingDay(
      {
        currentStreak: STREAK.freezeEarnedEveryDays - 1,
        longestStreak: STREAK.freezeEarnedEveryDays - 1,
        lastActiveDay: '2026-02-28',
        freezes: 0,
      },
      '2026-03-01'
    )
    expect(result.currentStreak).toBe(STREAK.freezeEarnedEveryDays)
    expect(result.freezes).toBe(1)
  })

  it('never banks more freezes than the cap', () => {
    const result = applyTrainingDay(
      {
        currentStreak: STREAK.freezeEarnedEveryDays * 4 - 1,
        longestStreak: 100,
        lastActiveDay: '2026-02-28',
        freezes: STREAK.maxFreezes,
      },
      '2026-03-01'
    )
    expect(result.freezes).toBe(STREAK.maxFreezes)
  })
})

describe('displayStreak', () => {
  it('keeps the streak visible on the day itself and the next one', () => {
    const state = { currentStreak: 6, longestStreak: 6, lastActiveDay: '2026-03-01', freezes: 0 }
    expect(displayStreak(state, '2026-03-01')).toBe(6)
    expect(displayStreak(state, '2026-03-02')).toBe(6)
  })

  it('drops to zero once the gap is unrecoverable', () => {
    const state = { currentStreak: 6, longestStreak: 6, lastActiveDay: '2026-03-01', freezes: 0 }
    expect(displayStreak(state, '2026-03-03')).toBe(0)
  })

  it('holds a one-day gap open while a freeze is banked', () => {
    const state = { currentStreak: 6, longestStreak: 6, lastActiveDay: '2026-03-01', freezes: 1 }
    expect(displayStreak(state, '2026-03-03')).toBe(6)
  })

  it('is zero before any training', () => {
    expect(displayStreak(fresh, '2026-03-01')).toBe(0)
  })
})

describe('meetsDayThreshold', () => {
  it('requires a real session, not a single answer', () => {
    expect(meetsDayThreshold(1)).toBe(false)
    expect(meetsDayThreshold(STREAK.minReviewsForDay)).toBe(true)
  })
})
