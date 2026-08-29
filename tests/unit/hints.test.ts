import { describe, expect, it } from 'vitest'
import { hintForLevel, maskAnswer, MAX_HINT_LEVEL } from '@/domain/learning/hints'
import type { SessionItem } from '@/domain/learning/types'
import { initialWordState } from '@/domain/learning/grade'

const item: SessionItem = {
  id: 'item-1',
  word: {
    id: 'word-1',
    lemma: 'hesitate',
    partOfSpeech: 'verb',
    cefr: 'B1',
    russian: 'колебаться',
    definition: 'to pause before doing something',
    contextHint: 'You stop for a moment because you are not sure.',
    primaryAnswer: 'hesitate',
    acceptedAnswers: [],
    tags: [],
    examples: [],
    collocations: [],
    family: [],
    isCustom: false,
  },
  state: initialWordState('word-1'),
  exerciseType: 'translation_recall',
  prompt: 'колебаться',
  promptSecondary: null,
  promptSecondaryLang: 'en',
  promptLang: 'ru',
  answer: 'hesitate',
  acceptedAnswers: [],
  reveal: null,
  source: 'due',
}

describe('maskAnswer', () => {
  it('reveals only the requested number of letters', () => {
    expect(maskAnswer('avoid', 1)).toBe('a · · · ·')
    expect(maskAnswer('avoid', 2)).toBe('a v · · ·')
  })

  it('keeps the shape of a multi-word answer', () => {
    expect(maskAnswer('put off', 1)).toContain('p')
    expect(maskAnswer('put off', 1)).not.toContain('o f f')
  })
})

describe('hintForLevel', () => {
  it('gives no hint at level zero', () => {
    expect(hintForLevel(item, 0)).toBeNull()
  })

  it('narrows the meaning without revealing letters at level one', () => {
    const hint = hintForLevel(item, 1)
    expect(hint?.label).toBe('Meaning')
    expect(hint?.text).not.toContain('hesitate')
    expect(hint?.text).toContain('verb')
  })

  it('reveals the first letter at level two', () => {
    const hint = hintForLevel(item, 2)
    expect(hint?.text.startsWith('h')).toBe(true)
    expect(hint?.text).toContain('·')
  })

  it('reveals more letters at the last level but never the whole word', () => {
    const hint = hintForLevel(item, MAX_HINT_LEVEL)
    expect(hint?.text).toContain('·')
    expect(hint?.text.replace(/[\s·]/g, '')).not.toBe('hesitate')
  })
})
