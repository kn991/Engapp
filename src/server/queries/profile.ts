import 'server-only'

import { safeTimeZone } from '@/domain/learning'
import { createServerSupabase } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export interface ProfileBundle {
  profile: Tables<'profiles'>
  settings: Tables<'user_settings'>
  progress: Tables<'user_progress'>
  timeZone: string
}

/**
 * Profile, settings and progress in one place.
 *
 * The three rows are created by a database trigger on signup, but a user who
 * predates a migration might be missing one, so each is defaulted rather than
 * assumed.
 */
export async function loadProfileBundle(userId: string): Promise<ProfileBundle | null> {
  const supabase = await createServerSupabase()

  const [profileResponse, settingsResponse, progressResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
  ])

  const profile = profileResponse.data
  if (!profile) return null

  const now = new Date().toISOString()

  const settings: Tables<'user_settings'> = settingsResponse.data ?? {
    user_id: userId,
    focus: 'both',
    declared_level: 'unsure',
    problem_contexts: [],
    daily_goal_minutes: 10,
    input_mode: 'typing',
    english_variety: 'american',
    sound_enabled: true,
    haptics_enabled: true,
    theme: 'system',
    reminder_enabled: false,
    reminder_time: null,
    created_at: now,
    updated_at: now,
  }

  const progress: Tables<'user_progress'> = progressResponse.data ?? {
    user_id: userId,
    xp: 0,
    current_streak: 0,
    longest_streak: 0,
    last_active_day: null,
    streak_freezes: 0,
    total_reviews: 0,
    total_sessions: 0,
    created_at: now,
    updated_at: now,
  }

  return {
    profile,
    settings,
    progress,
    timeZone: safeTimeZone(profile.time_zone),
  }
}
