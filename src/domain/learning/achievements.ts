/**
 * Achievement definitions.
 *
 * Each one is a pure predicate over a stats snapshot, so unlocking can be
 * recomputed from scratch at any time and never drifts from the real data.
 */

export type AchievementIcon =
  | 'spark'
  | 'bolt'
  | 'arrow-up'
  | 'circle-check'
  | 'flame'
  | 'layers'
  | 'return'
  | 'gauge'
  | 'grid'

export interface AchievementContext {
  sessionsCompleted: number
  totalReviews: number
  /** Answers under the "instant" threshold. */
  instantRecalls: number
  activeWords: number
  currentStreak: number
  longestStreak: number
  /** Words that dropped to weak and later reached strong or active again. */
  recoveredWords: number
  baselineAvgLatencyMs: number | null
  currentAvgLatencyMs: number | null
  noHintReviews: number
  customWords: number
  challengesCompleted: number
  level: number
}

export interface AchievementDefinition {
  code: string
  title: string
  description: string
  icon: AchievementIcon
  /** Current value and the value needed, for progress rings. */
  measure: (ctx: AchievementContext) => { value: number; target: number }
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    code: 'first_recall',
    title: 'First recall',
    description: 'Finish your first session.',
    icon: 'circle-check',
    measure: (c) => ({ value: c.sessionsCompleted, target: 1 }),
  },
  {
    code: 'no_hesitation',
    title: 'No hesitation',
    description: 'Recall 10 words in under 2.5 seconds.',
    icon: 'bolt',
    measure: (c) => ({ value: c.instantRecalls, target: 10 }),
  },
  {
    code: 'activated',
    title: 'Activated',
    description: 'Move your first word to Active.',
    icon: 'spark',
    measure: (c) => ({ value: c.activeWords, target: 1 }),
  },
  {
    code: 'active_25',
    title: '25 active',
    description: 'Hold 25 words in active recall.',
    icon: 'layers',
    measure: (c) => ({ value: c.activeWords, target: 25 }),
  },
  {
    code: 'active_100',
    title: '100 active',
    description: 'Hold 100 words in active recall.',
    icon: 'grid',
    measure: (c) => ({ value: c.activeWords, target: 100 }),
  },
  {
    code: 'comeback',
    title: 'Comeback',
    description: 'Bring 10 forgotten words back to strong.',
    icon: 'return',
    measure: (c) => ({ value: c.recoveredWords, target: 10 }),
  },
  {
    code: 'streak_7',
    title: '7 day streak',
    description: 'Train seven days in a row.',
    icon: 'flame',
    measure: (c) => ({ value: c.longestStreak, target: 7 }),
  },
  {
    code: 'streak_30',
    title: '30 day streak',
    description: 'Train thirty days in a row.',
    icon: 'flame',
    measure: (c) => ({ value: c.longestStreak, target: 30 }),
  },
  {
    code: 'speed_up',
    title: 'Speed up',
    description: 'Cut your average recall time by 30%.',
    icon: 'gauge',
    measure: (c) => {
      const { baselineAvgLatencyMs: base, currentAvgLatencyMs: now } = c
      if (!base || !now || base <= 0) return { value: 0, target: 30 }
      const drop = ((base - now) / base) * 100
      return { value: Math.max(0, Math.round(drop)), target: 30 }
    },
  },
  {
    code: 'unaided',
    title: 'Unaided',
    description: 'Answer 100 reviews without a hint.',
    icon: 'arrow-up',
    measure: (c) => ({ value: c.noHintReviews, target: 100 }),
  },
  {
    code: 'own_words',
    title: 'Own words',
    description: 'Add 10 words of your own.',
    icon: 'layers',
    measure: (c) => ({ value: c.customWords, target: 10 }),
  },
  {
    code: 'challenger',
    title: 'Challenger',
    description: 'Complete 20 daily challenges.',
    icon: 'spark',
    measure: (c) => ({ value: c.challengesCompleted, target: 20 }),
  },
]

export const ACHIEVEMENTS_BY_CODE = new Map(ACHIEVEMENTS.map((a) => [a.code, a]))

export interface AchievementProgress {
  definition: AchievementDefinition
  value: number
  target: number
  progress: number
  unlocked: boolean
}

export function evaluateAchievements(ctx: AchievementContext): AchievementProgress[] {
  return ACHIEVEMENTS.map((definition) => {
    const { value, target } = definition.measure(ctx)
    const safeTarget = Math.max(1, target)
    return {
      definition,
      value,
      target: safeTarget,
      progress: Math.min(1, value / safeTarget),
      unlocked: value >= safeTarget,
    }
  })
}

/** Codes that are newly satisfied and not already recorded. */
export function newlyUnlocked(
  ctx: AchievementContext,
  alreadyUnlocked: readonly string[]
): string[] {
  const owned = new Set(alreadyUnlocked)
  return evaluateAchievements(ctx)
    .filter((a) => a.unlocked && !owned.has(a.definition.code))
    .map((a) => a.definition.code)
}
