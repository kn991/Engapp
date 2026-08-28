'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LinkButton } from '@/components/ui/link-button'
import { AlertIcon } from '@/components/icons'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // The digest links this screen to the server log entry without exposing
    // anything about the failure to the person reading it.
    console.error('Unhandled application error', error.digest ?? '')
  }, [error])

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <AlertIcon size={28} className="text-[var(--danger)]" />
      <h1 className="font-display mt-4 text-[1.5rem]">Something went wrong</h1>
      <p className="mt-2 max-w-[36ch] text-[0.9375rem] text-[var(--muted)]">
        The page could not be loaded. Your progress is saved.
      </p>
      <div className="mt-7 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <LinkButton href="/home" variant="secondary">
          Home
        </LinkButton>
      </div>
    </div>
  )
}
