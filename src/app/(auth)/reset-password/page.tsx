import type { Metadata } from 'next'
import { AuthFormShell } from '@/components/auth/auth-form-shell'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Choose a new password',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <AuthFormShell
      title="Choose a new password"
      subtitle="You are signed in through the reset link. Set a password to finish."
    >
      <ResetPasswordForm />
    </AuthFormShell>
  )
}
