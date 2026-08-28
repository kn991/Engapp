'use client'

import { useEffect, useState } from 'react'
import { OfflineIcon } from '@/components/icons'

/** Shown only while the browser reports no connection. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      className="safe-top sticky top-0 z-40 flex items-center justify-center gap-2 bg-[var(--warning-soft)] px-4 py-2 text-sm text-[var(--warning)]"
    >
      <OfflineIcon size={16} />
      Offline. Your answers are saved and will sync.
    </div>
  )
}
