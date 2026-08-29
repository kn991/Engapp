import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const FIELD =
  'w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] ' +
  'px-3.5 py-3 text-base text-[var(--text)] placeholder:text-[var(--muted)] ' +
  'transition-colors duration-150 outline-none ' +
  'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25 ' +
  'disabled:opacity-60 aria-[invalid=true]:border-[var(--danger)]'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(FIELD, 'h-12', className)} {...props} />
  }
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(FIELD, 'min-h-24 resize-y', className)} {...props} />
  }
)

export interface FieldProps {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function Field({ label, htmlFor, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--text-soft)]">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-sm text-[var(--muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  )
}
