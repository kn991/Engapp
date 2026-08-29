'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnswerInput } from '@/components/train/answer-input'
import { LatencyBadge } from '@/components/train/latency-badge'
import {
  bandForLatency,
  clampLatency,
  evaluateAnswer,
  isAcceptedVerdict,
  formatLatency,
  type RecallBand,
} from '@/domain/learning'

/**
 * A three-word taste of the real exercise, running entirely in the browser.
 *
 * It uses the same grading and timing code as the product, so the number a
 * visitor sees here is the number they would get inside the app.
 */

interface DemoWord {
  russian: string
  context: string
  answer: string
  accepted: string[]
}

const WORDS: DemoWord[] = [
  {
    russian: 'избегать',
    context: 'I try to ___ unnecessary meetings.',
    answer: 'avoid',
    accepted: [],
  },
  {
    russian: 'откладывать',
    context: 'Could we ___ the meeting until Friday?',
    answer: 'postpone',
    accepted: ['put off', 'delay'],
  },
  {
    russian: 'колебаться',
    context: 'Do not ___ to ask if anything is unclear.',
    answer: 'hesitate',
    accepted: [],
  },
]

interface Result {
  word: DemoWord
  latencyMs: number
  band: RecallBand
  wasCorrect: boolean
}

export function RecallDemo() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [phase, setPhase] = useState<'idle' | 'asking' | 'feedback' | 'done'>('idle')
  const shownAt = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = WORDS[index]
  const last = results[results.length - 1]

  useEffect(() => {
    if (phase !== 'asking') return
    shownAt.current = performance.now()
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [phase, index])

  function start() {
    setResults([])
    setIndex(0)
    setAnswer('')
    setPhase('asking')
  }

  function submit() {
    if (!current || answer.trim().length === 0) return
    const latencyMs = clampLatency(performance.now() - shownAt.current)
    const evaluation = evaluateAnswer(answer, {
      expected: current.answer,
      accepted: current.accepted,
    })
    const wasCorrect = isAcceptedVerdict(evaluation.verdict)
    setResults((current2) => [
      ...current2,
      { word: current, latencyMs, band: wasCorrect ? bandForLatency(latencyMs) : 'failed', wasCorrect },
    ])
    setPhase('feedback')
  }

  function next() {
    setAnswer('')
    if (index + 1 >= WORDS.length) {
      setPhase('done')
      return
    }
    setIndex((value) => value + 1)
    setPhase('asking')
  }

  if (phase === 'idle') {
    return (
      <DemoShell>
        <p className="font-display text-[1.375rem] leading-snug">
          Three Russian words. Write the English one.
        </p>
        <p className="mt-2 text-[0.9375rem] text-[var(--muted)]">
          We time how long it takes. That number is the whole point.
        </p>
        <Button className="mt-6" size="lg" fullWidth onClick={start}>
          Try it
        </Button>
      </DemoShell>
    )
  }

  if (phase === 'done') {
    const correct = results.filter((result) => result.wasCorrect)
    const average =
      correct.length > 0
        ? Math.round(correct.reduce((total, result) => total + result.latencyMs, 0) / correct.length)
        : null

    return (
      <DemoShell>
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
          Your recall time
        </p>
        <p className="tabular font-display mt-2 text-[2.25rem] leading-none">
          {formatLatency(average)}
        </p>
        <ul className="mt-5 space-y-2">
          {results.map((result) => (
            <li key={result.word.answer} className="flex items-baseline justify-between gap-4">
              <span className="font-display text-[1.0625rem]" lang="en">
                {result.word.answer}
              </span>
              <LatencyBadge band={result.band} latencyMs={result.latencyMs} />
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-[var(--muted)]">
          You knew these words. In a real conversation you would not have had that long. Verba
          trains the gap between knowing and saying.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-14 flex-1 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent)] font-medium text-[var(--accent-contrast)]"
          >
            Train your own vocabulary
          </Link>
          <Button variant="secondary" size="lg" onClick={start}>
            Again
          </Button>
        </div>
      </DemoShell>
    )
  }

  return (
    <DemoShell>
      <div className="flex items-center justify-between">
        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
          Write the English word
        </span>
        <span className="tabular text-sm text-[var(--muted)]">
          {index + 1} / {WORDS.length}
        </span>
      </div>

      {phase === 'asking' ? (
        <>
          <p lang="ru" className="font-display mt-5 text-center text-[2rem] leading-tight">
            {current?.russian}
          </p>
          <p lang="en" className="mt-3 text-center text-[0.9375rem] text-[var(--muted)]">
            {current?.context}
          </p>
          <form
            className="mt-6"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <AnswerInput
              ref={inputRef}
              value={answer}
              onChange={setAnswer}
              review={false}
              placeholder="Type it"
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              className="mt-3"
              disabled={answer.trim().length === 0}
            >
              Check
            </Button>
          </form>
        </>
      ) : (
        <div className="mt-5 text-center">
          <p className="font-display text-[2rem] leading-tight" lang="en">
            {last?.word.answer}
          </p>
          {last && (
            <div className="mt-2 flex justify-center">
              <LatencyBadge band={last.band} latencyMs={last.latencyMs} />
            </div>
          )}
          <p className="mt-3 text-[0.9375rem] text-[var(--muted)]">
            {last?.wasCorrect
              ? 'You knew it. We train you to reach it faster.'
              : 'Recognising it is not the same as producing it.'}
          </p>
          <Button size="lg" fullWidth className="mt-6" onClick={next} autoFocus>
            {index + 1 >= WORDS.length ? 'See your result' : 'Next'}
          </Button>
        </div>
      )}
    </DemoShell>
  )
}

function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
      {children}
    </div>
  )
}
