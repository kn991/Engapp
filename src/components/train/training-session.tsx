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
import {
  enqueueAttempts,
  readPendingAttempts,
  removeAttempts,
  type PendingAttempt,
} from '@/lib/offline/queue'
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

/** Must stay at or below the batch limit the server action accepts. */
const MAX_BATCH = 50

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
  /** Fallback for browsers where IndexedDB is unavailable. */
  const memoryRef = useRef<PendingAttempt[]>([])
  const inFlightRef = useRef<Promise<void> | null>(null)
  const startedAtRef = useRef<number>(0)

  const [renderedItemId, setRenderedItemId] = useState<string | null>(null)

  const current = items[index]
  const micSupported =
    settings.inputMode !== 'typing' && isSpeechRecognitionSupported()

  // Clear the field as soon as a new question renders, rather than one paint
  // later, so the learner never types into the previous answer.
  if (phase === 'question' && current && renderedItemId !== current.id) {
    setRenderedItemId(current.id)
    setAnswer('')
    setHintLevel(0)
    setAcceptState('idle')
  }

  // The session clock starts when the first question is actually on screen.
  useEffect(() => {
    if (startedAtRef.current === 0) startedAtRef.current = Date.now()
  }, [])

  // Start the per-question clock and hand focus to the input.
  useEffect(() => {
    if (phase !== 'question') return
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

  /**
   * Sends everything sitting in the outbox.
   *
   * The outbox, not a variable in this component, is the source of truth. A
   * failed send, a closed tab or a dead network leaves the answers exactly
   * where the next flush will find them, and the server deduplicates by client
   * event id, so re-sending is always safe.
   *
   * Flushes are serialised. A forced flush waits for one already running and
   * then runs itself, so finishing a session never races ahead of the answers.
   */
  const drain = useCallback(async (force: boolean) => {
    const stored = await readPendingAttempts()
    const pending = mergeQueues(stored, memoryRef.current)
    if (pending.length === 0) return
    if (!force && pending.length < FLUSH_EVERY) return

    for (const [batchSessionId, attempts] of groupBySession(pending)) {
      for (let start = 0; start < attempts.length; start += MAX_BATCH) {
        const chunk = attempts.slice(start, start + MAX_BATCH)
        const result = await submitReviewBatch({
          sessionId: batchSessionId,
          attempts: chunk.map(
            ({ sessionId: _sessionId, queuedAt: _queuedAt, ...attempt }) => attempt
          ),
        })
        if (!result.ok) return

        const sent = new Set(chunk.map((attempt) => attempt.clientEventId))
        memoryRef.current = memoryRef.current.filter(
          (attempt) => !sent.has(attempt.clientEventId)
        )
        await removeAttempts([...sent])
      }
    }
  }, [])

  const flush = useCallback(
    async (force: boolean) => {
      const running = inFlightRef.current
      if (running) {
        await running.catch(() => {})
        if (!force) return
      }

      const run = drain(force).catch(() => {
        // Offline, or the request was cut off. Everything stays in the outbox
        // and the next flush, reconnection or visit picks it up.
      })
      inFlightRef.current = run
      try {
        await run
      } finally {
        if (inFlightRef.current === run) inFlightRef.current = null
      }
    },
    [drain]
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
    void (async () => {
      const stored = await enqueueAttempts([pending])
      if (!stored) memoryRef.current.push(pending)
      await flush(false)
    })()
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

    const durationMs = Date.now() - (startedAtRef.current || Date.now())
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

  /**
   * Drain anything left by a previous visit - a closed tab, a crash, or a
   * session abandoned while offline - before this session adds to it.
   */
  useEffect(() => {
    void flush(true)
  }, [flush])

  // Push whatever is queued when the tab is backgrounded or closed.
  useEffect(() => {
    const onHide = () => void flush(true)
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onHide)
    }
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
        <SessionProgress
          className="flex-1"
          current={index + 1}
          completed={index + (phase === 'feedback' ? 1 : 0)}
          total={items.length}
        />
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
            <p
              className={
                hint.level >= 2
                  ? 'mt-1 text-[1.25rem] tracking-[0.18em]'
                  : 'mx-auto mt-1 max-w-[34ch] text-[1.0625rem] leading-relaxed'
              }
            >
              {hint.text}
            </p>
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

/** Outbox entries from storage and memory, oldest first, without duplicates. */
function mergeQueues(
  stored: PendingAttempt[],
  memory: PendingAttempt[]
): PendingAttempt[] {
  const byId = new Map<string, PendingAttempt>()
  for (const attempt of [...stored, ...memory]) byId.set(attempt.clientEventId, attempt)
  return [...byId.values()].sort((a, b) => a.queuedAt - b.queuedAt)
}

/** Answers are submitted per session so none is attributed to the wrong one. */
function groupBySession(
  attempts: PendingAttempt[]
): Array<[string | null, PendingAttempt[]]> {
  const bySession = new Map<string | null, PendingAttempt[]>()
  for (const attempt of attempts) {
    const list = bySession.get(attempt.sessionId) ?? []
    list.push(attempt)
    bySession.set(attempt.sessionId, list)
  }
  return [...bySession.entries()]
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
