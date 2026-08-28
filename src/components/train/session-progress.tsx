import { cn } from '@/lib/utils'

/**
 * A thin line and a quiet counter. Nothing here should compete with the
 * question, so there is no ticking clock and no large numbers.
 */
export function SessionProgress({
  current,
  completed,
  total,
  className,
}: {
  /** The question being answered, 1-based. */
  current: number
  /** Questions already answered, which is what the bar fills to. */
  completed: number
  total: number
  className?: string
}) {
  const pct = total === 0 ? 0 : Math.min(100, (completed / total) * 100)
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-end">
        <span className="tabular text-sm text-[var(--muted)]">
          {Math.min(current, total)} / {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Session progress"
        className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--surface-3)]"
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
