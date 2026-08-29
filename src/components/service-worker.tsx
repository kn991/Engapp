'use client'

import { useEffect } from 'react'

/** Registers the service worker once the page is idle. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Registration can fail on unsupported browsers or private windows.
        // The app works without it, so there is nothing to recover from.
      })
    }

    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])

  return null
}
