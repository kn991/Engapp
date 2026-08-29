import { describe, expect, it } from 'vitest'
import { buildSession, targetItemCount } from '@/domain/learning/session-builder'
import { initialWordState } from '@/domain/learning/grade'
import { SESSION } from '@/domain/learning/config'
import { createRandom } from '@/domain/learning/random'
import { interleave } from '@/domain/learning/session-builder'
import type { CandidateWord } from '@/domain/learning/session-builder'
import type { UserWordState, Word } from '@/domain/learning/types'

const NOW = new Date('2026-03-01T09:00:00.000Z')

function word(id: string, overrides: Partial<Word> = {}): Word {
  return {
    id,
    lemma: `word-${id}`,
    partOfSpeech: 'verb',
    cefr: 'B1',
    russian: `перевод-${id}`,
    definition: `definition for ${id}`,
    contextHint: `situation for ${id}`,
    primaryAnswer: `word-${id}`,
    acceptedAnswers: [],
    tags: ['test'],
    examples: [{ sentence: `A word-${id} sentence.`, clozeSentence: 'A ___ sentence.', translation: null }],
    collocations: [],
    family: [],
    isCustom: false,
    ...overrides,
  }
}

function candidate(id: string, state: Partial<UserWordState> = {}): CandidateWord {
  return { word: word(id), state: { ...initialWordState(id), ...state } }
}

const overdue = (id: string) =>
  candidate(id, {
    reviewCount: 4,
    mastery: 60,
    status: 'activating',
    nextReviewAt: '2026-02-20T09:00:00.000Z',
  })

const weak = (id: string) =>
  candidate(id, { reviewCount: 6, mastery: 30, status: 'weak', lapses: 3 })

const maintenance = (id: string) =>
  candidate(id, {
    reviewCount: 20,
    mastery: 95,
    status: 'active',
    nextReviewAt: '2026-05-01T09:00:00.000Z',
  })

describe('targetItemCount', () => {
  it('turns a daily goal into a number of questions', () => {
    expect(targetItemCount(5)).toBeGreaterThanOrEqual(SESSION.minItems)
    expect(targetItemCount(20)).toBeLessThanOrEqual(SESSION.maxItems)
    expect(targetItemCount(10)).toBeGreaterThan(targetItemCount(5))
  })
})

describe('buildSession', () => {
  const candidates: CandidateWord[] = [
    ...Array.from({ length: 20 }, (_, i) => overdue(`due-${i}`)),
    ...Array.from({ length: 10 }, (_, i) => weak(`weak-${i}`)),
    ...Array.from({ length: 20 }, (_, i) => candidate(`new-${i}`)),
    ...Array.from({ length: 10 }, (_, i) => maintenance(`active-${i}`)),
  ]

  it('produces a queue sized to the daily goal', () => {
    const { items } = buildSession({ candidates, now: NOW, goalMinutes: 10, seed: 1 })
    expect(items.length).toBe(targetItemCount(10))
  })

  it('never introduces more new words than the configured cap', () => {
    const { counts } = buildSession({ candidates, now: NOW, goalMinutes: 20, seed: 2 })
    expect(counts.new).toBeLessThanOrEqual(SESSION.maxNewPerSession)
  })

  it('leads with overdue and struggling words', () => {
    const { counts } = buildSession({ candidates, now: NOW, goalMinutes: 10, seed: 3 })
    expect(counts.due + counts.weak).toBeGreaterThan(counts.maintenance)
  })

  it('never shows the same word twice in a session', () => {
    const { items } = buildSession({ candidates, now: NOW, goalMinutes: 20, seed: 4 })
    const ids = items.map((item) => item.word.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('is deterministic for a given seed', () => {
    const first = buildSession({ candidates, now: NOW, goalMinutes: 10, seed: 7 })
    const second = buildSession({ candidates, now: NOW, goalMinutes: 10, seed: 7 })
    expect(first.items.map((item) => item.id)).toEqual(second.items.map((item) => item.id))
  })

  it('still fills a session when only a few words exist', () => {
    const { items } = buildSession({
      candidates: candidates.slice(0, 5),
      now: NOW,
      goalMinutes: 10,
      seed: 5,
    })
    expect(items.length).toBe(5)
  })

  it('returns nothing when there is nothing to train', () => {
    const { items } = buildSession({ candidates: [], now: NOW, goalMinutes: 10, seed: 6 })
    expect(items).toEqual([])
  })

  it('asks for production in English for words that are already strong', () => {
    const strong = [
      candidate('strong-1', { reviewCount: 12, mastery: 88, status: 'strong' }),
    ]
    const { items } = buildSession({ candidates: strong, now: NOW, goalMinutes: 5, seed: 9 })
    expect(items[0]?.exerciseType).not.toBe('translation_recall')
  })

  it('uses the most explicit cue for a word that has never been seen', () => {
    const { items } = buildSession({
      candidates: [candidate('fresh')],
      now: NOW,
      goalMinutes: 5,
      seed: 11,
    })
    expect(['translation_recall', 'context_recall']).toContain(items[0]?.exerciseType)
  })
})

describe('interleave', () => {
  it('avoids long runs of the same exercise format', () => {
    const items = Array.from({ length: 12 }, (_, index) => ({
      ...buildSession({
        candidates: [candidate(`x-${index}`)],
        now: NOW,
        goalMinutes: 5,
        seed: index,
      }).items[0]!,
    }))

    const ordered = interleave(items, createRandom(3))
    let run = 1
    let longest = 1
    for (let i = 1; i < ordered.length; i += 1) {
      if (ordered[i]?.exerciseType === ordered[i - 1]?.exerciseType) run += 1
      else run = 1
      longest = Math.max(longest, run)
    }
    expect(longest).toBeLessThanOrEqual(SESSION.maxConsecutiveSameType)
  })
})
