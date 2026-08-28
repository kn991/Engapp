'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { updatePassword } from '@/server/actions/auth'
import { FormError } from './form-error'

interface Values {
  password: string
  confirm: string
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ defaultValues: { password: '', confirm: '' } })

  async function onSubmit(values: Values) {
    setFormError(null)
    const result = await updatePassword({ password: values.password })
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    router.replace('/home')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={formError} />
      <Field label="New password" htmlFor="password" error={errors.password?.message}>
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
      <Field label="Repeat password" htmlFor="confirm" error={errors.confirm?.message}>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirm)}
          {...register('confirm', {
            validate: (value) => value === watch('password') || 'Both passwords must match.',
          })}
        />
      </Field>
      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Save new password
      </Button>
    </form>
  )
}
