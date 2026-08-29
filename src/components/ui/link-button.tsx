import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)]',
  secondary:
    'bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)]',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]',
}

const SIZES: Record<Size, string> = {
  sm: 'h-11 px-3.5 text-[0.9375rem]',
  md: 'h-12 px-5 text-base',
  lg: 'h-14 px-6 text-[1.0625rem]',
}

export function LinkButton({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium',
        'transition-[background-color,transform] duration-150 active:scale-[0.985]',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
}
