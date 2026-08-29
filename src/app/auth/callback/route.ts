import { type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'
import { redirectTo, safeNextPath } from '@/lib/redirects'

/** OAuth return path. Exchanges the PKCE code for a session cookie. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = safeNextPath(request.nextUrl.searchParams.get('next'))

  if (!code) return redirectTo('/login?error=invalid_link')

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    logError('auth.callback', error)
    return redirectTo('/login?error=oauth_failed')
  }

  const { data } = await supabase.from('profiles').select('onboarded_at').maybeSingle()
  if (next !== '/home') return redirectTo(next)
  return redirectTo(data?.onboarded_at ? '/home' : '/onboarding')
}
