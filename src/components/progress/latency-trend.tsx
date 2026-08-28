import { formatLatency } from '@/domain/learning'

/**
 * The headline number of the whole product: how long a word takes to arrive,
 * this month against last.
 */
export function LatencyTrend({
  current,
  previous,
  change,
}: {
  current: number | null
  previous: number | null
  change: number | null
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        Average recall time
      </p>
      <p className="tabular font-display mt-2 text-[2rem] leading-none">
        {formatLatency(current)}
      </p>
      {previous != null && change != null ? (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Previous 30 days <span className="tabular">{formatLatency(previous)}</span>{' '}
          <span
            className={
              change > 0
                ? 'font-semibold text-[var(--success)]'
                : change < 0
                  ? 'font-semibold text-[var(--warning)]'
                  : ''
            }
          >
            {change > 0 ? `${change}% faster` : change < 0 ? `${Math.abs(change)}% slower` : 'no change'}
          </span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Train for a few more days to see a trend.
        </p>
      )}
    </div>
  )
}
