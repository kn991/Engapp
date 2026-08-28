import { describe, expect, it } from 'vitest'
import { challengesForDay, evaluateChallenges } from '@/domain/learning/challenges'

describe('challengesForDay', () => {
  it('is stable for the same user and day', () => {
    const first = challengesForDay('user-1', '2026-03-01')
    const second = challengesForDay('user-1', '2026-03-01')
    expect(first.map((c) => c.code)).toEqual(second.map((c) => c.code))
  })

  it('varies from day to day', () => {
    const monday = challengesForDay('user-1', '2026-03-01').map((c) => c.code)
    const tuesday = challengesForDay('user-1', '2026-03-02').map((c) => c.code)
    const wednesday = challengesForDay('user-1', '2026-03-03').map((c) => c.code)
    expect([monday, tuesday, wednesday].map((set) => set.join())).not.toHaveLength(0)
    expect(monday.join() === tuesday.join() && tuesday.join() === wednesday.join()).toBe(false)
  })

  it('never repeats a metric within a day', () => {
    const metrics = challengesForDay('user-1', '2026-03-01').map((c) => c.metric)
    expect(new Set(metrics).size).toBe(metrics.length)
  })

  it('returns the requested number of challenges', () => {
    expect(challengesForDay('user-1', '2026-03-01', 2)).toHaveLength(2)
  })
})

describe('evaluateChallenges', () => {
  const definitions = [
    { code: 'fast_10', metric: 'fast_recalls' as const, target: 10, title: 'A', description: 'a' },
    { code: 'minutes_10', metric: 'minutes' as const, target: 10, title: 'B', description: 'b' },
  ]

  const progress = {
    fastRecalls: 4,
    noHintReviews: 0,
    weakRecovered: 0,
    collocationReviews: 0,
    reviews: 0,
    minutes: 12,
  }

  it('reports partial progress and completion separately', () => {
    const [fast, minutes] = evaluateChallenges(definitions, progress)
    expect(fast?.progress).toBeCloseTo(0.4, 5)
    expect(fast?.completed).toBe(false)
    expect(minutes?.completed).toBe(true)
    expect(minutes?.progress).toBe(1)
  })

  it('never reports more than full progress', () => {
    const [fast] = evaluateChallenges(definitions, { ...progress, fastRecalls: 100 })
    expect(fast?.progress).toBe(1)
  })
})
