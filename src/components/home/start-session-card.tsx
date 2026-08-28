import Link from 'next/link'
import { ProgressBar } from '@/components/ui/progress-bar'
import { formatLatency } from '@/domain/learning'

export function StartSessionCard({
  dueNow,
  secondsTrained,
  goalSeconds,
  avgLatencyMs,
}: {
  dueNow: number
  secondsTrained: number
  goalSeconds: number
  avgLatencyMs: number | null
}) {
  const minutesDone = Math.floor(secondsTrained / 60)
  const goalMinutes = Math.round(goalSeconds / 60)
  const goalMet = secondsTrained >= goalSeconds

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="font-display text-[1.375rem] leading-snug">
        {dueNow > 0 ? (
          <>
            <span className="tabular text-[var(--accent)]">{dueNow}</span>{' '}
            {dueNow === 1 ? 'word is' : 'words are'} ready
          </>
        ) : goalMet ? (
          'Goal reached for today'
        ) : (
          'Nothing overdue'
        )}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">
        {dueNow > 0
          ? 'Recall each one before the pause gets long.'
          : 'Train anyway to keep your fastest words fast.'}
      </p>

      <Link
        href="/train"
        className="mt-5 flex h-14 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] text-[1.0625rem] font-medium text-[var(--accent-contrast)] transition-transform duration-150 active:scale-[0.985]"
      >
        Start daily session
      </Link>

      <div className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-[var(--muted)]">Daily goal</span>
          <span className="tabular font-medium">
            {minutesDone} / {goalMinutes} min
          </span>
        </div>
        <ProgressBar
          value={secondsTrained}
          max={goalSeconds}
          size="thin"
          tone={goalMet ? 'success' : 'accent'}
          label="Daily goal progress"
        />
        {avgLatencyMs != null && (
          <p className="text-sm text-[var(--muted)]">
            Average recall{' '}
            <span className="tabular text-[var(--text)]">{formatLatency(avgLatencyMs)}</span>
          </p>
        )}
      </div>
    </section>
  )
}
