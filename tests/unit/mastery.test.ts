import { describe, expect, it } from 'vitest'
import { computeMastery, statusForMastery } from '@/domain/learning/mastery'
import { initialWordState } from '@/domain/learning/grade'
import { ACTIVATION_RULES } from '@/domain/learning/config'
import type { UserWordState } from '@/domain/learning/types'

function state(overrides: Partial<UserWordState> = {}): UserWordState {
  return { ...initialWordState('word-1'), ...overrides }
}

describe('statusForMastery', () => {
  it('maps each band to its label', () => {
    expect(statusForMastery(0)).toBe('new')
    expect(statusForMastery(24)).toBe('new')
    expect(statusForMastery(25)).toBe('weak')
    expect(statusForMastery(50)).toBe('activating')
    expect(statusForMastery(75)).toBe('strong')
    expect(statusForMastery(90)).toBe('active')
  })
})

describe('computeMastery', () => {
  const day = '2026-03-01'

  it('moves mastery further for an instant recall than a slow one', () => {
    const instant = computeMastery({
      state: state(),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 1_500,
      day,
    })
    const slow = computeMastery({
      state: state(),
      band: 'slow',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 7_000,
      day,
    })
    expect(instant.mastery).toBeGreaterThan(slow.mastery)
  })

  it('drops mastery on a failed retrieval', () => {
    const result = computeMastery({
      state: state({ mastery: 60 }),
      band: 'failed',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 9_000,
      day,
    })
    expect(result.mastery).toBeLessThan(60)
    expect(result.status).toBe('weak')
  })

  it('charges for a hint', () => {
    const unaided = computeMastery({
      state: state({ mastery: 40 }),
      band: 'good',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 3_000,
      day,
    })
    const hinted = computeMastery({
      state: state({ mastery: 40 }),
      band: 'good',
      hintLevel: 1,
      isSpellingSlip: false,
      latencyMs: 3_000,
      day,
    })
    expect(hinted.mastery).toBeLessThan(unaided.mastery)
  })

  it('charges a little for a spelling slip but still moves forward', () => {
    const result = computeMastery({
      state: state({ mastery: 40 }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: true,
      latencyMs: 1_200,
      day,
    })
    expect(result.mastery).toBeGreaterThan(40)
  })

  it('counts one unaided success per calendar day', () => {
    const first = computeMastery({
      state: state({ mastery: 80, successDays: 1, lastSuccessDay: '2026-02-28' }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 1_200,
      day,
    })
    expect(first.successDays).toBe(2)

    const sameDayAgain = computeMastery({
      state: state({ mastery: 80, successDays: 2, lastSuccessDay: day }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 1_200,
      day,
    })
    expect(sameDayAgain.successDays).toBe(2)
  })

  it('does not activate a word on a single lucky answer', () => {
    const result = computeMastery({
      state: state({ mastery: 88, successDays: 0, fastRecalls: 0 }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 1_100,
      day,
    })
    expect(result.mastery).toBeGreaterThanOrEqual(ACTIVATION_RULES.minMastery)
    expect(result.status).toBe('strong')
    expect(result.justActivated).toBe(false)
  })

  it('activates once the day and speed requirements are all met', () => {
    const result = computeMastery({
      state: state({
        mastery: 88,
        successDays: ACTIVATION_RULES.minSuccessDays - 1,
        fastRecalls: ACTIVATION_RULES.minFastRecalls,
        lastSuccessDay: '2026-02-27',
      }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 1_100,
      day,
    })
    expect(result.status).toBe('active')
    expect(result.justActivated).toBe(true)
  })

  it('never activates a word that needed a hint', () => {
    const result = computeMastery({
      state: state({
        mastery: 95,
        successDays: 5,
        fastRecalls: 9,
        lastSuccessDay: '2026-02-27',
      }),
      band: 'good',
      hintLevel: 1,
      isSpellingSlip: false,
      latencyMs: 2_000,
      day,
    })
    expect(result.justActivated).toBe(false)
  })

  it('keeps mastery inside its bounds', () => {
    const top = computeMastery({
      state: state({ mastery: 100, successDays: 9, fastRecalls: 9 }),
      band: 'instant',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 900,
      day,
    })
    expect(top.mastery).toBe(100)

    const bottom = computeMastery({
      state: state({ mastery: 2 }),
      band: 'failed',
      hintLevel: 0,
      isSpellingSlip: false,
      latencyMs: 9_000,
      day,
    })
    expect(bottom.mastery).toBe(0)
  })
})
