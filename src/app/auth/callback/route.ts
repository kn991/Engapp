import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'

/** OAuth return path. Exchanges the PKCE code for a session cookie. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (!code) return NextResponse.redirect(`${origin}/login?error=invalid_link`)

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    logError('auth.callback', error)
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  const { data } = await supabase.from('profiles').select('onboarded_at').maybeSingle()
  const target = next !== '/home' ? next : data?.onboarded_at ? '/home' : '/onboarding'
  return NextResponse.redirect(`${origin}${target}`)
}

function safeNext(value: string | null): string {
  if (!value) return '/home'
  if (!value.startsWith('/') || value.startsWith('//')) return '/home'
  return value
}
