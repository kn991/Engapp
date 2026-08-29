import 'server-only'

import { redirect } from 'next/navigation'
import { createServerSupabase } from './server'

export interface SessionUser {
  id: string
  email: string | null
}

/**
 * The authenticated user for this request, verified against the auth server.
 * Never derive identity from a request body or a client-supplied id.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return { id: data.user.id, email: data.user.email ?? null }
}

/** Same as `getSessionUser` but sends anonymous visitors to the login page. */
export async function requireUser(redirectTo = '/login'): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect(redirectTo)
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!data?.is_admin) redirect('/home')
  return user
}
