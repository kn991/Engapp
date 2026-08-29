import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeftIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

export function AppHeader({
  title,
  subtitle,
  back,
  action,
  className,
}: {
  title: string
  subtitle?: string
  back?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('safe-top px-5 pt-4 pb-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {back && (
            <Link
              href={back}
              className="-ml-1 mb-1 inline-flex h-9 items-center gap-1 pr-2 text-sm text-[var(--muted)]"
            >
              <ArrowLeftIcon size={18} />
              Back
            </Link>
          )}
          <h1 className="font-display truncate text-[1.5rem] leading-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-[var(--muted)]">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0 pt-1">{action}</div>}
      </div>
    </header>
  )
}
