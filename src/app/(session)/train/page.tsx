import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { TrainingSession } from '@/components/train/training-session'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/link-button'
import { todayKey } from '@/domain/learning'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'
import { loadProfileBundle } from '@/server/queries/profile'
import { loadSessionQueue } from '@/server/queries/session'

export const metadata: Metadata = {
  title: 'Training',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function TrainPage() {
  const user = await requireUser()
  const bundle = await loadProfileBundle(user.id)
  if (!bundle) redirect('/login')
  if (!bundle.profile.onboarded_at) redirect('/onboarding')

  const day = todayKey(bundle.timeZone)
  const { items } = await loadSessionQueue({
    userId: user.id,
    goalMinutes: bundle.settings.daily_goal_minutes,
  })

  if (items.length === 0) {
    return (
      <div className="safe-top px-5 py-12">
        <EmptyState
          title="Nothing to train right now"
          description="Every word you have is scheduled for later. Add some of your own, or come back tomorrow."
          action={
            <LinkButton href="/words" variant="secondary">
              Go to your words
            </LinkButton>
          }
        />
      </div>
    )
  }

  const supabase = await createServerSupabase()
  const { data: session, error } = await supabase
    .from('training_sessions')
    .insert({
      user_id: user.id,
      kind: 'daily',
      planned_count: items.length,
      local_day: day,
    })
    .select('id')
    .single()

  if (error || !session) {
    logError('train.createSession', error, { userId: user.id })
    return (
      <div className="safe-top px-5 py-12">
        <EmptyState
          title="We could not start a session"
          description="Check your connection and try again."
          action={
            <LinkButton href="/home" variant="secondary">
              Back to home
            </LinkButton>
          }
        />
      </div>
    )
  }

  return (
    <TrainingSession
      sessionId={session.id}
      items={items}
      localDay={day}
      settings={{
        soundEnabled: bundle.settings.sound_enabled,
        hapticsEnabled: bundle.settings.haptics_enabled,
        englishVariety: bundle.settings.english_variety,
        inputMode: bundle.settings.input_mode,
      }}
    />
  )
}
