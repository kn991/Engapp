import type { Metadata } from 'next'
import { OfflineIcon } from '@/components/icons'
import { LinkButton } from '@/components/ui/link-button'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
}

/** Served by the service worker when a navigation fails with no network. */
export default function OfflinePage() {
  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <OfflineIcon size={28} className="mt-8 text-[var(--muted)]" />
      <h1 className="font-display mt-4 text-[1.5rem]">You are offline</h1>
      <p className="mt-2 max-w-[34ch] text-[0.9375rem] text-[var(--muted)]">
        Answers you gave during a session are stored on this device and will sync as soon as you
        are back online.
      </p>
      <LinkButton href="/home" variant="secondary" className="mt-7">
        Try again
      </LinkButton>
    </div>
  )
}
