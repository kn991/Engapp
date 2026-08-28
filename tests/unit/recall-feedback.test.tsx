import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecallFeedback, type FeedbackData } from '@/components/train/recall-feedback'
import { initialWordState } from '@/domain/learning/grade'
import type { SessionItem } from '@/domain/learning/types'

const item: SessionItem = {
  id: 'item-1',
  word: {
    id: 'w1',
    lemma: 'avoid',
    partOfSpeech: 'verb',
    cefr: 'B1',
    russian: 'избегать',
    definition: 'to stay away from something on purpose',
    contextHint: null,
    primaryAnswer: 'avoid',
    acceptedAnswers: [],
    tags: [],
    examples: [],
    collocations: [],
    family: [],
    isCustom: false,
  },
  state: initialWordState('w1'),
  exerciseType: 'translation_recall',
  prompt: 'избегать',
  promptSecondary: null,
  promptLang: 'ru',
  answer: 'avoid',
  acceptedAnswers: [],
  reveal: 'I try to avoid conflict.',
  source: 'due',
}

function feedback(overrides: Partial<FeedbackData> = {}): FeedbackData {
  return {
    item,
    band: 'instant',
    latencyMs: 1_800,
    wasCorrect: true,
    isSpellingSlip: false,
    submitted: 'avoid',
    justActivated: false,
    masteryAfter: 40,
    ...overrides,
  }
}

const props = {
  soundEnabled: false,
  variety: 'american' as const,
  acceptState: 'idle' as const,
}

describe('RecallFeedback', () => {
  it('states the speed in words, not only in colour', () => {
    render(<RecallFeedback data={feedback()} {...props} />)
    expect(screen.getByText('Instant')).toBeInTheDocument()
    expect(screen.getByText('1.8 sec')).toBeInTheDocument()
  })

  it('announces the result to screen readers', () => {
    const { container } = render(<RecallFeedback data={feedback()} {...props} />)
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull()
  })

  it('calls a slow correct answer out as slow', () => {
    render(<RecallFeedback data={feedback({ band: 'slow', latencyMs: 8_400 })} {...props} />)
    expect(screen.getByText('Slow')).toBeInTheDocument()
    expect(screen.getByText('You knew it. Now make it quicker.')).toBeInTheDocument()
  })

  it('distinguishes a spelling slip from a missed word', () => {
    render(
      <RecallFeedback
        data={feedback({ isSpellingSlip: true, submitted: 'aviod', band: 'good' })}
        {...props}
      />
    )
    expect(screen.getByText(/Almost — spelling/)).toBeInTheDocument()
  })

  it('offers to accept an unrecognised answer only when one was given', async () => {
    const onAcceptAnswer = vi.fn()
    const user = userEvent.setup()
    render(
      <RecallFeedback
        data={feedback({ wasCorrect: false, band: 'failed', submitted: 'evade' })}
        {...props}
        onAcceptAnswer={onAcceptAnswer}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Accept my answer' }))
    expect(onAcceptAnswer).toHaveBeenCalledTimes(1)
  })

  it('does not offer to accept an empty answer', () => {
    render(
      <RecallFeedback
        data={feedback({ wasCorrect: false, band: 'failed', submitted: '' })}
        {...props}
        onAcceptAnswer={() => {}}
      />
    )
    expect(screen.queryByRole('button', { name: 'Accept my answer' })).toBeNull()
  })

  it('celebrates a word reaching active', () => {
    render(<RecallFeedback data={feedback({ justActivated: true })} {...props} />)
    expect(screen.getByText('Now active')).toBeInTheDocument()
  })
})
