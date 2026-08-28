import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { AchievementBadge } from '@/components/achievement-badge'
import { ActivationFunnel } from '@/components/home/funnel'
import { Heatmap } from '@/components/progress/heatmap'
import { LatencyTrend } from '@/components/progress/latency-trend'
import { WeekBars } from '@/components/progress/week-bars'
import { SectionTitle } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/empty-state'
import { formatLatency } from '@/domain/learning'
import { requireUser } from '@/lib/supabase/auth'
import { loadProfileBundle } from '@/server/queries/profile'
import { loadProgressData } from '@/server/queries/progress'

export const metadata: Metadata = {
  title: 'Progress',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ProgressPage() {
  const user = await requireUser()
  const [bundle, data] = await Promise.all([
    loadProfileBundle(user.id),
    loadProgressData(user.id),
  ])
  if (!bundle || !data) redirect('/login')

  const { overview, weekly } = data
  const known = overview.total
  const trainedAtAll = data.days.some((day) => day.reviews > 0)

  return (
    <>
      <AppHeader title="Progress" subtitle="How fast your words are coming back." />

      <div className="space-y-7 px-5 pb-6">
        <LatencyTrend
          current={data.latencyThisMonth}
          previous={data.latencyLastMonth}
          change={data.latencyChange}
        />

        <section>
          <SectionTitle>Passive to active</SectionTitle>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <ActivationFunnel
              known={known}
              activating={overview.activating + overview.strongCount}
              active={overview.activeCount}
            />
            <p className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
              Every word in your set, and how far each one has moved towards
              coming back on its own.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <Stat label="Accuracy" value={data.accuracy != null ? `${data.accuracy}%` : '—'} />
          <Stat label="Without hints" value={data.noHintRate != null ? `${data.noHintRate}%` : '—'} />
          <Stat
            label="Streak"
            value={data.streak}
            hint={
              data.streakFreezes > 0
                ? `${data.streakFreezes} ${data.streakFreezes === 1 ? 'freeze' : 'freezes'} banked`
                : undefined
            }
            tone="accent"
          />
        </section>

        <section>
          <SectionTitle>Last 7 days</SectionTitle>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <WeekBars minutes={data.weekMinutes} timeZone={bundle.timeZone} />
            {!data.weekHasActivity && (
              <p className="mt-3 text-sm text-[var(--muted)]">
                No training recorded in the last seven days.
              </p>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>This week</SectionTitle>
          <div className="mt-3 space-y-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Minutes trained" value={weekly.minutesTrained} />
              <Stat label="Words activated" value={weekly.wordsActivated} tone="accent" />
            </div>
            {weekly.latencyBefore != null && weekly.latencyAfter != null && (
              <p className="text-sm text-[var(--muted)]">
                Recall speed{' '}
                <span className="tabular text-[var(--text)]">
                  {formatLatency(weekly.latencyBefore)} → {formatLatency(weekly.latencyAfter)}
                </span>
              </p>
            )}
            {weekly.mostImproved.length > 0 && (
              <div>
                <p className="text-sm text-[var(--muted)]">Most improved</p>
                <p className="mt-1 text-[0.9375rem]" lang="en">
                  {weekly.mostImproved.map((entry) => entry.lemma).join(', ')}
                </p>
              </div>
            )}
            {weekly.weakestTag && (
              <p className="text-sm text-[var(--muted)]">
                Weakest area <span className="text-[var(--text)]">{weekly.weakestTag}</span>
              </p>
            )}
            <p className="border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
              Next week, focus on <span className="text-[var(--text)]">{weekly.focus}</span>.
            </p>
          </div>
        </section>

        <section>
          <SectionTitle>Activity</SectionTitle>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            {trainedAtAll ? (
              <Heatmap days={data.days} />
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Your first session will show up here.
              </p>
            )}
          </div>
        </section>

        <section>
          <SectionTitle>Achievements</SectionTitle>
          {data.achievements.length === 0 ? (
            <EmptyState className="mt-3" title="Nothing unlocked yet" />
          ) : (
            <ul className="mt-3 space-y-3">
              {data.achievements.map((entry) => {
                const unlocked = entry.unlocked || data.unlockedCodes.includes(entry.definition.code)
                return (
                  <li key={entry.definition.code} className="flex items-center gap-3">
                    <AchievementBadge icon={entry.definition.icon} unlocked={unlocked} />
                    <div className="min-w-0 flex-1">
                      <p className={unlocked ? 'font-medium' : 'font-medium text-[var(--muted)]'}>
                        {entry.definition.title}
                      </p>
                      <p className="text-sm text-[var(--muted)]">{entry.definition.description}</p>
                      {!unlocked && (
                        <p className="tabular mt-0.5 text-xs text-[var(--muted)]">
                          {Math.min(entry.value, entry.target)} / {entry.target}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
