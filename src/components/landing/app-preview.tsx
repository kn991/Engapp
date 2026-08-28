import { ActivationFunnel } from '@/components/home/funnel'
import { LatencyBadge } from '@/components/train/latency-badge'
import { SessionProgress } from '@/components/train/session-progress'
import { Stat } from '@/components/ui/stat'

/**
 * Two screens from the product, built from the real components rather than
 * flat images, so what a visitor sees is what actually ships.
 */
export function AppPreview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PhoneFrame label="A question during training">
        <div className="flex h-full flex-col p-4">
          <SessionProgress current={8} total={20} />
          <div className="flex flex-1 flex-col justify-center text-center">
            <p className="text-[0.625rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              Write the English word
            </p>
            <p lang="ru" className="font-display mt-3 text-[1.625rem] leading-tight">
              избегать
            </p>
            <p lang="en" className="mt-3 text-[0.8125rem] text-[var(--muted)]">
              “I try to ___ conflict.”
            </p>
          </div>
          <div className="h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)]" />
        </div>
      </PhoneFrame>

      <PhoneFrame label="Feedback after an answer">
        <div className="flex h-full flex-col p-4">
          <SessionProgress current={9} total={20} />
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p lang="ru" className="text-[0.8125rem] text-[var(--muted)]">
              избегать
            </p>
            <p lang="en" className="font-display mt-1 text-[1.75rem] leading-tight">
              avoid
            </p>
            <div className="mt-2">
              <LatencyBadge band="instant" latencyMs={1800} />
            </div>
            <p lang="en" className="mt-3 text-[0.8125rem] text-[var(--muted)]">
              “I try to avoid conflict.”
            </p>
          </div>
          <div className="h-11 rounded-[var(--radius-md)] bg-[var(--accent)]" />
        </div>
      </PhoneFrame>
    </div>
  )
}

export function ProgressPreview() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        What progress looks like
      </p>
      <div className="mt-4">
        <ActivationFunnel known={1260} activating={184} active={347} />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
        <Stat label="Average recall" value="3.4 sec" />
        <Stat label="Last month" value="5.9 sec" />
        <Stat label="Faster" value="42%" tone="success" />
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Example figures. Your own screen is built from your reviews.
      </p>
    </div>
  )
}

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figure className="space-y-2">
      <div className="h-[22rem] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--background)]">
        {children}
      </div>
      <figcaption className="text-center text-xs text-[var(--muted)]">{label}</figcaption>
    </figure>
  )
}
