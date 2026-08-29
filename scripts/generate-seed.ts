/**
 * Turns `data/vocabulary.txt` into a repeatable SQL migration.
 *
 * The migration is idempotent: word ids are derived from the lemma, and every
 * insert uses `on conflict do nothing`, so running the migrations again on an
 * existing database changes nothing.
 *
 *   pnpm db:generate-seed
 */
import { writeFileSync } from 'node:fs'
import { loadVocabulary, sqlString, sqlTextArray, wordId } from './vocabulary'

const OUTPUT = 'supabase/migrations/20260101000600_seed_vocabulary.sql'

function main() {
  const entries = loadVocabulary()
  const lines: string[] = [
    '-- ---------------------------------------------------------------------------',
    '-- Curated starter vocabulary.',
    '--',
    '-- Generated from data/vocabulary.txt by `pnpm db:generate-seed`. Do not edit',
    '-- this file by hand: edit the source list and regenerate.',
    '-- ---------------------------------------------------------------------------',
    '',
    `-- ${entries.length} entries`,
    '',
  ]

  for (const entry of entries) {
    const id = wordId(entry)
    lines.push(
      `insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)`,
      `values (`,
      `  '${id}', ${sqlString(entry.lemma)}, '${entry.partOfSpeech}', '${entry.cefr}',`,
      `  ${sqlString(entry.russian)}, ${sqlString(entry.definition)}, ${sqlString(entry.contextHint)},`,
      `  ${sqlString(entry.lemma)}, ${sqlTextArray(entry.accepted)}, ${sqlTextArray(entry.tags)}, null`,
      `) on conflict (id) do nothing;`
    )

    entry.examples.forEach((example, index) => {
      lines.push(
        `insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (`,
        `  '${deterministicChild(id, 'example', index)}', '${id}', ${sqlString(example.sentence)}, ${sqlString(example.cloze)}, ${index}`,
        `) on conflict (id) do nothing;`
      )
    })

    entry.collocations.forEach((collocation, index) => {
      lines.push(
        `insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (`,
        `  '${deterministicChild(id, 'collocation', index)}', '${id}', ${sqlString(collocation.collocation)}, ${sqlString(collocation.pattern)}, ${sqlString(collocation.meaningRu)}, ${index}`,
        `) on conflict (id) do nothing;`
      )
    })

    entry.family.forEach((member, index) => {
      lines.push(
        `insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (`,
        `  '${deterministicChild(id, 'family', index)}', '${id}', ${sqlString(member.form)}, '${member.partOfSpeech}', ${sqlString(member.gloss)}, ${index}`,
        `) on conflict (id) do nothing;`
      )
    })

    lines.push('')
  }

  writeFileSync(OUTPUT, `${lines.join('\n')}\n`, 'utf8')
  console.log(`Wrote ${OUTPUT} with ${entries.length} entries.`)
}

function deterministicChild(parentId: string, kind: string, index: number): string {
  // Reuse the parent's uuid and vary the tail deterministically.
  const suffix = (kindCode(kind) * 1000 + index).toString(16).padStart(6, '0')
  return `${parentId.slice(0, 24)}${suffix.slice(0, 6)}${parentId.slice(30)}`
}

function kindCode(kind: string): number {
  switch (kind) {
    case 'example':
      return 1
    case 'collocation':
      return 2
    default:
      return 3
  }
}

main()
