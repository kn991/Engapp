import { BAND_LABELS, LATENCY_THRESHOLDS, MAX_CREDITED_LATENCY_MS } from './config'
import type { RecallBand } from './types'

export interface ClassifyInput {
  latencyMs: number
  wasCorrect: boolean
  hintLevel: number
  revealed: boolean
}

/**
 * Turns one attempt into a recall band. Getting the word out is necessary but
 * not sufficient: a correct answer that took twelve seconds is not yet usable
 * in speech, and an answer that needed the letters spelled out is not recall
 * at all.
 */
export function classifyRecall({
  latencyMs,
  wasCorrect,
  hintLevel,
  revealed,
}: ClassifyInput): RecallBand {
  if (!wasCorrect || revealed) return 'failed'
  // Any hint beyond level 1 hands over part of the word itself.
  if (hintLevel >= 2) return 'failed'

  const capped = clampLatency(latencyMs)
  let band = bandForLatency(capped)

  // A context hint still counts as recall, but one notch slower.
  if (hintLevel === 1) band = demote(band)
  return band
}

export function bandForLatency(latencyMs: number): RecallBand {
  if (latencyMs < LATENCY_THRESHOLDS.instant) return 'instant'
  if (latencyMs < LATENCY_THRESHOLDS.good) return 'good'
  if (latencyMs < LATENCY_THRESHOLDS.slow) return 'slow'
  return 'fragile'
}

const ORDER: RecallBand[] = ['instant', 'good', 'slow', 'fragile', 'failed']

export function demote(band: RecallBand): RecallBand {
  const i = ORDER.indexOf(band)
  return ORDER[Math.min(i + 1, ORDER.length - 1)] ?? 'failed'
}

/** Guards against a phone left on the lock screen mid-question. */
export function clampLatency(latencyMs: number): number {
  if (!Number.isFinite(latencyMs) || latencyMs < 0) return 0
  return Math.min(Math.round(latencyMs), MAX_CREDITED_LATENCY_MS)
}

export function isSuccessBand(band: RecallBand): boolean {
  return band === 'instant' || band === 'good'
}

export function bandLabel(band: RecallBand): string {
  return BAND_LABELS[band]
}

/** `1.8 sec`, `12.4 sec` - always one decimal so the number does not jump. */
export function formatLatency(latencyMs: number | null | undefined): string {
  if (latencyMs == null || !Number.isFinite(latencyMs)) return '—'
  const seconds = latencyMs / 1000
  if (seconds >= 100) return `${Math.round(seconds)} sec`
  return `${seconds.toFixed(1)} sec`
}

export function formatLatencyShort(latencyMs: number | null | undefined): string {
  if (latencyMs == null || !Number.isFinite(latencyMs)) return '—'
  return `${(latencyMs / 1000).toFixed(1)}s`
}

/**
 * Running average that leans on recent attempts. Older evidence still counts,
 * but a word that used to take 9 seconds and now takes 2 should read as fast.
 */
export function updateAverageLatency(
  previousAvg: number | null,
  previousCount: number,
  latencyMs: number
): number {
  const capped = clampLatency(latencyMs)
  if (previousAvg == null || previousCount <= 0) return capped
  const weight = Math.min(previousCount, 8)
  return Math.round((previousAvg * weight + capped * 2) / (weight + 2))
}

/** Percentage improvement between two average latencies. Positive = faster. */
export function latencyImprovement(before: number | null, after: number | null): number | null {
  if (!before || !after || before <= 0) return null
  return Math.round(((before - after) / before) * 100)
}
