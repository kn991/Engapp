'use client'

import { ACHIEVEMENTS_BY_CODE, formatLatency, latencyImprovement, type RecallBand } from '@/domain/learning'
import { formatDuration } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Skeleton } from '@/components/ui/skeleton'
import { AchievementBadge } from '@/components/achievement-badge'
import { Celebration } from './celebration'

export interface SummaryAttempt {
  lemma: string
  band: RecallBand
  latencyMs: number
  wasCorrect: boolean
  previousLatencyMs: number | null
  justActivated: boolean
}

export interface SessionSummaryData {
  durationMs: number
  attempts: SummaryAttempt[]
  xpFromAnswers: number
  bonusXp: number
  unlocked: string[]
  streak: number | null
  saved: boolean
}

export function SessionSummary({
  data,
  loading,
  onDone,
}: {
  data: SessionSummaryData | null
  loading: boolean
  onDone: () => void
}) {
  if (loading || !data) {
    return (
      <div className="safe-top mx-auto max-w-md space-y-4 px-5 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const { attempts } = data
  const fast = attempts.filter((a) => a.band === 'instant' || a.band === 'good').length
  const slow = attempts.filter((a) => a.band === 'slow' || a.band === 'fragile').length
  const missed = attempts.filter((a) => a.band === 'failed').length
  const correctLatencies = attempts.filter((a) => a.wasCorrect).map((a) => a.latencyMs)
  const avgLatency =
    correctLatencies.length > 0
      ? Math.round(correctLatencies.reduce((total, value) => total + value, 0) / correctLatencies.length)
      : null

  const activated = attempts.filter((a) => a.justActivated)
  const improvements = attempts
    .filter((a) => a.wasCorrect && a.previousLatencyMs != null)
    .map((a) => ({
      lemma: a.lemma,
      before: a.previousLatencyMs as number,
      after: a.latencyMs,
      gain: latencyImprovement(a.previousLatencyMs, a.latencyMs) ?? 0,
    }))
    .filter((entry) => entry.gain > 0)
    .sort((a, b) => b.gain - a.gain)

  const best = improvements[0]
  const totalXp = data.xpFromAnswers + data.bonusXp
  const celebrate = activated.length > 0 || data.unlocked.length > 0

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
      {celebrate && <Celebration />}

      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        Session complete
      </p>
      <h1 className="font-display mt-2 text-[1.75rem] leading-tight">
        {formatDuration(data.durationMs)} · {attempts.length}{' '}
        {attempts.length === 1 ? 'review' : 'reviews'}
      </h1>

      {!data.saved && (
        <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning-soft)] px-3.5 py-2.5 text-sm text-[var(--warning)]">
          Your answers are saved. The summary could not be finished, so some totals may update later.
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <Stat label="Fast" value={fast} tone="success" />
        <Stat label="Slow" value={slow} tone="warning" />
        <Stat label="Missed" value={missed} tone="danger" />
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <Stat label="Average recall" value={formatLatency(avgLatency)} />
        <Stat label="XP earned" value={`+${totalXp}`} tone="accent" />
      </div>

      {best && (
        <section className="mt-6">
          <SectionTitle>Fastest improvement</SectionTitle>
          <p className="mt-2 text-[1.0625rem]">
            <span className="font-display text-[1.25rem]">{best.lemma}</span>{' '}
            <span className="tabular text-[var(--muted)]">
              {formatLatency(best.before)} → {formatLatency(best.after)}
            </span>
          </p>
        </section>
      )}

      {activated.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Now active</SectionTitle>
          <ul className="mt-2 space-y-1">
            {activated.map((entry) => (
              <li key={entry.lemma} className="font-display text-[1.25rem]">
                {entry.lemma}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-sm text-[var(--muted)]">
            You can retrieve {activated.length === 1 ? 'it' : 'them'} reliably now.
          </p>
        </section>
      )}

      {data.unlocked.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Unlocked</SectionTitle>
          <ul className="mt-3 space-y-3">
            {data.unlocked.map((code) => {
              const definition = ACHIEVEMENTS_BY_CODE.get(code)
              if (!definition) return null
              return (
                <li key={code} className="flex items-center gap-3">
                  <AchievementBadge icon={definition.icon} unlocked />
                  <div>
                    <p className="font-medium">{definition.title}</p>
                    <p className="text-sm text-[var(--muted)]">{definition.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="mt-auto pt-8">
        <Button size="lg" fullWidth onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  )
}
