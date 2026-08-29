import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  tone?: 'accent' | 'success' | 'muted'
  size?: 'thin' | 'regular'
  className?: string
}

const TONES = {
  accent: 'bg-[var(--accent)]',
  success: 'bg-[var(--success)]',
  muted: 'bg-[var(--border-strong)]',
} as const

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = 'accent',
  size = 'regular',
  className,
}: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn(
        'w-full overflow-hidden rounded-full bg-[var(--surface-3)]',
        size === 'thin' ? 'h-1' : 'h-2',
        className
      )}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', TONES[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
