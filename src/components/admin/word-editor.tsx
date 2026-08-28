'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { FormError } from '@/components/auth/form-error'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/card'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'
import { saveCuratedWord } from '@/server/actions/admin'

export interface WordEditorValues {
  id?: string
  lemma: string
  partOfSpeech: string
  cefr: string
  russian: string
  definition: string
  contextHint: string
  acceptedAnswers: string
  tags: string
  isArchived: boolean
  examples: Array<{ sentence: string; clozeSentence: string }>
  collocations: Array<{ collocation: string; pattern: string; meaningRu: string }>
}

const SELECT =
  'h-12 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 outline-none focus:border-[var(--accent)]'

export function WordEditor({ initial }: { initial: WordEditorValues }) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WordEditorValues>({ defaultValues: initial })

  const examples = useFieldArray({ control, name: 'examples' })
  const collocations = useFieldArray({ control, name: 'collocations' })

  async function onSubmit(values: WordEditorValues) {
    setFormError(null)
    const result = await saveCuratedWord({
      // A new word has no id; the hidden field submits an empty string.
      id: values.id || undefined,
      lemma: values.lemma,
      partOfSpeech: values.partOfSpeech,
      cefr: values.cefr,
      russian: values.russian,
      definition: values.definition || undefined,
      contextHint: values.contextHint || undefined,
      acceptedAnswers: splitList(values.acceptedAnswers),
      tags: splitList(values.tags),
      isArchived: values.isArchived,
      examples: values.examples
        .filter((example) => example.sentence.trim().length > 0)
        .map((example) => ({
          sentence: example.sentence,
          clozeSentence: example.clozeSentence.trim() || null,
        })),
      collocations: values.collocations
        .filter((entry) => entry.collocation.trim().length > 0 && entry.pattern.includes('___'))
        .map((entry) => ({
          collocation: entry.collocation,
          pattern: entry.pattern,
          meaningRu: entry.meaningRu.trim() || null,
        })),
    })

    if (!result.ok) {
      setFormError(result.error)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={formError} />
      <input type="hidden" {...register('id')} />

      <Field label="Lemma" htmlFor="lemma" error={errors.lemma?.message}>
        <Input id="lemma" lang="en" {...register('lemma', { required: 'Required.' })} />
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
        <Field label="CEFR" htmlFor="cefr">
          <select id="cefr" className={SELECT} {...register('cefr')}>
            {CEFR_LEVELS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Russian" htmlFor="russian" error={errors.russian?.message}>
        <Input id="russian" lang="ru" {...register('russian', { required: 'Required.' })} />
      </Field>

      <Field label="English definition" htmlFor="definition">
        <Textarea id="definition" lang="en" rows={2} {...register('definition')} />
      </Field>

      <Field
        label="Situation cue"
        htmlFor="contextHint"
        hint="An English situation that points at the word without translating it."
      >
        <Textarea id="contextHint" lang="en" rows={2} {...register('contextHint')} />
      </Field>

      <Field label="Accepted answers" htmlFor="acceptedAnswers" hint="Separated by semicolons.">
        <Input id="acceptedAnswers" lang="en" {...register('acceptedAnswers')} />
      </Field>

      <Field label="Tags" htmlFor="tags" hint="Separated by semicolons.">
        <Input id="tags" {...register('tags')} />
      </Field>

      <section className="space-y-3">
        <SectionTitle>Examples</SectionTitle>
        {examples.fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
            <Input
              lang="en"
              placeholder="Sentence containing the word"
              aria-label={`Example ${index + 1} sentence`}
              {...register(`examples.${index}.sentence` as const)}
            />
            <Input
              lang="en"
              placeholder="Same sentence with ___ (optional, generated if blank)"
              aria-label={`Example ${index + 1} gap-fill`}
              {...register(`examples.${index}.clozeSentence` as const)}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => examples.remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => examples.append({ sentence: '', clozeSentence: '' })}
        >
          Add example
        </Button>
      </section>

      <section className="space-y-3">
        <SectionTitle>Collocations</SectionTitle>
        {collocations.fields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
            <Input
              lang="en"
              placeholder="make a decision"
              aria-label={`Collocation ${index + 1}`}
              {...register(`collocations.${index}.collocation` as const)}
            />
            <Input
              lang="en"
              placeholder="___ a decision"
              aria-label={`Collocation ${index + 1} pattern`}
              {...register(`collocations.${index}.pattern` as const)}
            />
            <Input
              lang="ru"
              placeholder="принять решение"
              aria-label={`Collocation ${index + 1} meaning`}
              {...register(`collocations.${index}.meaningRu` as const)}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => collocations.remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => collocations.append({ collocation: '', pattern: '', meaningRu: '' })}
        >
          Add collocation
        </Button>
      </section>

      <label className="flex items-center gap-3 py-2">
        <input type="checkbox" className="h-5 w-5" {...register('isArchived')} />
        <span>Archived (hidden from learners)</span>
      </label>

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Save word
      </Button>
    </form>
  )
}

function splitList(value: string): string[] {
  return value
    .split(/[;|]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, 12)
}
