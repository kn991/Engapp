'use client'

import { Button } from '@/components/ui/button'
import { formatLatency, type DiagnosticSummary } from '@/domain/learning'
import { cn } from '@/lib/utils'

/**
 * The result deliberately separates what the learner knows from what they can
 * retrieve. Almost everyone arrives with a large passive vocabulary; the
 * interesting number is how much of it comes back in time.
 */
export function DiagnosticResult({
  summary,
  wordCount,
  error,
  onStart,
}: {
  summary: DiagnosticSummary
  wordCount: number
  error: string | null
  onStart: () => void
}) {
  const rows = [
    { label: 'Fast recall', value: summary.fastShare, tone: 'bg-[var(--success)]' },
    { label: 'Slow recall', value: summary.slowShare, tone: 'bg-[var(--warning)]' },
    { label: 'Not retrieved', value: summary.missedShare, tone: 'bg-[var(--danger)]' },
  ]

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-5 pt-8 pb-5">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        Your baseline
      </p>
      <h1 className="font-display mt-2 text-[1.75rem] leading-tight">
        Active recall: {summary.estimatedLevel}
      </h1>
      <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">
        You already know many of these words. We train the speed at which they come back.
      </p>

      <div className="mt-7 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span>{row.label}</span>
              <span className="tabular font-semibold">{row.value}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
              <div className={cn('h-full rounded-full', row.tone)} style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[var(--muted)]">Average time to recall</span>
          <span className="tabular text-[1.25rem] font-semibold">
            {formatLatency(summary.avgLatencyMs)}
          </span>
        </div>
        {wordCount > 0 && (
          <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
            Your first set has {wordCount} words, weighted towards the ones that stalled.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <div className="mt-auto pt-8">
        <Button size="lg" fullWidth onClick={onStart}>
          Start your first session
        </Button>
      </div>
    </div>
  )
}
