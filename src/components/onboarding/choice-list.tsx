'use client'

import { CheckIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

export interface Choice<T extends string | number> {
  value: T
  label: string
  hint?: string
}

export function ChoiceList<T extends string | number>({
  name,
  choices,
  value,
  onChange,
  multiple,
}: {
  name: string
  choices: readonly Choice<T>[]
  value: T[] | T | null
  onChange: (value: T) => void
  multiple?: boolean
}) {
  const selected = Array.isArray(value) ? value : value === null ? [] : [value]

  return (
    <div role={multiple ? 'group' : 'radiogroup'} aria-label={name} className="space-y-2.5">
      {choices.map((choice) => {
        const active = selected.includes(choice.value)
        return (
          <button
            key={String(choice.value)}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            onClick={() => onChange(choice.value)}
            className={cn(
              'flex min-h-[3.25rem] w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 text-left',
              'transition-colors duration-150 active:scale-[0.99]',
              active
                ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                : 'border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[1.0625rem] font-medium">{choice.label}</span>
              {choice.hint && (
                <span className="mt-0.5 block text-sm text-[var(--muted)]">{choice.hint}</span>
              )}
            </span>
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                active
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]'
                  : 'border-[var(--border-strong)]'
              )}
            >
              {active && <CheckIcon size={14} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
