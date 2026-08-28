'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { SearchIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import type { WordFilter } from '@/server/queries/words'

const FILTERS: Array<{ value: WordFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'activating', label: 'Activating' },
  { value: 'weak', label: 'Weak' },
  { value: 'new', label: 'New' },
  { value: 'custom', label: 'Yours' },
]

/** Search waits for a pause in typing rather than firing on every keystroke. */
const DEBOUNCE_MS = 300

export function WordFilters({
  filter,
  search,
}: {
  filter: WordFilter
  search: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [value, setValue] = useState(search)
  const [appliedSearch, setAppliedSearch] = useState(search)
  const timer = useRef<number | null>(null)

  // Re-sync when navigation changes the query string, without an effect.
  if (appliedSearch !== search) {
    setAppliedSearch(search)
    setValue(search)
  }

  function push(next: { filter?: WordFilter; q?: string }) {
    const searchParams = new URLSearchParams(params.toString())
    if (next.filter !== undefined) {
      if (next.filter === 'all') searchParams.delete('filter')
      else searchParams.set('filter', next.filter)
    }
    if (next.q !== undefined) {
      if (next.q.trim().length === 0) searchParams.delete('q')
      else searchParams.set('q', next.q.trim())
    }
    const query = searchParams.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function onSearchChange(next: string) {
    setValue(next)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => push({ q: next }), DEBOUNCE_MS)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon
          size={18}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--muted)]"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search English, Russian or a tag"
          aria-label="Search your words"
          className="h-12 w-full rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] pr-4 pl-11 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
        />
      </div>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => push({ filter: entry.value })}
            aria-pressed={filter === entry.value}
            className={cn(
              'h-9 shrink-0 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150',
              filter === entry.value
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-soft)]'
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  )
}
