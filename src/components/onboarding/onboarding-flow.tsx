'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { ErrorState } from '@/components/ui/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DAILY_GOAL_OPTIONS,
  summariseDiagnostic,
  LATENCY_THRESHOLDS,
  type SessionItem,
} from '@/domain/learning'
import { completeOnboarding, loadDiagnostic, savePreferences } from '@/server/actions/onboarding'
import { ChoiceList } from './choice-list'
import { DiagnosticQuiz, type DiagnosticAnswer } from './diagnostic-quiz'
import { StepShell } from './step-shell'

const TOTAL_STEPS = 5

const FOCUS_CHOICES = [
  { value: 'speaking' as const, label: 'Speaking', hint: 'Finding words mid-sentence.' },
  { value: 'writing' as const, label: 'Writing', hint: 'Emails, messages, documents.' },
  { value: 'both' as const, label: 'Both', hint: 'Whatever comes up.' },
]

const LEVEL_CHOICES = [
  { value: 'A2' as const, label: 'A2', hint: 'Everyday basics.' },
  { value: 'B1' as const, label: 'B1', hint: 'Comfortable with familiar topics.' },
  { value: 'B2' as const, label: 'B2', hint: 'Follow most conversations and articles.' },
  { value: 'C1' as const, label: 'C1', hint: 'Fluent, but words still stall.' },
  { value: 'unsure' as const, label: 'Not sure', hint: 'The test will place you.' },
]

const CONTEXT_CHOICES = [
  { value: 'conversation', label: 'Conversation' },
  { value: 'work', label: 'Work or study' },
  { value: 'films', label: 'Films and series' },
  { value: 'reading', label: 'Books and articles' },
  { value: 'travel', label: 'Travelling' },
  { value: 'writing', label: 'Writing' },
]

type Stage = 'questions' | 'loading-test' | 'test' | 'saving'

export function OnboardingFlow({ displayName }: { displayName: string | null }) {
  const [stage, setStage] = useState<Stage>('questions')
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(displayName ?? '')
  const [focus, setFocus] = useState<'speaking' | 'writing' | 'both'>('both')
  const [level, setLevel] = useState<'A2' | 'B1' | 'B2' | 'C1' | 'unsure'>('unsure')
  const [contexts, setContexts] = useState<string[]>([])
  const [goal, setGoal] = useState<number>(10)

  const [items, setItems] = useState<SessionItem[]>([])

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'

  async function startTest() {
    setError(null)
    setStage('loading-test')

    const saved = await savePreferences({
      focus,
      declaredLevel: level,
      problemContexts: contexts,
      dailyGoalMinutes: goal,
      timeZone,
      displayName: name.trim() || undefined,
    })
    if (!saved.ok) {
      setError(saved.error)
      setStage('questions')
      return
    }

    const result = await loadDiagnostic(level)
    if (!result.ok || result.data.items.length === 0) {
      setError(result.ok ? 'No test words are available yet.' : result.error)
      setStage('questions')
      return
    }
    setItems(result.data.items)
    setStage('test')
  }

  async function finishTest(given: DiagnosticAnswer[]) {
    setStage('saving')

    const summary = summariseDiagnostic(given)
    const strongWordIds = given
      .filter((a) => a.wasCorrect && a.latencyMs < LATENCY_THRESHOLDS.good)
      .map((a) => a.wordId)
    const weakWordIds = given.filter((a) => !a.wasCorrect).map((a) => a.wordId)

    const result = await completeOnboarding({
      items: summary.items,
      fastCount: summary.fast,
      slowCount: summary.slow,
      missedCount: summary.missed,
      avgLatencyMs: summary.avgLatencyMs,
      estimatedLevel: summary.estimatedLevel,
      strongWordIds,
      weakWordIds,
      timeZone,
    })

    // On success the action redirects to the result page, so reaching this
    // line at all means something went wrong.
    if (!result.ok) {
      setError(result.error)
      setStage('questions')
      setStep(4)
    }
  }

  if (stage === 'loading-test' || stage === 'saving') {
    return (
      <div className="safe-top space-y-4 px-5 py-12">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
        <p className="text-sm text-[var(--muted)]">
          {stage === 'saving' ? 'Building your first set…' : 'Preparing your test…'}
        </p>
      </div>
    )
  }

  if (stage === 'test') {
    return <DiagnosticQuiz items={items} onComplete={finishTest} />
  }

  const footer = (
    <div className="space-y-3">
      {error && <ErrorState description={error} />}
      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep((value) => value - 1)}>
            Back
          </Button>
        )}
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            if (step < 4) setStep((value) => value + 1)
            else void startTest()
          }}
          disabled={step === 3 && contexts.length === 0}
        >
          {step < 4 ? 'Continue' : 'Start the test'}
        </Button>
      </div>
    </div>
  )

  if (step === 1) {
    return (
      <StepShell
        step={1}
        total={TOTAL_STEPS}
        title="What do you want to improve?"
        description="This changes the balance of exercises you get."
        footer={footer}
      >
        <div className="space-y-6">
          <Field label="What should we call you?" htmlFor="name">
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="given-name"
              maxLength={60}
            />
          </Field>
          <ChoiceList name="Focus" choices={FOCUS_CHOICES} value={focus} onChange={setFocus} />
        </div>
      </StepShell>
    )
  }

  if (step === 2) {
    return (
      <StepShell
        step={2}
        total={TOTAL_STEPS}
        title="Roughly what level are you?"
        description="A rough guess is fine. The test decides where you actually start."
        footer={footer}
      >
        <ChoiceList name="Level" choices={LEVEL_CHOICES} value={level} onChange={setLevel} />
      </StepShell>
    )
  }

  if (step === 3) {
    return (
      <StepShell
        step={3}
        total={TOTAL_STEPS}
        title="Where do words fail you?"
        description="Pick everything that sounds familiar."
        footer={footer}
      >
        <ChoiceList
          name="Contexts"
          multiple
          choices={CONTEXT_CHOICES}
          value={contexts}
          onChange={(value) =>
            setContexts((current) =>
              current.includes(value)
                ? current.filter((entry) => entry !== value)
                : [...current, value]
            )
          }
        />
      </StepShell>
    )
  }

  return (
    <StepShell
      step={4}
      total={TOTAL_STEPS}
      title="How long per day?"
      description="Short and daily beats long and occasional."
      footer={footer}
    >
      <ChoiceList
        name="Daily goal"
        choices={DAILY_GOAL_OPTIONS.map((minutes) => ({
          value: minutes,
          label: `${minutes} min`,
          hint: `About ${Math.round((minutes * 60) / 14)} words a day.`,
        }))}
        value={goal}
        onChange={(value) => setGoal(value)}
      />
    </StepShell>
  )
}
