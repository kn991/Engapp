import 'server-only'

import {
  challengesForDay,
  displayStreak,
  evaluateChallenges,
  levelFromXp,
  todayKey,
  type DailyChallenge,
} from '@/domain/learning'
import { createServerSupabase } from '@/lib/supabase/server'
import { loadProfileBundle, type ProfileBundle } from './profile'

export interface WordOverview {
  total: number
  newCount: number
  weakCount: number
  activating: number
  strongCount: number
  activeCount: number
  dueNow: number
  avgLatencyMs: number | null
  customCount: number
}

export interface HomeData extends ProfileBundle {
  overview: WordOverview
  today: {
    day: string
    secondsTrained: number
    reviews: number
    fast: number
    activated: number
    goalSeconds: number
  }
  streak: number
  level: ReturnType<typeof levelFromXp>
  challenges: DailyChallenge[]
}

export const EMPTY_OVERVIEW: WordOverview = {
  total: 0,
  newCount: 0,
  weakCount: 0,
  activating: 0,
  strongCount: 0,
  activeCount: 0,
  dueNow: 0,
  avgLatencyMs: null,
  customCount: 0,
}

export async function loadWordOverview(): Promise<WordOverview> {
  const supabase = await createServerSupabase()
  const { data } = await supabase.rpc('user_word_overview')
  const row = data?.[0]
  if (!row) return EMPTY_OVERVIEW
  return {
    total: row.total ?? 0,
    newCount: row.new_count ?? 0,
    weakCount: row.weak_count ?? 0,
    activating: row.activating ?? 0,
    strongCount: row.strong_count ?? 0,
    activeCount: row.active_count ?? 0,
    dueNow: row.due_now ?? 0,
    avgLatencyMs: row.avg_latency_ms,
    customCount: row.custom_count ?? 0,
  }
}

/** Everything the home screen shows, computed from real review history. */
export async function loadHomeData(userId: string): Promise<HomeData | null> {
  const bundle = await loadProfileBundle(userId)
  if (!bundle) return null

  const supabase = await createServerSupabase()
  const day = todayKey(bundle.timeZone)

  const [overview, todayStats, challengeRows] = await Promise.all([
    loadWordOverview(),
    supabase
      .from('daily_stats')
      .select('seconds_trained, reviews, fast, words_activated')
      .eq('user_id', userId)
      .eq('day', day)
      .maybeSingle(),
    supabase
      .from('user_daily_challenges')
      .select('challenge_code, target, progress, completed_at')
      .eq('user_id', userId)
      .eq('day', day),
  ])

  const stored = new Map(
    (challengeRows.data ?? []).map((row) => [row.challenge_code, row])
  )

  const challenges = evaluateChallenges(challengesForDay(userId, day), {
    fastRecalls: 0,
    noHintReviews: 0,
    weakRecovered: 0,
    collocationReviews: 0,
    reviews: 0,
    minutes: 0,
  }).map((challenge) => {
    const row = stored.get(challenge.code)
    if (!row) return challenge
    return {
      ...challenge,
      progress: Math.min(1, row.progress / Math.max(1, row.target)),
      completed: row.completed_at !== null,
    }
  })

  return {
    ...bundle,
    overview,
    today: {
      day,
      secondsTrained: todayStats.data?.seconds_trained ?? 0,
      reviews: todayStats.data?.reviews ?? 0,
      fast: todayStats.data?.fast ?? 0,
      activated: todayStats.data?.words_activated ?? 0,
      goalSeconds: bundle.settings.daily_goal_minutes * 60,
    },
    streak: displayStreak(
      {
        currentStreak: bundle.progress.current_streak,
        longestStreak: bundle.progress.longest_streak,
        lastActiveDay: bundle.progress.last_active_day,
        freezes: bundle.progress.streak_freezes,
      },
      day
    ),
    level: levelFromXp(bundle.progress.xp),
    challenges,
  }
}
