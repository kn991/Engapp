'use client'

import { forwardRef } from 'react'
import { MicIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { cn } from '@/lib/utils'

export interface AnswerInputProps {
  value: string
  onChange: (value: string) => void
  /** In review mode the field keeps focus so the keyboard never closes. */
  review: boolean
  placeholder?: string
  onMicClick?: () => void
  listening?: boolean
  micSupported?: boolean
  invalid?: boolean
}

/**
 * The single most used control in the app.
 *
 * It stays mounted for the whole session so the on-screen keyboard never
 * closes between questions, and it disables the corrections that would
 * otherwise answer the question for the learner.
 */
export const AnswerInput = forwardRef<HTMLInputElement, AnswerInputProps>(function AnswerInput(
  { value, onChange, review, placeholder, onMicClick, listening, micSupported, invalid },
  ref
) {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        inputMode="text"
        lang="en"
        enterKeyHint="go"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        data-1p-ignore
        aria-label="Your answer in English"
        aria-invalid={invalid || undefined}
        aria-readonly={review || undefined}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          // Edits are ignored while the answer is being reviewed, but the
          // field stays a real input so the on-screen keyboard stays up.
          if (!review) onChange(event.target.value)
        }}
        className={cn(
          'h-14 w-full rounded-[var(--radius-md)] border bg-[var(--surface)] text-center',
          'text-[1.25rem] tracking-[0.01em] outline-none transition-colors duration-150',
          micSupported ? 'pr-12 pl-12' : 'px-4',
          review
            ? 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] focus:ring-0'
            : 'border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25'
        )}
      />
      {micSupported && (
        <IconButton
          label={listening ? 'Stop listening' : 'Answer by voice'}
          onClick={onMicClick}
          disabled={review}
          tone={listening ? 'accent' : 'default'}
          className="absolute top-1.5 right-1.5"
        >
          <MicIcon size={20} />
        </IconButton>
      )}
    </div>
  )
})
