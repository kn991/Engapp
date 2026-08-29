import { APP } from '@/config/app'
import { cn } from '@/lib/utils'

/**
 * Typographic wordmark. The raised dot stands for the pause we are trying to
 * remove: the moment between meaning and word.
 */
export function Logo({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'text-[1.0625rem]',
    md: 'text-xl',
    lg: 'text-[1.75rem]',
  } as const

  return (
    <span
      className={cn(
        'font-display inline-flex items-baseline leading-none tracking-[-0.02em]',
        sizes[size],
        className
      )}
    >
      {APP.name}
      <span
        aria-hidden="true"
        className="ml-[0.12em] inline-block h-[0.28em] w-[0.28em] rounded-full bg-[var(--accent)]"
      />
    </span>
  )
}

export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label={APP.name}
    >
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path
        d="M8.5 9.5 15 22h2L23.5 9.5"
        fill="none"
        stroke="var(--accent-contrast)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
