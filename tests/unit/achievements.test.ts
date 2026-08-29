import { describe, expect, it } from 'vitest'
import {
  ACHIEVEMENTS,
  evaluateAchievements,
  newlyUnlocked,
  type AchievementContext,
} from '@/domain/learning/achievements'

function context(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    sessionsCompleted: 0,
    totalReviews: 0,
    instantRecalls: 0,
    activeWords: 0,
    currentStreak: 0,
    longestStreak: 0,
    recoveredWords: 0,
    baselineAvgLatencyMs: null,
    currentAvgLatencyMs: null,
    noHintReviews: 0,
    customWords: 0,
    challengesCompleted: 0,
    level: 1,
    ...overrides,
  }
}

describe('evaluateAchievements', () => {
  it('unlocks nothing for a brand new account', () => {
    const unlocked = evaluateAchievements(context()).filter((entry) => entry.unlocked)
    expect(unlocked).toHaveLength(0)
  })

  it('unlocks the first session after one session', () => {
    const result = evaluateAchievements(context({ sessionsCompleted: 1 }))
    expect(result.find((entry) => entry.definition.code === 'first_recall')?.unlocked).toBe(true)
  })

  it('tracks partial progress towards a target', () => {
    const result = evaluateAchievements(context({ instantRecalls: 5 }))
    const entry = result.find((item) => item.definition.code === 'no_hesitation')
    expect(entry?.unlocked).toBe(false)
    expect(entry?.progress).toBeCloseTo(0.5, 5)
  })

  it('unlocks the speed achievement only after a real drop', () => {
    const small = evaluateAchievements(
      context({ baselineAvgLatencyMs: 6_000, currentAvgLatencyMs: 5_400 })
    )
    expect(small.find((entry) => entry.definition.code === 'speed_up')?.unlocked).toBe(false)

    const large = evaluateAchievements(
      context({ baselineAvgLatencyMs: 6_000, currentAvgLatencyMs: 3_600 })
    )
    expect(large.find((entry) => entry.definition.code === 'speed_up')?.unlocked).toBe(true)
  })

  it('does not treat a slower average as progress', () => {
    const result = evaluateAchievements(
      context({ baselineAvgLatencyMs: 3_000, currentAvgLatencyMs: 6_000 })
    )
    expect(result.find((entry) => entry.definition.code === 'speed_up')?.value).toBe(0)
  })
})

describe('newlyUnlocked', () => {
  it('returns only codes that are not already recorded', () => {
    const ctx = context({ sessionsCompleted: 3, activeWords: 1 })
    expect(newlyUnlocked(ctx, [])).toEqual(
      expect.arrayContaining(['first_recall', 'activated'])
    )
    expect(newlyUnlocked(ctx, ['first_recall'])).not.toContain('first_recall')
  })

  it('returns nothing when everything is already unlocked', () => {
    const ctx = context({
      sessionsCompleted: 100,
      instantRecalls: 100,
      activeWords: 200,
      longestStreak: 60,
      recoveredWords: 40,
      noHintReviews: 500,
      customWords: 40,
      challengesCompleted: 40,
      baselineAvgLatencyMs: 8_000,
      currentAvgLatencyMs: 2_000,
    })
    expect(newlyUnlocked(ctx, ACHIEVEMENTS.map((a) => a.code))).toEqual([])
  })
})
