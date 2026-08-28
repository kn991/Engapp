'use client'

/** Very light vibration feedback where the browser supports it. */
export type HapticPattern = 'correct' | 'wrong' | 'milestone'

const PATTERNS: Record<HapticPattern, number | number[]> = {
  correct: 12,
  wrong: [16, 40, 16],
  milestone: [10, 30, 10, 30, 24],
}

export function vibrate(pattern: HapticPattern, enabled: boolean): void {
  if (!enabled) return
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(PATTERNS[pattern])
  } catch {
    // Vibration is blocked in some contexts; nothing depends on it.
  }
}
