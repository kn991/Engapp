import { bandLabel, formatLatency, type RecallBand } from '@/domain/learning'
import { cn } from '@/lib/utils'

const TONES: Record<RecallBand, string> = {
  instant: 'text-[var(--success)]',
  good: 'text-[var(--success)]',
  slow: 'text-[var(--warning)]',
  fragile: 'text-[var(--warning)]',
  failed: 'text-[var(--danger)]',
}

/**
 * Speed is never signalled by colour alone: the band is always written out.
 */
export function LatencyBadge({
  band,
  latencyMs,
  className,
}: {
  band: RecallBand
  latencyMs: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-2 text-sm font-medium', TONES[band], className)}>
      <span>{bandLabel(band)}</span>
      <span className="tabular text-[var(--muted)]">{formatLatency(latencyMs)}</span>
    </span>
  )
}
