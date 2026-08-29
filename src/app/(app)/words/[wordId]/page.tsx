import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { SectionTitle } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { LatencyChart } from '@/components/words/latency-chart'
import { WordStatusChip } from '@/components/words/word-status-chip'
import { SpeakButton } from '@/components/words/speak-button'
import { DeleteCustomWord } from '@/components/words/delete-custom-word'
import {
  formatDayLabel,
  formatLatency,
  formatNextReview,
  STATUS_DESCRIPTIONS,
} from '@/domain/learning'
import { requireUser } from '@/lib/supabase/auth'
import { loadWordDetail } from '@/server/queries/words'

export const metadata: Metadata = {
  title: 'Word',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ wordId: string }>
}) {
  const { wordId } = await params
  const user = await requireUser()
  const detail = await loadWordDetail(user.id, wordId)
  if (!detail) notFound()

  const { word, state, history } = detail

  return (
    <>
      <AppHeader title={word.lemma} back="/words" action={<SpeakButton text={word.lemma} />} />

      <div className="space-y-7 px-5 pb-6">
        <section className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <WordStatusChip status={state.status} />
            <span className="text-xs tracking-[0.08em] text-[var(--muted)] uppercase">
              {word.partOfSpeech.replace('_', ' ')} · {word.cefr}
            </span>
          </div>
          {word.definition && (
            <p lang="en" className="text-[1.0625rem] leading-relaxed">
              {word.definition}
            </p>
          )}
          <p lang="ru" className="text-[var(--muted)]">
            {word.russian}
          </p>
          <p className="text-sm text-[var(--muted)]">{STATUS_DESCRIPTIONS[state.status]}</p>
        </section>

        <section className="grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <Stat label="Recent recall" value={formatLatency(state.recentLatencyMs)} />
          <Stat label="Mastery" value={`${state.mastery}%`} tone="accent" />
          <Stat label="Next review" value={formatNextReview(state.nextReviewAt)} />
        </section>

        <section>
          <SectionTitle>Recall history</SectionTitle>
          <div className="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
            <LatencyChart points={history} />
            {history.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-3">
                {history.slice(-6).map((entry, index) => (
                  <li key={`${entry.day}-${index}`} className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">{formatDayLabel(entry.day)}</span>
                    <span className="tabular">
                      {entry.wasCorrect ? formatLatency(entry.latencyMs) : 'Missed'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {word.examples.length > 0 && (
          <section>
            <SectionTitle>Examples</SectionTitle>
            <ul className="mt-3 space-y-2">
              {word.examples.map((example) => (
                <li key={example.sentence} lang="en" className="text-[1.0625rem] leading-relaxed">
                  {example.sentence}
                </li>
              ))}
            </ul>
          </section>
        )}

        {word.collocations.length > 0 && (
          <section>
            <SectionTitle>Collocations</SectionTitle>
            <ul className="mt-3 space-y-1.5">
              {word.collocations.map((collocation) => (
                <li key={collocation.collocation} className="flex justify-between gap-4 text-[0.9375rem]">
                  <span lang="en">{collocation.collocation}</span>
                  {collocation.meaningRu && (
                    <span lang="ru" className="text-right text-[var(--muted)]">
                      {collocation.meaningRu}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {word.family.length > 0 && (
          <section>
            <SectionTitle>Word family</SectionTitle>
            <ul className="mt-3 space-y-1.5">
              {word.family.map((member) => (
                <li key={member.form} className="flex justify-between gap-4 text-[0.9375rem]">
                  <span lang="en">{member.form}</span>
                  <span className="text-right text-[var(--muted)]">
                    {member.gloss ?? member.partOfSpeech.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="grid grid-cols-3 gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <Stat label="Reviews" value={state.reviewCount} />
          <Stat label="Fast recalls" value={state.fastRecalls} />
          <Stat label="Lapses" value={state.lapses} />
        </section>

        {word.isCustom && <DeleteCustomWord wordId={word.id} lemma={word.lemma} />}
      </div>
    </>
  )
}
