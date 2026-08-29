'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '@/components/auth/form-error'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/input'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'
import { createCustomWord } from '@/server/actions/words'

interface Values {
  lemma: string
  partOfSpeech: string
  cefr: string
  russian: string
  definition: string
  contextHint: string
  example: string
  acceptedAnswers: string
  tags: string
}

const SELECT =
  'h-12 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25'

export function AddWordForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    defaultValues: {
      lemma: '',
      partOfSpeech: 'verb',
      cefr: 'B1',
      russian: '',
      definition: '',
      contextHint: '',
      example: '',
      acceptedAnswers: '',
      tags: '',
    },
  })

  async function onSubmit(values: Values) {
    setFormError(null)
    const result = await createCustomWord({
      lemma: values.lemma,
      partOfSpeech: values.partOfSpeech,
      cefr: values.cefr,
      russian: values.russian,
      definition: values.definition || undefined,
      contextHint: values.contextHint || undefined,
      example: values.example || undefined,
      acceptedAnswers: splitList(values.acceptedAnswers),
      tags: splitList(values.tags),
    })

    if (!result.ok) {
      setFormError(result.error)
      return
    }
    router.push(`/words/${result.data.wordId}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={formError} />

      <Field label="English word or phrase" htmlFor="lemma" error={errors.lemma?.message}>
        <Input
          id="lemma"
          lang="en"
          autoCapitalize="none"
          autoCorrect="off"
          {...register('lemma', { required: 'Enter the English word.' })}
        />
      </Field>

      <Field label="Russian meaning" htmlFor="russian" error={errors.russian?.message}>
        <Input id="russian" lang="ru" {...register('russian', { required: 'Enter the meaning.' })} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Part of speech" htmlFor="partOfSpeech">
          <select id="partOfSpeech" className={SELECT} {...register('partOfSpeech')}>
            {PARTS_OF_SPEECH.map((value) => (
              <option key={value} value={value}>
                {value.replace('_', ' ')}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Level" htmlFor="cefr">
          <select id="cefr" className={SELECT} {...register('cefr')}>
            {CEFR_LEVELS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="English definition" htmlFor="definition" hint="Used once the word gets strong.">
        <Textarea id="definition" lang="en" rows={2} {...register('definition')} />
      </Field>

      <Field
        label="Example sentence"
        htmlFor="example"
        hint="Include the word itself; we turn it into a gap-fill."
      >
        <Textarea id="example" lang="en" rows={2} {...register('example')} />
      </Field>

      <Field
        label="Also accept"
        htmlFor="acceptedAnswers"
        hint="Other correct answers, separated by semicolons."
      >
        <Input id="acceptedAnswers" lang="en" {...register('acceptedAnswers')} />
      </Field>

      <Field label="Tags" htmlFor="tags" hint="Separated by semicolons.">
        <Input id="tags" {...register('tags')} />
      </Field>

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Add word
      </Button>
    </form>
  )
}

function splitList(value: string): string[] {
  return value
    .split(/[;|,]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, 12)
}
