import { describe, expect, it } from 'vitest'
import {
  canonicalize,
  editDistance,
  evaluateAnswer,
  normalizeAnswer,
  spellingToleranceFor,
} from '@/domain/learning/answer-evaluator'

describe('normalizeAnswer', () => {
  it('collapses case, padding and repeated spaces', () => {
    expect(normalizeAnswer('  Make   A  Decision ')).toBe('make a decision')
  })

  it('strips punctuation and curly quotes', () => {
    expect(normalizeAnswer('“avoid”,')).toBe('avoid')
    expect(normalizeAnswer("don't")).toBe('dont')
  })

  it('treats hyphens as spaces', () => {
    expect(normalizeAnswer('well-known')).toBe('well known')
  })
})

describe('canonicalize', () => {
  it('drops one leading infinitive marker or article', () => {
    expect(canonicalize('to avoid')).toBe('avoid')
    expect(canonicalize('a decision')).toBe('decision')
    expect(canonicalize('the meeting')).toBe('meeting')
  })

  it('leaves the rest of a phrase intact', () => {
    expect(canonicalize('to look after')).toBe('look after')
  })
})

describe('editDistance', () => {
  it('counts an adjacent transposition as one edit', () => {
    expect(editDistance('recieve', 'receive')).toBe(1)
  })

  it('counts substitutions, insertions and deletions', () => {
    expect(editDistance('cat', 'cut')).toBe(1)
    expect(editDistance('cat', 'cats')).toBe(1)
    expect(editDistance('cats', 'cat')).toBe(1)
  })

  it('is zero for identical strings', () => {
    expect(editDistance('avoid', 'avoid')).toBe(0)
  })
})

describe('spellingToleranceFor', () => {
  it('forgives nothing on short words', () => {
    expect(spellingToleranceFor('get')).toBe(0)
    expect(spellingToleranceFor('cope')).toBe(0)
  })

  it('forgives one edit on medium words and two on long ones', () => {
    expect(spellingToleranceFor('avoid')).toBe(1)
    expect(spellingToleranceFor('hesitate')).toBe(2)
  })
})

describe('evaluateAnswer', () => {
  const options = { expected: 'postpone', accepted: ['put off', 'delay'] }

  it('accepts the primary answer', () => {
    const result = evaluateAnswer('postpone', options)
    expect(result.verdict).toBe('correct')
    expect(result.matched).toBe('postpone')
  })

  it('accepts any listed alternative', () => {
    expect(evaluateAnswer('put off', options).verdict).toBe('correct')
    expect(evaluateAnswer('  Delay  ', options).verdict).toBe('correct')
  })

  it('reports an empty submission separately', () => {
    expect(evaluateAnswer('   ', options).verdict).toBe('empty')
  })

  it('treats a slipped letter as a spelling problem, not a recall failure', () => {
    const result = evaluateAnswer('recieve', { expected: 'receive' })
    expect(result.verdict).toBe('spelling')
    expect(result.distance).toBe(1)
    expect(result.matched).toBe('receive')
  })

  it('forgives a doubled letter in a long word', () => {
    expect(evaluateAnswer('hesitatte', { expected: 'hesitate' }).verdict).toBe('spelling')
  })

  it('does not forgive a different word that happens to look close', () => {
    // `affect` and `effect` differ by one letter but are different words.
    expect(evaluateAnswer('affect', { expected: 'effect' }).verdict).toBe('incorrect')
  })

  it('does not forgive a near miss on a short word', () => {
    expect(evaluateAnswer('cope', { expected: 'code' }).verdict).toBe('incorrect')
  })

  it('rejects a submission that is exactly another word being studied', () => {
    const result = evaluateAnswer('quite', {
      expected: 'quiet',
      otherKnownAnswers: ['quite'],
    })
    expect(result.verdict).toBe('incorrect')
  })

  it('requires the same number of words in a phrase', () => {
    expect(evaluateAnswer('make decision', { expected: 'make a decision' }).verdict).toBe(
      'incorrect'
    )
  })

  it('accepts a learner-specific synonym once saved', () => {
    const result = evaluateAnswer('obtain', {
      expected: 'get',
      userAccepted: ['obtain'],
    })
    expect(result.verdict).toBe('correct')
  })

  it('ignores the infinitive marker learners add inconsistently', () => {
    expect(evaluateAnswer('to avoid', { expected: 'avoid' }).verdict).toBe('correct')
  })
})
