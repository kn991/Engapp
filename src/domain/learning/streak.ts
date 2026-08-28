import { STREAK } from './config'
import { daysBetween } from './day'

export interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActiveDay: string | null
  freezes: number
}

export interface StreakUpdate extends StreakState {
  /** True when a freeze was spent to bridge a missed day. */
  freezeUsed: boolean
  /** True when this call extended the streak. */
  extended: boolean
}

/**
 * Applies a day of training to the streak.
 *
 * A single missed day is covered automatically by a freeze if one is banked,
 * which keeps the streak useful as a habit signal without turning one bad
 * evening into a punishment.
 */
export function applyTrainingDay(state: StreakState, day: string): StreakUpdate {
  if (state.lastActiveDay === day) {
    return { ...state, freezeUsed: false, extended: false }
  }

  const gap = state.lastActiveDay ? daysBetween(state.lastActiveDay, day) : null

  let currentStreak: number
  let freezes = state.freezes
  let freezeUsed = false

  if (gap === null || gap <= 0) {
    currentStreak = Math.max(1, state.currentStreak)
  } else if (gap === 1) {
    currentStreak = state.currentStreak + 1
  } else if (gap === 2 && freezes > 0) {
    freezes -= 1
    freezeUsed = true
    currentStreak = state.currentStreak + 1
  } else {
    currentStreak = 1
  }

  // Regular training banks a freeze for later.
  if (currentStreak > 0 && currentStreak % STREAK.freezeEarnedEveryDays === 0) {
    freezes = Math.min(STREAK.maxFreezes, freezes + 1)
  }

  return {
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastActiveDay: day,
    freezes,
    freezeUsed,
    extended: true,
  }
}

/** A streak shown on screen must account for days already missed. */
export function displayStreak(state: StreakState, today: string): number {
  if (!state.lastActiveDay) return 0
  const gap = daysBetween(state.lastActiveDay, today)
  if (gap <= 1) return state.currentStreak
  if (gap === 2 && state.freezes > 0) return state.currentStreak
  return 0
}

export function meetsDayThreshold(reviews: number): boolean {
  return reviews >= STREAK.minReviewsForDay
}
