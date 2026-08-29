'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { signUp } from '@/server/actions/auth'
import { FormError, FormSuccess } from './form-error'

interface Values {
  displayName: string
  email: string
  password: string
}

export function SignupForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { displayName: '', email: '', password: '' } })

  async function onSubmit(values: Values) {
    setFormError(null)
    const result = await signUp({
      email: values.email,
      password: values.password,
      displayName: values.displayName || undefined,
    })

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    if (result.data.needsConfirmation) {
      setConfirmSent(
        `We sent a confirmation link to ${values.email}. Open it to finish setting up your account.`
      )
      return
    }

    router.replace('/onboarding')
    router.refresh()
  }

  if (confirmSent) {
    return <FormSuccess message={confirmSent} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={formError} />
      <Field label="Name" htmlFor="displayName" hint="Only used to greet you.">
        <Input
          id="displayName"
          autoComplete="given-name"
          {...register('displayName', { maxLength: 60 })}
        />
      </Field>
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
      <Field
        label="Password"
        htmlFor="password"
        hint="At least 8 characters."
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password', {
            required: 'Choose a password.',
            minLength: { value: 8, message: 'Use at least 8 characters.' },
          })}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Create account
      </Button>
      <p className="text-xs leading-relaxed text-[var(--muted)]">
        By creating an account you agree to our{' '}
        <a href="/terms" className="underline underline-offset-2">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
