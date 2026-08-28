import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { ChallengeList } from '@/components/home/challenge-list'
import { StartSessionCard } from '@/components/home/start-session-card'
import { SectionTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Stat } from '@/components/ui/stat'
import { FlameIcon } from '@/components/icons'
import { requireUser } from '@/lib/supabase/auth'
import { loadHomeData } from '@/server/queries/home'

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await requireUser()
  const data = await loadHomeData(user.id)
  if (!data) redirect('/login')
  if (!data.profile.onboarded_at) redirect('/onboarding')

  const { overview, today, streak, level, challenges } = data
  const name = data.profile.display_name?.trim()

  return (
    <>
      <AppHeader
        title={name ? `Hello, ${name}` : 'Today'}
        subtitle={greeting(overview.total)}
        action={
          streak > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--warning-soft)] px-2.5 py-1 text-sm font-semibold text-[var(--warning)]">
              <FlameIcon size={16} />
              <span className="tabular">{streak}</span>
            </span>
          ) : null
        }
      />

      <div className="space-y-6 px-5">
        <StartSessionCard
          dueNow={overview.dueNow}
          secondsTrained={today.secondsTrained}
          goalSeconds={today.goalSeconds}
          avgLatencyMs={overview.avgLatencyMs}
        />

        <section>
          <SectionTitle>Today</SectionTitle>
          <div className="mt-3 grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <Stat label="Reviews" value={today.reviews} />
            <Stat label="Fast recalls" value={today.fast} tone="success" />
            <Stat label="Activated" value={today.activated} tone="accent" />
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <SectionTitle>Your vocabulary</SectionTitle>
            <Link
              href="/words"
              className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
            >
              See all
            </Link>
          </div>
          {overview.total === 0 ? (
            <EmptyState
              className="mt-3"
              title="No words yet"
              description="Finish the setup test and we will build your first set."
            />
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
              <Stat label="Active" value={overview.activeCount} tone="accent" />
              <Stat label="Activating" value={overview.activating} />
              <Stat label="Weak" value={overview.weakCount} tone="warning" />
            </div>
          )}
        </section>

        <section>
          <SectionTitle>Daily challenges</SectionTitle>
          <div className="mt-3">
            <ChallengeList challenges={challenges} />
          </div>
        </section>

        <section className="pb-4">
          <SectionTitle>Level {level.level}</SectionTitle>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-[var(--muted)]">
                {level.isMax ? 'Top level' : 'To next level'}
              </span>
              <span className="tabular font-medium">
                {level.xpIntoLevel} / {level.xpForNextLevel} XP
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--surface-3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${Math.round(level.progress * 100)}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function greeting(total: number): string {
  if (total === 0) return 'Let us build your first set.'
  return 'One short session is enough.'
}
