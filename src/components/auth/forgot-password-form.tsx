'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { requestPasswordReset } from '@/server/actions/auth'
import { FormError, FormSuccess } from './form-error'

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({ defaultValues: { email: '' } })

  async function onSubmit(values: { email: string }) {
    setFormError(null)
    const result = await requestPasswordReset(values)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <FormSuccess message="If that address has an account, a reset link is on its way. The link expires in one hour." />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={formError} />
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          aria-invalid={Boolean(errors.email)}
          {...register('email', { required: 'Enter your email address.' })}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Send reset link
      </Button>
    </form>
  )
}
