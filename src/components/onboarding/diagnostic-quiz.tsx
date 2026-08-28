'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnswerInput } from '@/components/train/answer-input'
import { SessionProgress } from '@/components/train/session-progress'
import {
  clampLatency,
  evaluateAnswer,
  isAcceptedVerdict,
  type DiagnosticAttempt,
  type SessionItem,
} from '@/domain/learning'

export interface DiagnosticAnswer extends DiagnosticAttempt {
  wordId: string
  submitted: string
}

/**
 * The productive vocabulary test.
 *
 * No feedback between questions on purpose: seeing "correct" would change how
 * hard the next word is tried for, and we are measuring an unprimed baseline.
 */
export function DiagnosticQuiz({
  items,
  onComplete,
}: {
  items: SessionItem[]
  onComplete: (answers: DiagnosticAnswer[]) => void
}) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const answersRef = useRef<DiagnosticAnswer[]>([])
  const shownAtRef = useRef(performance.now())
  const inputRef = useRef<HTMLInputElement>(null)

  const current = items[index]

  useEffect(() => {
    setAnswer('')
    shownAtRef.current = performance.now()
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [index])

  function record(skipped: boolean) {
    if (!current) return
    const latencyMs = clampLatency(performance.now() - shownAtRef.current)
    const evaluation = evaluateAnswer(answer, {
      expected: current.answer,
      accepted: current.acceptedAnswers,
    })
    const wasCorrect = !skipped && isAcceptedVerdict(evaluation.verdict)

    answersRef.current.push({
      wordId: current.word.id,
      cefr: current.word.cefr,
      wasCorrect,
      latencyMs,
      hintUsed: false,
      submitted: answer,
    })

    if (index + 1 >= items.length) {
      onComplete(answersRef.current)
      return
    }
    setIndex((value) => value + 1)
  }

  if (!current) return null

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col px-5 pt-4 pb-5">
      <SessionProgress current={index} total={items.length} />

      <div className="flex flex-1 flex-col justify-center">
        <div className="text-center">
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
            Write the English word
          </p>
          <p lang="ru" className="font-display mt-5 text-[2rem] leading-[1.15]">
            {current.prompt}
          </p>
          {current.promptSecondary && (
            <p lang="en" className="mx-auto mt-4 max-w-[32ch] text-[0.9375rem] text-[var(--muted)]">
              {current.promptSecondary}
            </p>
          )}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (answer.trim().length === 0) {
            inputRef.current?.focus()
            return
          }
          record(false)
        }}
      >
        <AnswerInput
          ref={inputRef}
          value={answer}
          onChange={setAnswer}
          review={false}
          placeholder="Type the English word"
        />
        <div className="mt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[var(--muted)]"
            onClick={() => record(true)}
          >
            I cannot recall it
          </Button>
          <Button type="submit" size="md" className="ml-auto" disabled={answer.trim().length === 0}>
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
