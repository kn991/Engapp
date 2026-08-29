import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { getSupabasePublicEnv } from './env'

/**
 * Request-scoped Supabase client for Server Components, Server Actions and
 * Route Handlers. Every query runs as the signed-in user, so row level
 * security is what actually protects the data.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies()
  const { url, key } = getSupabasePublicEnv()

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components cannot set cookies. The proxy refreshes the
          // session instead, so this is safe to ignore.
        }
      },
    },
  })
}
