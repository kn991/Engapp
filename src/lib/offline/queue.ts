'use client'

/**
 * Durable outbox for review events.
 *
 * Answers are written here the moment they are given, then flushed to the
 * server. If the network drops, the phone locks, or the tab is closed
 * mid-session, the answers survive and are sent on the next attempt. Every
 * entry carries a `clientEventId`, and the server treats that as an
 * idempotency key, so a replay after a timeout can never double count.
 */

import type { AttemptPayload } from '@/lib/validation'

const DB_NAME = 'verba'
const DB_VERSION = 1
const STORE = 'pending-reviews'

export interface PendingAttempt extends AttemptPayload {
  sessionId: string | null
  queuedAt: number
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB unavailable'))
  }
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'clientEventId' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'))
  })

  return dbPromise
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = run(tx.objectStore(STORE))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'))
  })
}

export async function enqueueAttempts(attempts: PendingAttempt[]): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      for (const attempt of attempts) store.put(attempt)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'))
    })
  } catch {
    // Storage can be blocked (private mode, quota). The session continues in
    // memory; only crash recovery is lost, which the caller already tolerates.
  }
}

export async function readPendingAttempts(): Promise<PendingAttempt[]> {
  try {
    const rows = await withStore<PendingAttempt[]>('readonly', (store) => store.getAll())
    return rows.sort((a, b) => a.queuedAt - b.queuedAt)
  } catch {
    return []
  }
}

export async function removeAttempts(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  try {
    const db = await openDb()
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      for (const id of ids) store.delete(id)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch {
    // Nothing to recover: the rows will be retried and deduplicated server side.
  }
}

export async function pendingCount(): Promise<number> {
  try {
    return await withStore<number>('readonly', (store) => store.count())
  } catch {
    return 0
  }
}
