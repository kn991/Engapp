import { LEVEL_CURVE_BASE, LEVEL_CURVE_GROWTH, MAX_LEVEL, XP } from './config'
import type { RecallBand } from './types'

export interface XpInput {
  band: RecallBand
  hintLevel: number
  isSpellingSlip: boolean
  /** Consecutive fast recalls, including this one. */
  comboLength: number
}

/** XP for a single answer. Speed and independence are what earn points. */
export function xpForAttempt({
  band,
  hintLevel,
  isSpellingSlip,
  comboLength,
}: XpInput): number {
  if (band === 'failed') return 0

  let total = XP.correctBase + XP.bandBonus[band]
  if (hintLevel === 0) total += XP.noHintBonus
  if (isSpellingSlip) total -= XP.spellingSlipPenalty
  total += comboBonus(comboLength)

  return Math.max(0, Math.round(total))
}

/** Bonus granted at every fifth consecutive fast recall, capped. */
export function comboBonus(comboLength: number): number {
  if (comboLength <= 0 || comboLength % XP.comboStep !== 0) return 0
  const steps = comboLength / XP.comboStep
  return Math.min(steps * XP.comboBonusPerStep, XP.maxComboBonus)
}

/** Total XP required to have reached `level`. Level 1 starts at 0. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  let total = 0
  for (let l = 1; l < level; l += 1) {
    total += Math.round(LEVEL_CURVE_BASE * Math.pow(LEVEL_CURVE_GROWTH, l - 1))
  }
  return total
}

export interface LevelInfo {
  level: number
  xpIntoLevel: number
  xpForNextLevel: number
  progress: number
  isMax: boolean
}

export function levelFromXp(totalXp: number): LevelInfo {
  const xp = Math.max(0, Math.floor(totalXp))
  let level = 1
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level += 1

  const floor = xpForLevel(level)
  const ceiling = level >= MAX_LEVEL ? floor : xpForLevel(level + 1)
  const span = Math.max(1, ceiling - floor)

  return {
    level,
    xpIntoLevel: xp - floor,
    xpForNextLevel: span,
    progress: level >= MAX_LEVEL ? 1 : Math.min(1, (xp - floor) / span),
    isMax: level >= MAX_LEVEL,
  }
}

/** Combo counter: fast answers extend it, anything else resets it. */
export function nextCombo(current: number, band: RecallBand): number {
  return band === 'instant' ? current + 1 : 0
}
