/**
 * Supabase environment resolution.
 *
 * Supabase renamed the browser key from "anon" to "publishable". Both names
 * are accepted so an existing project keeps working after an upgrade.
 */

export interface SupabasePublicEnv {
  url: string
  key: string
}

function readPublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null
  return { url, key }
}

/** True when the app has enough configuration to talk to Supabase. */
export function isSupabaseConfigured(): boolean {
  return readPublicEnv() !== null
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const env = readPublicEnv()
  if (!env) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).'
    )
  }
  return env
}

/** Google sign-in appears only when the project has the provider switched on. */
export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true'
}
