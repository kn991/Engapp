import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WordEditor } from '@/components/admin/word-editor'
import { createServerSupabase } from '@/lib/supabase/server'
import { WORD_SELECT, type WordRowWithDetails } from '@/server/mappers'

export const metadata: Metadata = {
  title: 'Edit word',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function EditCuratedWordPage({
  params,
}: {
  params: Promise<{ wordId: string }>
}) {
  const { wordId } = await params
  const supabase = await createServerSupabase()

  const { data } = await supabase.from('words').select(WORD_SELECT).eq('id', wordId).maybeSingle()
  if (!data) notFound()

  const word = data as WordRowWithDetails

  return (
    <div className="space-y-5">
      <Link href="/admin" className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
        Back to words
      </Link>
      <h1 className="font-display text-[1.5rem]">{word.lemma}</h1>
      <WordEditor
        initial={{
          id: word.id,
          lemma: word.lemma,
          partOfSpeech: word.part_of_speech,
          cefr: word.cefr,
          russian: word.russian,
          definition: word.definition ?? '',
          contextHint: word.context_hint ?? '',
          acceptedAnswers: word.accepted_answers.join('; '),
          tags: word.tags.join('; '),
          isArchived: word.is_archived,
          examples: (word.word_examples ?? [])
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((example) => ({
              sentence: example.sentence,
              clozeSentence: example.cloze_sentence ?? '',
            })),
          collocations: (word.word_collocations ?? [])
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((collocation) => ({
              collocation: collocation.collocation,
              pattern: collocation.pattern,
              meaningRu: collocation.meaning_ru ?? '',
            })),
        }}
      />
    </div>
  )
}
