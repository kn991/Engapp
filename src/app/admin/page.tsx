import type { Metadata } from 'next'
import Link from 'next/link'
import { AdminFilters } from '@/components/admin/admin-filters'
import { ArchiveToggle } from '@/components/admin/archive-toggle'
import { Badge } from '@/components/ui/badge'
import { LinkButton } from '@/components/ui/link-button'
import { EmptyState } from '@/components/ui/empty-state'
import { CEFR_LEVELS, PARTS_OF_SPEECH } from '@/domain/learning'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Curated vocabulary',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

export default async function AdminWordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cefr?: string; pos?: string; tag?: string; archived?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerSupabase()

  let query = supabase
    .from('words')
    .select('id, lemma, russian, cefr, part_of_speech, tags, is_archived')
    .is('created_by', null)

  const term = (params.q ?? '').trim().replace(/[%,()]/g, ' ').trim()
  if (term) query = query.or(`lemma.ilike.%${term}%,russian.ilike.%${term}%`)
  if (params.cefr && CEFR_LEVELS.includes(params.cefr as (typeof CEFR_LEVELS)[number])) {
    query = query.eq('cefr', params.cefr as (typeof CEFR_LEVELS)[number])
  }
  if (params.pos && PARTS_OF_SPEECH.includes(params.pos as (typeof PARTS_OF_SPEECH)[number])) {
    query = query.eq('part_of_speech', params.pos as (typeof PARTS_OF_SPEECH)[number])
  }
  if (params.tag) query = query.contains('tags', [params.tag])
  if (params.archived !== 'all') query = query.eq('is_archived', params.archived === 'true')

  const { data: words } = await query.order('lemma').limit(PAGE_SIZE)

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[1.5rem]">Curated vocabulary</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Shared with every learner. Showing up to {PAGE_SIZE} matches.
          </p>
        </div>
        <LinkButton href="/admin/words/new" size="sm">
          New word
        </LinkButton>
      </div>

      <AdminFilters
        q={params.q ?? ''}
        cefr={params.cefr ?? ''}
        pos={params.pos ?? ''}
        archived={params.archived ?? 'false'}
      />

      {!words || words.length === 0 ? (
        <EmptyState title="Nothing matches" description="Adjust the filters or add a new word." />
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          {words.map((word) => (
            <li key={word.id} className="flex items-center gap-3 px-4 py-3">
              <Link href={`/admin/words/${word.id}`} className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-[1.0625rem]" lang="en">
                    {word.lemma}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {word.part_of_speech.replace('_', ' ')} · {word.cefr}
                  </span>
                  {word.is_archived && <Badge tone="warning">Archived</Badge>}
                </div>
                <p lang="ru" className="mt-0.5 truncate text-sm text-[var(--muted)]">
                  {word.russian}
                </p>
              </Link>
              <ArchiveToggle wordId={word.id} archived={word.is_archived} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
