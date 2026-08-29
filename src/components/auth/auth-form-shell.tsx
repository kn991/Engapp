import type { ReactNode } from 'react'

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <section>
      <h1 className="font-display text-[1.75rem] leading-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">{subtitle}</p>}
      <div className="mt-7">{children}</div>
      {footer && <div className="mt-6 text-sm text-[var(--muted)]">{footer}</div>}
    </section>
  )
}
