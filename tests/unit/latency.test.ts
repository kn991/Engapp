import { describe, expect, it } from 'vitest'
import {
  bandForLatency,
  clampLatency,
  classifyRecall,
  formatLatency,
  isSuccessBand,
  latencyImprovement,
  updateAverageLatency,
} from '@/domain/learning/latency'
import { LATENCY_THRESHOLDS, MAX_CREDITED_LATENCY_MS } from '@/domain/learning/config'

describe('bandForLatency', () => {
  it('splits the bands at the configured thresholds', () => {
    expect(bandForLatency(500)).toBe('instant')
    expect(bandForLatency(LATENCY_THRESHOLDS.instant - 1)).toBe('instant')
    expect(bandForLatency(LATENCY_THRESHOLDS.instant)).toBe('good')
    expect(bandForLatency(LATENCY_THRESHOLDS.good)).toBe('slow')
    expect(bandForLatency(LATENCY_THRESHOLDS.slow)).toBe('fragile')
    expect(bandForLatency(30_000)).toBe('fragile')
  })
})

describe('classifyRecall', () => {
  const base = { wasCorrect: true, hintLevel: 0, revealed: false }

  it('rewards a fast unaided answer', () => {
    expect(classifyRecall({ ...base, latencyMs: 1_400 })).toBe('instant')
  })

  it('treats a correct but very slow answer as fragile, not a success', () => {
    const band = classifyRecall({ ...base, latencyMs: 12_000 })
    expect(band).toBe('fragile')
    expect(isSuccessBand(band)).toBe(false)
  })

  it('demotes one band when a meaning hint was taken', () => {
    expect(classifyRecall({ ...base, latencyMs: 1_000, hintLevel: 1 })).toBe('good')
    expect(classifyRecall({ ...base, latencyMs: 4_000, hintLevel: 1 })).toBe('slow')
  })

  it('counts a hint that gives away letters as a failed retrieval', () => {
    expect(classifyRecall({ ...base, latencyMs: 900, hintLevel: 2 })).toBe('failed')
  })

  it('counts a revealed answer as failed however fast it was', () => {
    expect(classifyRecall({ ...base, latencyMs: 100, revealed: true })).toBe('failed')
  })

  it('counts a wrong answer as failed', () => {
    expect(classifyRecall({ ...base, latencyMs: 900, wasCorrect: false })).toBe('failed')
  })
})

describe('clampLatency', () => {
  it('caps a phone left on the lock screen', () => {
    expect(clampLatency(10 * 60 * 1000)).toBe(MAX_CREDITED_LATENCY_MS)
  })

  it('floors negative and invalid values', () => {
    expect(clampLatency(-5)).toBe(0)
    expect(clampLatency(Number.NaN)).toBe(0)
  })
})

describe('updateAverageLatency', () => {
  it('uses the first measurement when there is no history', () => {
    expect(updateAverageLatency(null, 0, 4_000)).toBe(4_000)
  })

  it('moves towards recent evidence rather than averaging everything equally', () => {
    const updated = updateAverageLatency(9_000, 2, 2_000)
    expect(updated).toBeLessThan(9_000)
    expect(updated).toBeGreaterThan(2_000)
  })
})

describe('latencyImprovement', () => {
  it('reports a positive percentage when recall got faster', () => {
    expect(latencyImprovement(6_000, 3_000)).toBe(50)
  })

  it('reports a negative percentage when it got slower', () => {
    expect(latencyImprovement(3_000, 6_000)).toBe(-100)
  })

  it('returns null without both measurements', () => {
    expect(latencyImprovement(null, 3_000)).toBeNull()
  })
})

describe('formatLatency', () => {
  it('always shows one decimal so the number does not jump', () => {
    expect(formatLatency(1_800)).toBe('1.8 sec')
    expect(formatLatency(12_400)).toBe('12.4 sec')
  })

  it('renders a dash when there is nothing to show', () => {
    expect(formatLatency(null)).toBe('—')
  })
})
