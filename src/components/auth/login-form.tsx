'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { signIn } from '@/server/actions/auth'
import { FormError } from './form-error'

interface Values {
  email: string
  password: string
}

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { email: '', password: '' } })

  async function onSubmit(values: Values) {
    setFormError(null)
    const result = await signIn(values)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    router.replace(next && next.startsWith('/') ? next : result.data.next)
    router.refresh()
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
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password', { required: 'Enter your password.' })}
        />
      </Field>
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  )
}
