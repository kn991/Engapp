import { cn } from '@/lib/utils'

export function SessionProgress({
  current,
  total,
  className,
}: {
  current: number
  total: number
  className?: string
}) {
  const pct = total === 0 ? 0 : Math.min(100, (current / total) * 100)
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="sr-only">Session progress</span>
        <span aria-hidden="true" />
        <span className="tabular text-sm text-[var(--muted)]">
          {current} / {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={current}
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
