import { describe, expect, it } from 'vitest'
import {
  buildSessionItem,
  chooseExerciseType,
  collocationAnswer,
  supportedExerciseTypes,
} from '@/domain/learning/exercise'
import { initialWordState } from '@/domain/learning/grade'
import { createRandom } from '@/domain/learning/random'
import type { UserWordState, Word } from '@/domain/learning/types'

const full: Word = {
  id: 'w1',
  lemma: 'decide',
  partOfSpeech: 'verb',
  cefr: 'B1',
  russian: 'решать',
  definition: 'to choose after thinking',
  contextHint: 'You finally choose after thinking about it.',
  primaryAnswer: 'decide',
  acceptedAnswers: [],
  tags: ['work'],
  examples: [
    { sentence: 'We decide tomorrow.', clozeSentence: 'We ___ tomorrow.', translation: null },
  ],
  collocations: [
    { collocation: 'make a decision', pattern: '___ a decision', meaningRu: 'принять решение' },
  ],
  family: [{ form: 'decision', partOfSpeech: 'noun', gloss: 'решение' }],
  isCustom: false,
}

const bare: Word = {
  ...full,
  id: 'w2',
  definition: null,
  contextHint: null,
  examples: [],
  collocations: [],
  family: [],
}

function state(overrides: Partial<UserWordState> = {}): UserWordState {
  return { ...initialWordState('w1'), ...overrides }
}

describe('supportedExerciseTypes', () => {
  it('offers every format a complete entry can support', () => {
    expect(supportedExerciseTypes(full)).toEqual(
      expect.arrayContaining([
        'translation_recall',
        'context_recall',
        'definition_recall',
        'cloze',
        'collocation',
        'word_family',
      ])
    )
  })

  it('falls back to the Russian cue for a sparse entry', () => {
    expect(supportedExerciseTypes(bare)).toEqual(['translation_recall'])
  })
})

describe('chooseExerciseType', () => {
  it('uses the most explicit cue for a new word', () => {
    const type = chooseExerciseType(full, state({ mastery: 0 }), createRandom(1))
    expect(['translation_recall', 'context_recall']).toContain(type)
  })

  it('drops the Russian cue once a word is nearly active', () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const type = chooseExerciseType(full, state({ mastery: 90 }), createRandom(seed))
      expect(type).not.toBe('translation_recall')
      expect(type).not.toBe('context_recall')
    }
  })

  it('never picks a format the entry cannot support', () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const type = chooseExerciseType(bare, state({ mastery: 95 }), createRandom(seed))
      expect(type).toBe('translation_recall')
    }
  })
})

describe('collocationAnswer', () => {
  it('extracts the hidden part of the pattern', () => {
    expect(collocationAnswer('make a decision', '___ a decision')).toBe('make')
    expect(collocationAnswer('take responsibility', 'take ___')).toBe('responsibility')
  })

  it('returns null when the pattern does not line up', () => {
    expect(collocationAnswer('make a decision', '___ decision')).toBeNull()
    expect(collocationAnswer('make a decision', 'make a decision')).toBeNull()
  })
})

describe('buildSessionItem', () => {
  const common = { word: full, state: state(), source: 'due' as const, id: 'i1', random: createRandom(2) }

  it('shows the Russian cue for a translation exercise', () => {
    const item = buildSessionItem({ ...common, exerciseType: 'translation_recall' })
    expect(item.prompt).toBe('решать')
    expect(item.promptLang).toBe('ru')
    expect(item.answer).toBe('decide')
  })

  it('shows the definition, in English only, for a definition exercise', () => {
    const item = buildSessionItem({ ...common, exerciseType: 'definition_recall' })
    expect(item.prompt).toBe('to choose after thinking')
    expect(item.promptSecondary).toBeNull()
    expect(item.promptLang).toBe('en')
  })

  it('asks for the missing part of a collocation, not the lemma', () => {
    const item = buildSessionItem({ ...common, exerciseType: 'collocation' })
    expect(item.prompt).toBe('___ a decision')
    expect(item.answer).toBe('make')
  })

  it('asks for the derived form in a word family exercise', () => {
    const item = buildSessionItem({ ...common, exerciseType: 'word_family' })
    expect(item.answer).toBe('decision')
  })

  it('falls back to the Russian cue when the chosen format has no content', () => {
    const item = buildSessionItem({
      ...common,
      word: bare,
      exerciseType: 'definition_recall',
    })
    expect(item.exerciseType).toBe('translation_recall')
    expect(item.prompt).toBe('решать')
  })
})
