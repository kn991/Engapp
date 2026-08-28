import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'

/**
 * Full export of one learner's own data as JSON.
 *
 * Every query runs under the caller's session, so row level security decides
 * what is included: this endpoint cannot be used to read anyone else's rows.
 */
export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = await createServerSupabase()

  try {
    const [profile, settings, progress, userWords, reviews, sessions, stats, achievements, customWords] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_progress').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_words').select('*').eq('user_id', user.id),
        supabase
          .from('review_events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(20_000),
        supabase.from('training_sessions').select('*').eq('user_id', user.id),
        supabase.from('daily_stats').select('*').eq('user_id', user.id),
        supabase.from('user_achievements').select('*').eq('user_id', user.id),
        supabase.from('words').select('*').eq('created_by', user.id),
      ])

    const payload = {
      exportedAt: new Date().toISOString(),
      account: { id: user.id, email: user.email },
      profile: profile.data,
      settings: settings.data,
      progress: progress.data,
      words: userWords.data ?? [],
      customWords: customWords.data ?? [],
      reviewEvents: reviews.data ?? [],
      sessions: sessions.data ?? [],
      dailyStats: stats.data ?? [],
      achievements: achievements.data ?? [],
    }

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="verba-export-${new Date().toISOString().slice(0, 10)}.json"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    logError('export', error, { userId: user.id })
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
