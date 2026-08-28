import 'server-only'

import type { AchievementContext } from '@/domain/learning'
import { createServerSupabase } from '@/lib/supabase/server'

/** Every achievement value is recomputed from stored data, never incremented. */
export async function buildAchievementContext(
  userId: string
): Promise<AchievementContext> {
  const supabase = await createServerSupabase()

  const [
    sessions,
    reviews,
    instant,
    noHint,
    active,
    custom,
    challenges,
    recovered,
    progress,
    earliest,
    latest,
  ] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase.from('review_events').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('review_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('recall_band', 'instant'),
    supabase
      .from('review_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('hint_level', 0),
    supabase
      .from('user_words')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active'),
    supabase
      .from('words')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', userId),
    supabase
      .from('user_daily_challenges')
      .select('challenge_code', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase.rpc('recovered_word_count'),
    supabase
      .from('user_progress')
      .select('current_streak, longest_streak, xp')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('daily_stats')
      .select('avg_latency_ms')
      .eq('user_id', userId)
      .not('avg_latency_ms', 'is', null)
      .order('day', { ascending: true })
      .limit(3),
    supabase
      .from('daily_stats')
      .select('avg_latency_ms')
      .eq('user_id', userId)
      .not('avg_latency_ms', 'is', null)
      .order('day', { ascending: false })
      .limit(3),
  ])

  const average = (rows: Array<{ avg_latency_ms: number | null }> | null) => {
    const values = (rows ?? []).map((row) => row.avg_latency_ms).filter((v): v is number => v != null)
    if (values.length === 0) return null
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }

  return {
    sessionsCompleted: sessions.count ?? 0,
    totalReviews: reviews.count ?? 0,
    instantRecalls: instant.count ?? 0,
    activeWords: active.count ?? 0,
    currentStreak: progress.data?.current_streak ?? 0,
    longestStreak: progress.data?.longest_streak ?? 0,
    recoveredWords: (recovered.data as number | null) ?? 0,
    baselineAvgLatencyMs: average(earliest.data),
    currentAvgLatencyMs: average(latest.data),
    noHintReviews: noHint.count ?? 0,
    customWords: custom.count ?? 0,
    challengesCompleted: challenges.count ?? 0,
    level: 1,
  }
}
