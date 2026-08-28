import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthFormShell } from '@/components/auth/auth-form-shell'
import { LoginForm } from '@/components/auth/login-form'
import { GoogleButton } from '@/components/auth/google-button'
import { FormError } from '@/components/auth/form-error'
import { isGoogleAuthEnabled } from '@/lib/supabase/env'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

const LINK_ERRORS: Record<string, string> = {
  invalid_link: 'That link is not valid. Request a new one.',
  expired_link: 'That link has expired. Request a new one.',
  oauth_failed: 'Google sign-in did not complete. Try again.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const next = params.next?.startsWith('/') ? params.next : undefined
  const error = params.error ? LINK_ERRORS[params.error] : undefined

  return (
    <AuthFormShell
      title="Welcome back"
      subtitle="Pick up where you left off."
      footer={
        <p>
          No account yet?{' '}
          <Link href="/signup" className="text-[var(--accent)] underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {error && <FormError message={error} />}
        <LoginForm next={next} />
        {isGoogleAuthEnabled() && (
          <>
            <Divider />
            <GoogleButton next={next ?? '/home'} />
          </>
        )}
      </div>
    </AuthFormShell>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-xs tracking-[0.1em] text-[var(--muted)] uppercase">or</span>
      <span className="h-px flex-1 bg-[var(--border)]" />
    </div>
  )
}
