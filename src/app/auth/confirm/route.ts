import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'

/**
 * Handles the link in confirmation and password reset emails.
 *
 * `next` is validated as a same-origin path so the link cannot be turned into
 * an open redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNext(searchParams.get('next'))

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`)
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error) {
    logError('auth.confirm', error, { type })
    return NextResponse.redirect(`${origin}/login?error=expired_link`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}

function safeNext(value: string | null): string {
  if (!value) return '/home'
  if (!value.startsWith('/') || value.startsWith('//')) return '/home'
  return value
}
