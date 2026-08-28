'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, BulbIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  classifyRecall,
  clampLatency,
  collocationAnswer,
  evaluateAnswer,
  gradeAttempt,
  hintCostLabel,
  hintForLevel,
  initialWordState,
  isAcceptedVerdict,
  MAX_HINT_LEVEL,
  nextCombo,
  XP,
  type RecallBand,
  type SessionItem,
} from '@/domain/learning'
import { enqueueAttempts, removeAttempts, type PendingAttempt } from '@/lib/offline/queue'
import { vibrate } from '@/lib/haptics'
import { isSpeechRecognitionSupported, startRecognition, type RecognitionHandle } from '@/lib/speech'
import { uuid } from '@/lib/utils'
import { acceptMyAnswer, completeSession, submitReviewBatch } from '@/server/actions/training'
import { AnswerInput } from './answer-input'
import { PromptCard } from './prompt-card'
import { RecallFeedback, type FeedbackData } from './recall-feedback'
import { SessionProgress } from './session-progress'
import { SessionSummary, type SessionSummaryData } from './session-summary'

export interface TrainingSettings {
  soundEnabled: boolean
  hapticsEnabled: boolean
  englishVariety: 'american' | 'british'
  inputMode: 'typing' | 'speaking' | 'mixed'
}

interface Props {
  sessionId: string
  items: SessionItem[]
  localDay: string
  settings: TrainingSettings
}

type Phase = 'question' | 'feedback' | 'summary'

interface RecordedAttempt {
  item: SessionItem
  band: RecallBand
  latencyMs: number
  wasCorrect: boolean
  hintLevel: number
  xp: number
  justActivated: boolean
}

/** Flush after this many answers so nothing sits unsent for long. */
const FLUSH_EVERY = 3

export function TrainingSession({ sessionId, items, localDay, settings }: Props) {
  const router = useRouter()

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [answer, setAnswer] = useState('')
  const [hintLevel, setHintLevel] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [acceptState, setAcceptState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [listening, setListening] = useState(false)
  const [showExit, setShowExit] = useState(false)
  const [summary, setSummary] = useState<SessionSummaryData | null>(null)
  const [finishing, setFinishing] = useState(false)
  const [combo, setCombo] = useState(0)
  const [comboFlash, setComboFlash] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const shownAtRef = useRef<number>(0)
  const submittingRef = useRef(false)
  const recognitionRef = useRef<RecognitionHandle | null>(null)
  const recordedRef = useRef<RecordedAttempt[]>([])
  const outboxRef = useRef<PendingAttempt[]>([])
  const startedAtRef = useRef<number>(Date.now())

  const current = items[index]
  const micSupported =
    settings.inputMode !== 'typing' && isSpeechRecognitionSupported()

  // Reset the per-question state and start the clock.
  useEffect(() => {
    if (phase !== 'question') return
    setAnswer('')
    setHintLevel(0)
    setAcceptState('idle')
    shownAtRef.current = performance.now()
    submittingRef.current = false
    // A short delay lets the next question paint before focus moves, which
    // keeps iOS from scrolling the field under the keyboard.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [index, phase])

  const hint = useMemo(
    () => (current && hintLevel > 0 ? hintForLevel(current, hintLevel) : null),
    [current, hintLevel]
  )

  const flush = useCallback(
    async (force: boolean) => {
      const pending = outboxRef.current
      if (pending.length === 0) return
      if (!force && pending.length < FLUSH_EVERY) return

      const batch = pending.slice()
      outboxRef.current = []

      const result = await submitReviewBatch({
        sessionId,
        attempts: batch.map(({ sessionId: _sessionId, queuedAt: _queuedAt, ...attempt }) => attempt),
      })

      if (result.ok) {
        await removeAttempts(batch.map((attempt) => attempt.clientEventId))
      } else {
        // Put them back so the next flush retries. The server deduplicates by
        // clientEventId, so a partially applied batch cannot double count.
        outboxRef.current = [...batch, ...outboxRef.current]
      }
    },
    [sessionId]
  )

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setListening(false)
  }, [])

  const handleSubmit = useCallback(
    async (options: { revealed?: boolean } = {}) => {
    const revealed = options.revealed ?? false
    if (!current || phase !== 'question') return
    if (submittingRef.current) return
    if (answer.trim().length === 0 && !revealed) {
      inputRef.current?.focus()
      return
    }
    submittingRef.current = true
    stopListening()

    const latencyMs = clampLatency(performance.now() - shownAtRef.current)
    const evaluation = evaluateAnswer(answer, {
      expected: current.answer,
      accepted: current.acceptedAnswers,
      otherKnownAnswers: otherAnswersFor(items, current),
    })

    const wasCorrect = !revealed && isAcceptedVerdict(evaluation.verdict)
    const isSpellingSlip = evaluation.verdict === 'spelling'

    const band = classifyRecall({
      latencyMs,
      wasCorrect,
      hintLevel: Math.min(hintLevel, 4),
      revealed,
    })
    const nextComboLength = nextCombo(combo, band)
    setCombo(nextComboLength)
    if (nextComboLength > 0 && nextComboLength % XP.comboStep === 0) {
      setComboFlash(nextComboLength)
      window.setTimeout(() => setComboFlash(null), 1400)
      vibrate('milestone', settings.hapticsEnabled)
    } else {
      vibrate(wasCorrect ? 'correct' : 'wrong', settings.hapticsEnabled)
    }

    const fuzz = Math.random()
    const outcome = gradeAttempt({
      state: current.state ?? initialWordState(current.word.id),
      now: new Date(),
      day: localDay,
      latencyMs,
      hintLevel: Math.min(hintLevel, 4),
      submittedAnswer: answer,
      wasCorrect,
      isSpellingSlip,
      revealed,
      comboLength: nextComboLength,
      random: fuzz,
    })

    setFeedback({
      item: current,
      band,
      latencyMs,
      wasCorrect,
      isSpellingSlip,
      submitted: answer,
      justActivated: outcome.justActivated,
      masteryAfter: outcome.masteryAfter,
    })
    setPhase('feedback')

    recordedRef.current.push({
      item: current,
      band,
      latencyMs,
      wasCorrect,
      hintLevel,
      xp: outcome.xp,
      justActivated: outcome.justActivated,
    })

    const pending: PendingAttempt = {
      clientEventId: uuid(),
      wordId: current.word.id,
      exerciseType: current.exerciseType,
      promptRef: current.prompt.slice(0, 200),
      submittedAnswer: answer.slice(0, 200),
      latencyMs,
      hintLevel: Math.min(hintLevel, 4),
      revealed,
      localDay,
      fuzz,
      sessionId,
      queuedAt: Date.now(),
    }
    outboxRef.current.push(pending)
    void enqueueAttempts([pending])
    void flush(false)
    },
    [
      answer,
      combo,
      current,
      flush,
      hintLevel,
      items,
      localDay,
      phase,
      sessionId,
      settings.hapticsEnabled,
      stopListening,
    ]
  )

  const finish = useCallback(async () => {
    setFinishing(true)
    setPhase('summary')
    await flush(true)

    const durationMs = Date.now() - startedAtRef.current
    const result = await completeSession({ sessionId, durationMs, localDay })

    const recorded = recordedRef.current
    setSummary({
      durationMs,
      attempts: recorded.map((entry) => ({
        lemma: entry.item.word.lemma,
        band: entry.band,
        latencyMs: entry.latencyMs,
        wasCorrect: entry.wasCorrect,
        previousLatencyMs: entry.item.state?.recentLatencyMs ?? null,
        justActivated: entry.justActivated,
      })),
      xpFromAnswers: recorded.reduce((total, entry) => total + entry.xp, 0),
      bonusXp: result.ok ? result.data.xpAwarded : 0,
      unlocked: result.ok ? result.data.unlocked : [],
      streak: result.ok ? result.data.streak : null,
      saved: result.ok,
    })
    setFinishing(false)
  }, [flush, localDay, sessionId])

  const goNext = useCallback(() => {
    if (index + 1 >= items.length) {
      void finish()
      return
    }
    setIndex((value) => value + 1)
    setPhase('question')
  }, [finish, index, items.length])

  function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (phase === 'question') void handleSubmit({})
    else if (phase === 'feedback') goNext()
  }

  function takeHint() {
    if (phase !== 'question') return
    setHintLevel((level) => Math.min(level + 1, MAX_HINT_LEVEL))
    inputRef.current?.focus()
  }

  function revealAnswer() {
    // Recorded as a failed retrieval: being shown the word is not recall.
    void handleSubmit({ revealed: true })
  }

  function toggleMic() {
    if (listening) {
      stopListening()
      return
    }
    const handle = startRecognition({
      lang: settings.englishVariety === 'british' ? 'en-GB' : 'en-US',
      onResult: (transcript) => setAnswer(transcript),
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    })
    if (handle) {
      recognitionRef.current = handle
      setListening(true)
    }
  }

  async function handleAcceptAnswer() {
    if (!feedback) return
    setAcceptState('saving')
    const result = await acceptMyAnswer({
      wordId: feedback.item.word.id,
      answer: feedback.submitted,
    })
    setAcceptState(result.ok ? 'saved' : 'idle')
  }

  useEffect(() => () => stopListening(), [stopListening])

  // Retry anything still unsent when the connection returns.
  useEffect(() => {
    const onOnline = () => void flush(true)
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [flush])

  if (phase === 'summary') {
    return (
      <SessionSummary
        data={summary}
        loading={finishing}
        onDone={() => {
          router.push('/home')
          router.refresh()
        }}
      />
    )
  }

  if (!current) return null

  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col">
      <div className="flex items-center gap-2 px-4 pt-3">
        <IconButton label="Leave session" onClick={() => setShowExit(true)}>
          <ArrowLeftIcon />
        </IconButton>
        <SessionProgress className="flex-1" current={index + (phase === 'feedback' ? 1 : 0)} total={items.length} />
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 pb-4">
        {comboFlash !== null && (
          <p
            className="animate-pop mb-4 text-center text-sm font-semibold tracking-[0.1em] text-[var(--accent)] uppercase"
            role="status"
          >
            Combo ×{comboFlash}
          </p>
        )}

        {phase === 'question' ? (
          <PromptCard
            item={current}
            soundEnabled={settings.soundEnabled}
            variety={settings.englishVariety}
          />
        ) : (
          feedback && (
            <RecallFeedback
              data={feedback}
              soundEnabled={settings.soundEnabled}
              variety={settings.englishVariety}
              onAcceptAnswer={handleAcceptAnswer}
              acceptState={acceptState}
            />
          )
        )}

        {hint && phase === 'question' && (
          <div className="animate-fade mt-6 text-center">
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
              {hint.label}
            </p>
            <p className="mt-1 text-[1.0625rem] tracking-[0.08em]">{hint.text}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="px-5 pb-4">
        <AnswerInput
          ref={inputRef}
          value={phase === 'feedback' ? (feedback?.submitted ?? '') : answer}
          onChange={setAnswer}
          review={phase === 'feedback'}
          placeholder="Type the English word"
          micSupported={micSupported}
          listening={listening}
          onMicClick={toggleMic}
          invalid={phase === 'feedback' && feedback?.wasCorrect === false}
        />

        <div className="mt-3 flex items-center gap-2">
          {phase === 'question' ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={takeHint}
                disabled={hintLevel >= MAX_HINT_LEVEL}
                className="text-[var(--muted)]"
              >
                <BulbIcon size={18} />
                {hintLevel === 0 ? 'Hint' : `Hint ${hintLevel + 1}`}
              </Button>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">
                {hintCostLabel(hintLevel + 1)}
              </span>
              <Button type="submit" className="ml-auto" size="md" disabled={answer.trim().length === 0}>
                Check
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[var(--muted)]"
                onClick={() => setShowExit(true)}
              >
                End session
              </Button>
              <Button type="submit" className="ml-auto" size="md">
                {index + 1 >= items.length ? 'Finish' : 'Continue'}
              </Button>
            </>
          )}
        </div>

        {phase === 'question' && hintLevel >= MAX_HINT_LEVEL && (
          <button
            type="button"
            onClick={revealAnswer}
            className="mt-3 w-full py-2 text-sm text-[var(--muted)] underline underline-offset-4"
          >
            Show the answer
          </button>
        )}
      </form>

      <Dialog
        open={showExit}
        onClose={() => setShowExit(false)}
        title="Leave this session?"
        description="Everything you have answered is already saved."
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowExit(false)}>
              Keep going
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowExit(false)
                void finish()
              }}
            >
              End and see summary
            </Button>
          </>
        }
      />
    </div>
  )
}

/**
 * Other answers in this session, so a submission that is exactly a different
 * word is never forgiven as a typo.
 */
function otherAnswersFor(items: SessionItem[], current: SessionItem): string[] {
  const answers: string[] = []
  for (const item of items) {
    if (item.word.id === current.word.id) continue
    answers.push(item.answer)
    for (const collocation of item.word.collocations) {
      const derived = collocationAnswer(collocation.collocation, collocation.pattern)
      if (derived) answers.push(derived)
    }
  }
  return answers
}
