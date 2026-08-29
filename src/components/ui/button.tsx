import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-hover)]',
  secondary:
    'bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)]',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]',
  quiet: 'bg-[var(--surface-2)] text-[var(--text-soft)] hover:bg-[var(--surface-3)]',
  danger: 'bg-[var(--danger)] text-white hover:opacity-90',
}

const SIZES: Record<Size, string> = {
  // 44px minimum touch target on every size.
  sm: 'h-11 px-3.5 text-[0.9375rem]',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-[1.0625rem]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium',
        'transition-[background-color,opacity,transform] duration-150 select-none',
        'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
})
