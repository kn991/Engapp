'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Shown only when the browser actually offers installation, or on iOS where
 * the step is manual. There is never an Install button that does nothing.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIos, setIsIos] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setInstalled(standalone)

    const ua = window.navigator.userAgent
    setIsIos(/iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua))

    const handler = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (installed) return null
  if (!deferred && !isIos) return null

  return (
    <section className="space-y-3">
      <SectionTitle>Install</SectionTitle>
      {deferred ? (
        <>
          <p className="text-sm text-[var(--muted)]">
            Add Verba to your home screen for a full-screen, offline-capable app.
          </p>
          <Button
            variant="secondary"
            fullWidth
            type="button"
            onClick={async () => {
              await deferred.prompt()
              const choice = await deferred.userChoice
              if (choice.outcome === 'accepted') setInstalled(true)
              setDeferred(null)
            }}
          >
            Add to home screen
          </Button>
        </>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          On iPhone, tap the Share button in Safari and choose “Add to Home Screen”.
        </p>
      )}
    </section>
  )
}
