import type { Metadata } from 'next'
import Link from 'next/link'
import { WordEditor } from '@/components/admin/word-editor'

export const metadata: Metadata = {
  title: 'New word',
  robots: { index: false, follow: false },
}

export default function NewCuratedWordPage() {
  return (
    <div className="space-y-5">
      <Link href="/admin" className="text-sm text-[var(--muted)] underline-offset-4 hover:underline">
        Back to words
      </Link>
      <h1 className="font-display text-[1.5rem]">New curated word</h1>
      <WordEditor
        initial={{
          lemma: '',
          partOfSpeech: 'verb',
          cefr: 'B1',
          russian: '',
          definition: '',
          contextHint: '',
          acceptedAnswers: '',
          tags: '',
          isArchived: false,
          examples: [{ sentence: '', clozeSentence: '' }],
          collocations: [],
        }}
      />
    </div>
  )
}
