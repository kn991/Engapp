'use client'

import { useCallback, useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

/**
 * Reads a value that only exists in the browser without writing state from an
 * effect, which would cause a cascading render.
 *
 * The server snapshot keeps hydration stable; the client snapshot is read on
 * the first client render.
 */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  const getSnapshot = useCallback(() => read(), [read])
  const getServerSnapshot = useCallback(() => serverValue, [serverValue])
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot)
}
