import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthFormShell } from '@/components/auth/auth-form-shell'
import { SignupForm } from '@/components/auth/signup-form'
import { GoogleButton } from '@/components/auth/google-button'
import { isGoogleAuthEnabled } from '@/lib/supabase/env'

export const metadata: Metadata = {
  title: 'Create your account',
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return (
    <AuthFormShell
      title="Start training recall"
      subtitle="Two minutes of setup, then your first session."
      footer={
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent)] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <SignupForm />
        {isGoogleAuthEnabled() && (
          <>
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs tracking-[0.1em] text-[var(--muted)] uppercase">or</span>
              <span className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <GoogleButton next="/onboarding" />
          </>
        )}
      </div>
    </AuthFormShell>
  )
}
