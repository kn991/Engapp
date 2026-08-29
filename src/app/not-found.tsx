import type { Metadata } from 'next'
import { LinkButton } from '@/components/ui/link-button'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="font-display mt-8 text-[1.5rem]">We could not find that page</h1>
      <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">
        The link may be out of date.
      </p>
      <LinkButton href="/home" className="mt-7">
        Go to your home screen
      </LinkButton>
    </div>
  )
}
