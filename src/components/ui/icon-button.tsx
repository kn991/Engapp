import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only controls must still be announced. */
  label: string
  tone?: 'default' | 'accent'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, label, tone = 'default', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)]',
        'transition-colors duration-150 active:scale-[0.97] disabled:opacity-40',
        tone === 'accent'
          ? 'text-[var(--accent)] hover:bg-[var(--accent-soft)]'
          : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
