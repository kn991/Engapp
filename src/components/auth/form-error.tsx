export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-3.5 py-2.5 text-sm text-[var(--danger)]"
    >
      {message}
    </p>
  )
}

export function FormSuccess({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="status"
      className="rounded-[var(--radius-md)] border border-[var(--success)] bg-[var(--success-soft)] px-3.5 py-2.5 text-sm text-[var(--success)]"
    >
      {message}
    </p>
  )
}
