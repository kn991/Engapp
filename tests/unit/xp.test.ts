import { describe, expect, it } from 'vitest'
import { comboBonus, levelFromXp, nextCombo, xpForAttempt, xpForLevel } from '@/domain/learning/xp'
import { MAX_LEVEL, XP } from '@/domain/learning/config'

describe('xpForAttempt', () => {
  const base = { hintLevel: 0, isSpellingSlip: false, comboLength: 0 }

  it('gives nothing for a failed retrieval', () => {
    expect(xpForAttempt({ ...base, band: 'failed' })).toBe(0)
  })

  it('pays more for speed', () => {
    const instant = xpForAttempt({ ...base, band: 'instant' })
    const good = xpForAttempt({ ...base, band: 'good' })
    const slow = xpForAttempt({ ...base, band: 'slow' })
    expect(instant).toBeGreaterThan(good)
    expect(good).toBeGreaterThan(slow)
  })

  it('pays a bonus for answering without a hint', () => {
    const unaided = xpForAttempt({ ...base, band: 'good' })
    const hinted = xpForAttempt({ ...base, band: 'good', hintLevel: 1 })
    expect(unaided - hinted).toBe(XP.noHintBonus)
  })

  it('charges a small amount for a spelling slip', () => {
    const clean = xpForAttempt({ ...base, band: 'instant' })
    const slipped = xpForAttempt({ ...base, band: 'instant', isSpellingSlip: true })
    expect(clean - slipped).toBe(XP.spellingSlipPenalty)
  })

  it('never goes negative', () => {
    expect(
      xpForAttempt({ band: 'slow', hintLevel: 3, isSpellingSlip: true, comboLength: 0 })
    ).toBeGreaterThanOrEqual(0)
  })
})

describe('comboBonus', () => {
  it('pays only on each completed run', () => {
    expect(comboBonus(1)).toBe(0)
    expect(comboBonus(4)).toBe(0)
    expect(comboBonus(5)).toBe(XP.comboBonusPerStep)
    expect(comboBonus(10)).toBe(XP.comboBonusPerStep * 2)
  })

  it('is capped', () => {
    expect(comboBonus(100)).toBe(XP.maxComboBonus)
  })
})

describe('nextCombo', () => {
  it('extends only on instant recalls', () => {
    expect(nextCombo(3, 'instant')).toBe(4)
    expect(nextCombo(3, 'good')).toBe(0)
    expect(nextCombo(3, 'failed')).toBe(0)
  })
})

describe('levelFromXp', () => {
  it('starts everyone at level one with no progress', () => {
    const level = levelFromXp(0)
    expect(level.level).toBe(1)
    expect(level.xpIntoLevel).toBe(0)
    expect(level.progress).toBe(0)
  })

  it('increases monotonically with XP', () => {
    let previous = 0
    for (const xp of [0, 100, 500, 2_000, 10_000, 100_000]) {
      const level = levelFromXp(xp).level
      expect(level).toBeGreaterThanOrEqual(previous)
      previous = level
    }
  })

  it('reports progress inside the current level', () => {
    const floor = xpForLevel(4)
    const ceiling = xpForLevel(5)
    const middle = levelFromXp(Math.floor((floor + ceiling) / 2))
    expect(middle.level).toBe(4)
    expect(middle.progress).toBeGreaterThan(0.3)
    expect(middle.progress).toBeLessThan(0.7)
  })

  it('stops at the maximum level', () => {
    const level = levelFromXp(50_000_000)
    expect(level.level).toBe(MAX_LEVEL)
    expect(level.isMax).toBe(true)
    expect(level.progress).toBe(1)
  })

  it('ignores nonsense input', () => {
    expect(levelFromXp(-100).level).toBe(1)
  })
})
