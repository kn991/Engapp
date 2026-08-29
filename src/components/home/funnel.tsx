import { cn } from '@/lib/utils'

/**
 * The product in one picture: words move from recognised, through activating,
 * to reliably retrievable.
 */
export function ActivationFunnel({
  known,
  activating,
  active,
  className,
}: {
  known: number
  activating: number
  active: number
  className?: string
}) {
  const max = Math.max(known, activating, active, 1)
  const rows = [
    { label: 'Known', value: known, tone: 'bg-[var(--border-strong)]' },
    { label: 'Activating', value: activating, tone: 'bg-[var(--accent)]/45' },
    { label: 'Active', value: active, tone: 'bg-[var(--accent)]' },
  ]

  return (
    <div className={cn('space-y-2.5', className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-[5.5rem] shrink-0 text-sm text-[var(--muted)]">{row.label}</span>
          <div className="h-7 flex-1 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
            <div
              className={cn('h-full rounded-[var(--radius-sm)]', row.tone)}
              style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }}
            />
          </div>
          <span className="tabular w-12 shrink-0 text-right text-sm font-semibold">{row.value}</span>
        </div>
      ))}
    </div>
  )
}
