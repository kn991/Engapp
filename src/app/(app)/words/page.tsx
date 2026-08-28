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
  searchParams: Promise<{ filter?: string; q?: string }>
}) {
  const user = await requireUser()
  const params = await searchParams
  const filter = normaliseFilter(params.filter)
  const search = (params.q ?? '').slice(0, 60)

  const { entries } = await loadWordList({ userId: user.id, filter, search })
  const empty = EMPTY_COPY[filter]

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
          <ul className="mt-4 divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            {entries.map((entry) => (
              <WordRow key={entry.word.id} word={entry.word} state={entry.state} />
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

function normaliseFilter(value: string | undefined): WordFilter {
  const allowed: WordFilter[] = ['all', 'active', 'activating', 'weak', 'new', 'custom']
  return allowed.includes(value as WordFilter) ? (value as WordFilter) : 'all'
}
