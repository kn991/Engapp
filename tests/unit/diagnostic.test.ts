import { describe, expect, it } from 'vitest'
import {
  bucketFor,
  estimateProductiveLevel,
  summariseDiagnostic,
  type DiagnosticAttempt,
} from '@/domain/learning/diagnostic'

function attempt(overrides: Partial<DiagnosticAttempt> = {}): DiagnosticAttempt {
  return { cefr: 'B1', wasCorrect: true, latencyMs: 1_500, hintUsed: false, ...overrides }
}

describe('bucketFor', () => {
  it('separates fast, slow and missed', () => {
    expect(bucketFor(attempt({ latencyMs: 1_200 }))).toBe('fast')
    expect(bucketFor(attempt({ latencyMs: 6_000 }))).toBe('slow')
    expect(bucketFor(attempt({ wasCorrect: false }))).toBe('missed')
  })

  it('does not credit an answer that needed a hint', () => {
    expect(bucketFor(attempt({ latencyMs: 900, hintUsed: true }))).toBe('missed')
  })
})

describe('estimateProductiveLevel', () => {
  it('returns the lowest level for an empty test', () => {
    expect(estimateProductiveLevel([])).toBe('A2')
  })

  it('reports the highest level where most words still come out', () => {
    const attempts: DiagnosticAttempt[] = [
      ...Array.from({ length: 4 }, () => attempt({ cefr: 'A2', latencyMs: 1_100 })),
      ...Array.from({ length: 4 }, () => attempt({ cefr: 'B1', latencyMs: 2_000 })),
      ...Array.from({ length: 4 }, () => attempt({ cefr: 'B2', wasCorrect: false })),
    ]
    expect(estimateProductiveLevel(attempts)).toBe('B1')
  })

  it('ignores a level with too few questions to judge', () => {
    const attempts: DiagnosticAttempt[] = [
      ...Array.from({ length: 4 }, () => attempt({ cefr: 'B1', latencyMs: 1_500 })),
      attempt({ cefr: 'C1', latencyMs: 1_000 }),
    ]
    expect(estimateProductiveLevel(attempts)).toBe('B1')
  })

  it('does not count answers that took longer than the slow threshold', () => {
    const attempts = Array.from({ length: 5 }, () => attempt({ cefr: 'B2', latencyMs: 15_000 }))
    expect(estimateProductiveLevel(attempts)).toBe('A2')
  })
})

describe('summariseDiagnostic', () => {
  it('splits the result into the three shares shown to the learner', () => {
    const attempts: DiagnosticAttempt[] = [
      attempt({ latencyMs: 1_000 }),
      attempt({ latencyMs: 1_200 }),
      attempt({ latencyMs: 6_000 }),
      attempt({ wasCorrect: false, latencyMs: 12_000 }),
    ]
    const summary = summariseDiagnostic(attempts)

    expect(summary.items).toBe(4)
    expect(summary.fast).toBe(2)
    expect(summary.slow).toBe(1)
    expect(summary.missed).toBe(1)
    expect(summary.fastShare + summary.slowShare + summary.missedShare).toBe(100)
  })

  it('averages only the answers that were actually retrieved', () => {
    const summary = summariseDiagnostic([
      attempt({ latencyMs: 2_000 }),
      attempt({ latencyMs: 4_000 }),
      attempt({ wasCorrect: false, latencyMs: 30_000 }),
    ])
    expect(summary.avgLatencyMs).toBe(3_000)
  })

  it('reports no average when nothing was retrieved', () => {
    const summary = summariseDiagnostic([attempt({ wasCorrect: false })])
    expect(summary.avgLatencyMs).toBeNull()
  })
})
