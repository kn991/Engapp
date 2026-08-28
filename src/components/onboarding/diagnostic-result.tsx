import { LinkButton } from '@/components/ui/link-button'
import { formatLatency } from '@/domain/learning'
import { cn } from '@/lib/utils'

export interface DiagnosticResultProps {
  estimatedLevel: string
  fastShare: number
  slowShare: number
  missedShare: number
  avgLatencyMs: number | null
  wordCount: number
}

/**
 * The result deliberately separates what the learner knows from what they can
 * retrieve. Almost everyone arrives with a large passive vocabulary; the
 * interesting number is how much of it comes back in time.
 */
/**
 * The line under the level has to match what actually happened. Telling
 * someone they already know these words when none of them came out is the
 * fastest way to lose their trust.
 */
function summaryLine(retrievedShare: number): string {
  if (retrievedShare >= 60) {
    return 'You already know many of these words. We train the speed at which they come back.'
  }
  if (retrievedShare >= 25) {
    return 'Some came back, most did not. That gap is exactly what we train.'
  }
  return 'Recognising a word and producing it are different skills. We start from what you could retrieve.'
}

export function DiagnosticResult({
  estimatedLevel,
  fastShare,
  slowShare,
  missedShare,
  avgLatencyMs,
  wordCount,
}: DiagnosticResultProps) {
  const rows = [
    { label: 'Fast recall', value: fastShare, tone: 'bg-[var(--success)]' },
    { label: 'Slow recall', value: slowShare, tone: 'bg-[var(--warning)]' },
    { label: 'Not retrieved', value: missedShare, tone: 'bg-[var(--danger)]' },
  ]

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-5 pt-8 pb-5">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        Your baseline
      </p>
      <h1 className="font-display mt-2 text-[1.75rem] leading-tight">
        Active recall: {estimatedLevel}
      </h1>
      <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">{summaryLine(fastShare + slowShare)}</p>

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
            {formatLatency(avgLatencyMs)}
          </span>
        </div>
        {wordCount > 0 && (
          <p className="mt-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
            Your first set has {wordCount} words, weighted towards the ones that stalled.
          </p>
        )}
      </div>

      <div className="mt-auto pt-8">
        <LinkButton href="/train" size="lg" fullWidth>
          Start your first session
        </LinkButton>
      </div>
    </div>
  )
}
