import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { DangerZone } from '@/components/profile/danger-zone'
import { SettingsForm } from '@/components/profile/settings-form'
import { InstallPrompt } from '@/components/profile/install-prompt'
import { SectionTitle } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { requireUser } from '@/lib/supabase/auth'
import { loadProfileBundle } from '@/server/queries/profile'
import { levelFromXp } from '@/domain/learning'

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await requireUser()
  const bundle = await loadProfileBundle(user.id)
  if (!bundle) redirect('/login')

  const level = levelFromXp(bundle.progress.xp)

  return (
    <>
      <AppHeader title="Profile" subtitle={user.email ?? undefined} />

      <div className="space-y-8 px-5 pb-8">
        <section className="grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <Stat label="Level" value={level.level} tone="accent" />
          <Stat label="Total XP" value={bundle.progress.xp} />
          <Stat label="Sessions" value={bundle.progress.total_sessions} />
        </section>

        <SettingsForm
          initial={{
            displayName: bundle.profile.display_name ?? '',
            dailyGoalMinutes: bundle.settings.daily_goal_minutes,
            declaredLevel: bundle.settings.declared_level as 'A2' | 'B1' | 'B2' | 'C1' | 'unsure',
            inputMode: bundle.settings.input_mode,
            englishVariety: bundle.settings.english_variety,
            soundEnabled: bundle.settings.sound_enabled,
            hapticsEnabled: bundle.settings.haptics_enabled,
            reminderEnabled: bundle.settings.reminder_enabled,
            reminderTime: bundle.settings.reminder_time?.slice(0, 5) ?? null,
            timeZone: bundle.timeZone,
          }}
        />

        <InstallPrompt />

        <DangerZone />

        {bundle.profile.is_admin && (
          <section>
            <SectionTitle>Admin</SectionTitle>
            <Link
              href="/admin"
              className="mt-2 inline-block text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Manage curated vocabulary
            </Link>
          </section>
        )}

        <section className="space-y-2 pt-2 text-sm text-[var(--muted)]">
          <Link href="/privacy" className="block underline-offset-4 hover:underline">
            Privacy policy
          </Link>
          <Link href="/terms" className="block underline-offset-4 hover:underline">
            Terms of use
          </Link>
        </section>
      </div>
    </>
  )
}
