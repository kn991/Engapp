import { type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'
import { redirectTo, safeNextPath } from '@/lib/redirects'

/**
 * Handles the link in confirmation and password reset emails.
 *
 * Two shapes arrive here, and both are supported so the app works with
 * Supabase's default email templates and with the newer token-hash ones:
 *
 *   ?code=...                  the project verified the token and handed back
 *                              a PKCE code to exchange for a session
 *   ?token_hash=...&type=...   the template links straight here
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNextPath(searchParams.get('next'))

  const supabase = await createServerSupabase()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      logError('auth.confirm.code', error)
      return redirectTo('/login?error=expired_link')
    }
    return redirectTo(next)
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) {
      logError('auth.confirm.otp', error, { type })
      return redirectTo('/login?error=expired_link')
    }
    return redirectTo(next)
  }

  return redirectTo('/login?error=invalid_link')
}
