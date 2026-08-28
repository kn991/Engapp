import type { Metadata } from 'next'
import { AppHeader } from '@/components/app-header'
import { AddWordForm } from '@/components/words/add-word-form'
import { ImportWords } from '@/components/words/import-words'
import { SectionTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Add a word',
  robots: { index: false, follow: false },
}

export default function NewWordPage() {
  return (
    <>
      <AppHeader
        title="Add a word"
        subtitle="Words you understand but never seem to use."
        back="/words"
      />
      <div className="space-y-8 px-5 pb-8">
        <AddWordForm />
        <section>
          <SectionTitle>Bulk import</SectionTitle>
          <p className="mt-2 mb-3 text-sm text-[var(--muted)]">
            A CSV with the columns lemma, part_of_speech, cefr and russian. Everything else is
            optional.
          </p>
          <ImportWords />
        </section>
      </div>
    </>
  )
}
