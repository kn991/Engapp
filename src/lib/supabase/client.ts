'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { getSupabasePublicEnv } from './env'

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null

/** Browser Supabase client. One instance per tab. */
export function createClient() {
  if (cached) return cached
  const { url, key } = getSupabasePublicEnv()
  cached = createBrowserClient<Database>(url, key)
  return cached
}
