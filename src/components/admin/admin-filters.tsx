'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'

const FIELD =
  'h-11 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 outline-none focus:border-[var(--accent)]'

export function AdminFilters({
  q,
  cefr,
  pos,
  archived,
}: {
  q: string
  cefr: string
  pos: string
  archived: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(q)
  const [appliedQuery, setAppliedQuery] = useState(q)
  const timer = useRef<number | null>(null)

  // Re-sync when navigation changes the query string, without an effect.
  if (appliedQuery !== q) {
    setAppliedQuery(q)
    setSearch(q)
  }

  function push(next: Record<string, string>) {
    const params = new URLSearchParams({ q, cefr, pos, archived, ...next })
    for (const [key, value] of [...params.entries()]) {
      if (!value) params.delete(key)
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="search"
        value={search}
        placeholder="Search lemma or Russian"
        aria-label="Search words"
        className={`${FIELD} min-w-[12rem] flex-1`}
        onChange={(event) => {
          const value = event.target.value
          setSearch(value)
          if (timer.current) window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => push({ q: value }), 300)
        }}
      />
      <select
        className={FIELD}
        value={cefr}
        aria-label="Filter by level"
        onChange={(event) => push({ cefr: event.target.value })}
      >
        <option value="">All levels</option>
        {CEFR_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
      <select
        className={FIELD}
        value={pos}
        aria-label="Filter by part of speech"
        onChange={(event) => push({ pos: event.target.value })}
      >
        <option value="">All types</option>
        {PARTS_OF_SPEECH.map((value) => (
          <option key={value} value={value}>
            {value.replace('_', ' ')}
          </option>
        ))}
      </select>
      <select
        className={FIELD}
        value={archived}
        aria-label="Filter by archive state"
        onChange={(event) => push({ archived: event.target.value })}
      >
        <option value="false">Active</option>
        <option value="true">Archived</option>
        <option value="all">All</option>
      </select>
    </div>
  )
}
