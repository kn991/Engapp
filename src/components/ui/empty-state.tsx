import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed',
        'border-[var(--border-strong)] px-6 py-10 text-center',
        className
      )}
    >
      <p className="font-display text-lg text-[var(--text)]">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-[34ch] text-sm text-[var(--muted)]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
