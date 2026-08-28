import { cn } from '@/lib/utils'

export interface StatProps {
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  className?: string
}

const TONES = {
  default: 'text-[var(--text)]',
  accent: 'text-[var(--accent)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  danger: 'text-[var(--danger)]',
} as const

export function Stat({ label, value, hint, tone = 'default', className }: StatProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className={cn('tabular text-[1.375rem] leading-tight font-semibold', TONES[tone])}>
        {value}
      </div>
      <div className="mt-0.5 truncate text-[0.8125rem] text-[var(--muted)]">{label}</div>
      {hint && <div className="mt-0.5 truncate text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  )
}
