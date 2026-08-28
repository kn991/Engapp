import type { ReactNode } from 'react'

export function StepShell({
  step,
  total,
  title,
  description,
  children,
  footer,
}: {
  step: number
  total: number
  title: string
  description?: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-5 pt-6 pb-5">
      <div className="mb-6">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={
                index < step
                  ? 'h-1 flex-1 rounded-full bg-[var(--accent)]'
                  : 'h-1 flex-1 rounded-full bg-[var(--surface-3)]'
              }
            />
          ))}
        </div>
        <p className="sr-only">
          Step {step} of {total}
        </p>
      </div>

      <h1 className="font-display text-[1.625rem] leading-tight">{title}</h1>
      {description && <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">{description}</p>}

      <div className="mt-7 flex-1">{children}</div>
      <div className="pt-6">{footer}</div>
    </div>
  )
}
