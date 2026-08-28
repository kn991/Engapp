import { LATENCY_THRESHOLDS } from './config'
import type { CefrLevel } from './types'

/**
 * Scoring for the onboarding test.
 *
 * The test does not ask whether a word is recognised; every learner who needs
 * this app recognises plenty. It asks how much of their vocabulary comes back
 * fast enough to use, so the level we report is a *productive* level and is
 * usually a step below the level the same person would score on a reading
 * test.
 */

export interface DiagnosticAttempt {
  cefr: CefrLevel
  wasCorrect: boolean
  latencyMs: number
  hintUsed: boolean
}

export type DiagnosticBucket = 'fast' | 'slow' | 'missed'

export interface DiagnosticSummary {
  items: number
  fast: number
  slow: number
  missed: number
  fastShare: number
  slowShare: number
  missedShare: number
  avgLatencyMs: number | null
  estimatedLevel: 'A2' | 'B1' | 'B2' | 'C1'
}

export function bucketFor(attempt: DiagnosticAttempt): DiagnosticBucket {
  if (!attempt.wasCorrect || attempt.hintUsed) return 'missed'
  if (attempt.latencyMs < LATENCY_THRESHOLDS.instant) return 'fast'
  if (attempt.latencyMs < LATENCY_THRESHOLDS.slow) return 'slow'
  return 'slow'
}

const LEVEL_ORDER: Array<'A2' | 'B1' | 'B2' | 'C1'> = ['A2', 'B1', 'B2', 'C1']

/** The highest level where most words still come back unaided. */
export function estimateProductiveLevel(attempts: DiagnosticAttempt[]): 'A2' | 'B1' | 'B2' | 'C1' {
  if (attempts.length === 0) return 'A2'

  let best: 'A2' | 'B1' | 'B2' | 'C1' = 'A2'
  for (const level of LEVEL_ORDER) {
    const atLevel = attempts.filter((attempt) => attempt.cefr === level)
    if (atLevel.length < 3) continue
    const retrieved = atLevel.filter(
      (attempt) => attempt.wasCorrect && !attempt.hintUsed && attempt.latencyMs < LATENCY_THRESHOLDS.slow
    ).length
    if (retrieved / atLevel.length >= 0.6) best = level
  }
  return best
}

export function summariseDiagnostic(attempts: DiagnosticAttempt[]): DiagnosticSummary {
  const buckets = attempts.map(bucketFor)
  const fast = buckets.filter((bucket) => bucket === 'fast').length
  const slow = buckets.filter((bucket) => bucket === 'slow').length
  const missed = buckets.filter((bucket) => bucket === 'missed').length
  const total = Math.max(1, attempts.length)

  const correctLatencies = attempts
    .filter((attempt) => attempt.wasCorrect && !attempt.hintUsed)
    .map((attempt) => attempt.latencyMs)

  return {
    items: attempts.length,
    fast,
    slow,
    missed,
    fastShare: Math.round((fast / total) * 100),
    slowShare: Math.round((slow / total) * 100),
    missedShare: Math.round((missed / total) * 100),
    avgLatencyMs:
      correctLatencies.length > 0
        ? Math.round(correctLatencies.reduce((a, b) => a + b, 0) / correctLatencies.length)
        : null,
    estimatedLevel: estimateProductiveLevel(attempts),
  }
}
