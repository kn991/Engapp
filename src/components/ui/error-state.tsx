'use client'

import { AlertIcon } from '@/components/icons'
import { Button } from './button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center"
    >
      <AlertIcon size={24} className="text-[var(--danger)]" />
      <p className="mt-3 font-medium text-[var(--text)]">{title}</p>
      <p className="mt-1 max-w-[36ch] text-sm text-[var(--muted)]">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
