import 'server-only'

import {
  ACHIEVEMENTS,
  addDays,
  dayRange,
  displayStreak,
  evaluateAchievements,
  latencyImprovement,
  levelFromXp,
  todayKey,
  type AchievementProgress,
} from '@/domain/learning'
import { createServerSupabase } from '@/lib/supabase/server'
import { buildAchievementContext } from '@/server/queries/achievements'
import { loadWordOverview, type WordOverview } from './home'
import { loadProfileBundle } from './profile'

export interface DayCell {
  day: string
  reviews: number
  seconds: number
}

export interface WeeklyReport {
  minutesTrained: number
  wordsActivated: number
  latencyBefore: number | null
  latencyAfter: number | null
  mostImproved: Array<{ lemma: string; gain: number }>
  weakestTag: string | null
  focus: string
}

export interface ProgressData {
  overview: WordOverview
  streak: number
  /** Banked days that cover a single miss without ending the streak. */
  streakFreezes: number
  level: ReturnType<typeof levelFromXp>
  days: DayCell[]
  weekMinutes: number[]
  /** True when the last seven days contain any reviews at all. */
  weekHasActivity: boolean
  latencyThisMonth: number | null
  latencyLastMonth: number | null
  latencyChange: number | null
  accuracy: number | null
  noHintRate: number | null
  activatedThisMonth: number
  achievements: AchievementProgress[]
  unlockedCodes: string[]
  weekly: WeeklyReport
}

const HEATMAP_DAYS = 84

/** Everything the progress screen shows, all derived from stored reviews. */
export async function loadProgressData(userId: string): Promise<ProgressData | null> {
  const bundle = await loadProfileBundle(userId)
  if (!bundle) return null

  const supabase = await createServerSupabase()
  const today = todayKey(bundle.timeZone)
  const heatmapStart = addDays(today, -(HEATMAP_DAYS - 1))
  const monthStart = addDays(today, -29)
  const previousMonthStart = addDays(today, -59)
  const weekStart = addDays(today, -6)

  const [statsResponse, achievementsResponse, improvedResponse, tagsResponse, overview] =
    await Promise.all([
      supabase
        .from('daily_stats')
        .select('day, reviews, correct, seconds_trained, avg_latency_ms, hints_used, words_activated')
        .eq('user_id', userId)
        .gte('day', previousMonthStart)
        .order('day', { ascending: true }),
      supabase.from('user_achievements').select('achievement_code').eq('user_id', userId),
      supabase.rpc('most_improved_words', { p_limit: 5 }),
      supabase.rpc('tag_mastery', { p_min_words: 3 }),
      loadWordOverview(),
    ])

  const stats = statsResponse.data ?? []
  const byDay = new Map(stats.map((row) => [row.day, row]))

  const days: DayCell[] = dayRange(today, HEATMAP_DAYS).map((day) => {
    const row = byDay.get(day)
    return { day, reviews: row?.reviews ?? 0, seconds: row?.seconds_trained ?? 0 }
  })
  void heatmapStart

  const weekMinutes = dayRange(today, 7).map((day) =>
    Math.round((byDay.get(day)?.seconds_trained ?? 0) / 60)
  )

  const thisMonth = stats.filter((row) => row.day >= monthStart)
  const lastMonth = stats.filter((row) => row.day < monthStart)

  const latencyThisMonth = weightedLatency(thisMonth)
  const latencyLastMonth = weightedLatency(lastMonth)

  const totals = thisMonth.reduce(
    (acc, row) => {
      acc.reviews += row.reviews
      acc.correct += row.correct
      acc.hints += row.hints_used
      acc.activated += row.words_activated
      return acc
    },
    { reviews: 0, correct: 0, hints: 0, activated: 0 }
  )

  const week = stats.filter((row) => row.day >= weekStart)
  const weekTotals = week.reduce(
    (acc, row) => {
      acc.seconds += row.seconds_trained
      acc.activated += row.words_activated
      acc.reviews += row.reviews
      return acc
    },
    { seconds: 0, activated: 0, reviews: 0 }
  )

  const firstHalf = week.slice(0, Math.ceil(week.length / 2))
  const secondHalf = week.slice(Math.ceil(week.length / 2))

  const context = await buildAchievementContext(userId)
  const achievements = evaluateAchievements(context)
  const unlockedCodes = (achievementsResponse.data ?? []).map((row) => row.achievement_code)

  const improved = (improvedResponse.data ?? []).map((row) => ({
    lemma: row.lemma,
    gain: row.gain,
  }))
  const weakestTag = tagsResponse.data?.[0]?.tag ?? null

  return {
    overview,
    streak: displayStreak(
      {
        currentStreak: bundle.progress.current_streak,
        longestStreak: bundle.progress.longest_streak,
        lastActiveDay: bundle.progress.last_active_day,
        freezes: bundle.progress.streak_freezes,
      },
      today
    ),
    streakFreezes: bundle.progress.streak_freezes,
    level: levelFromXp(bundle.progress.xp),
    days,
    weekMinutes,
    weekHasActivity: weekTotals.reviews > 0,
    latencyThisMonth,
    latencyLastMonth,
    latencyChange: latencyImprovement(latencyLastMonth, latencyThisMonth),
    accuracy: totals.reviews > 0 ? Math.round((totals.correct / totals.reviews) * 100) : null,
    noHintRate:
      totals.reviews > 0
        ? Math.round(((totals.reviews - totals.hints) / totals.reviews) * 100)
        : null,
    activatedThisMonth: totals.activated,
    achievements: achievements.filter((entry) =>
      ACHIEVEMENTS.some((definition) => definition.code === entry.definition.code)
    ),
    unlockedCodes,
    weekly: {
      minutesTrained: Math.round(weekTotals.seconds / 60),
      wordsActivated: weekTotals.activated,
      latencyBefore: weightedLatency(firstHalf),
      latencyAfter: weightedLatency(secondHalf),
      mostImproved: improved,
      weakestTag,
      focus: suggestFocus(overview, weakestTag),
    },
  }
}

function weightedLatency(
  rows: Array<{ avg_latency_ms: number | null; reviews: number }>
): number | null {
  let total = 0
  let weight = 0
  for (const row of rows) {
    if (row.avg_latency_ms == null || row.reviews <= 0) continue
    total += row.avg_latency_ms * row.reviews
    weight += row.reviews
  }
  return weight > 0 ? Math.round(total / weight) : null
}

/** A concrete suggestion, chosen from the learner's own numbers. */
function suggestFocus(overview: WordOverview, weakestTag: string | null): string {
  if (overview.weakCount > overview.activating) return 'repairing weak words'
  if (weakestTag) return `${weakestTag} vocabulary`
  if (overview.newCount > 20) return 'activating new words'
  return 'collocations'
}
