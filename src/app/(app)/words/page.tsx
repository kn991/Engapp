import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header'
import { WordFilters } from '@/components/words/word-filters'
import { WordRow } from '@/components/words/word-row'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/link-button'
import { PlusIcon } from '@/components/icons'
import { requireUser } from '@/lib/supabase/auth'
import { loadWordList, type WordFilter } from '@/server/queries/words'

export const metadata: Metadata = {
  title: 'Words',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const EMPTY_COPY: Record<WordFilter, { title: string; description: string }> = {
  all: {
    title: 'No words yet',
    description: 'Finish the setup test and your first set appears here.',
  },
  active: {
    title: 'Nothing active yet',
    description: 'A word becomes active after several fast, unaided recalls on different days.',
  },
  activating: {
    title: 'Nothing in progress',
    description: 'Words move here once they start coming back on their own.',
  },
  weak: { title: 'No weak words', description: 'Nothing is struggling right now.' },
  new: { title: 'No new words waiting', description: 'Everything in your set has been started.' },
  custom: {
    title: 'No words of your own',
    description: 'Add words you understand but never seem to use.',
  },
}

export default async function WordsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string; page?: string }>
}) {
  const user = await requireUser()
  const params = await searchParams
  const filter = normaliseFilter(params.filter)
  const search = (params.q ?? '').slice(0, 60)
  const page = normalisePage(params.page)

  const { entries, hasMore } = await loadWordList({ userId: user.id, filter, search, page })
  const empty = EMPTY_COPY[filter]

  const pageHref = (target: number) => {
    const next = new URLSearchParams()
    if (filter !== 'all') next.set('filter', filter)
    if (search) next.set('q', search)
    if (target > 0) next.set('page', String(target + 1))
    const query = next.toString()
    return query ? `/words?${query}` : '/words'
  }

  return (
    <>
      <AppHeader
        title="Words"
        subtitle="Everything you are training."
        action={
          <LinkButton href="/words/new" size="sm" variant="secondary" aria-label="Add a word">
            <PlusIcon size={18} />
            Add
          </LinkButton>
        }
      />

      <div className="px-5">
        <WordFilters filter={filter} search={search} />

        {entries.length === 0 ? (
          <EmptyState
            className="mt-6"
            title={search ? 'Nothing matches that' : empty.title}
            description={search ? 'Try a different word or clear the search.' : empty.description}
          />
        ) : (
          <>
            <ul
              aria-label="Your words"
              className="mt-4 divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"
            >
              {entries.map((entry) => (
                <WordRow key={entry.word.id} word={entry.word} state={entry.state} />
              ))}
            </ul>

            {(page > 0 || hasMore) && (
              <nav aria-label="Pages" className="mt-4 flex items-center justify-between gap-3">
                {page > 0 ? (
                  <LinkButton href={pageHref(page - 1)} variant="secondary" size="sm">
                    Previous
                  </LinkButton>
                ) : (
                  <span />
                )}
                <span className="tabular text-sm text-[var(--muted)]">Page {page + 1}</span>
                {hasMore ? (
                  <LinkButton href={pageHref(page + 1)} variant="secondary" size="sm">
                    Next
                  </LinkButton>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </>
  )
}

/** Pages are 1-based in the URL and 0-based in the query. */
function normalisePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '1', 10)
  if (!Number.isFinite(parsed) || parsed < 1) return 0
  return Math.min(parsed - 1, 200)
}

function normaliseFilter(value: string | undefined): WordFilter {
  const allowed: WordFilter[] = ['all', 'active', 'activating', 'weak', 'new', 'custom']
  return allowed.includes(value as WordFilter) ? (value as WordFilter) : 'all'
}
