import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthFormShell } from '@/components/auth/auth-form-shell'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell
      title="Reset your password"
      subtitle="We will email you a link to set a new one."
      footer={
        <Link href="/login" className="text-[var(--accent)] underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  )
}
