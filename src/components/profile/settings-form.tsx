'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { useTheme, type ThemePreference } from '@/components/theme'
import { DAILY_GOAL_OPTIONS } from '@/domain/learning'
import { updateSettings } from '@/server/actions/settings'

export interface SettingsValues {
  displayName: string
  dailyGoalMinutes: number
  declaredLevel: 'A2' | 'B1' | 'B2' | 'C1' | 'unsure'
  inputMode: 'typing' | 'speaking' | 'mixed'
  englishVariety: 'american' | 'british'
  soundEnabled: boolean
  hapticsEnabled: boolean
  reminderEnabled: boolean
  reminderTime: string | null
  timeZone: string
}

const SELECT =
  'h-12 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] px-3 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25'

export function SettingsForm({ initial }: { initial: SettingsValues }) {
  const router = useRouter()
  const toast = useToast()
  const { theme, setTheme } = useTheme()
  const [values, setValues] = useState(initial)
  const [pending, startTransition] = useTransition()

  function save(patch: Partial<SettingsValues>) {
    const next = { ...values, ...patch }
    setValues(next)
    startTransition(async () => {
      const result = await updateSettings({
        displayName: next.displayName,
        dailyGoalMinutes: next.dailyGoalMinutes,
        declaredLevel: next.declaredLevel,
        inputMode: next.inputMode,
        englishVariety: next.englishVariety,
        soundEnabled: next.soundEnabled,
        hapticsEnabled: next.hapticsEnabled,
        reminderEnabled: next.reminderEnabled,
        reminderTime: next.reminderTime,
        timeZone: next.timeZone,
      })
      if (!result.ok) {
        toast.show(result.error, 'error')
        setValues(values)
        return
      }
      router.refresh()
    })
  }

  function saveTheme(next: ThemePreference) {
    setTheme(next)
    startTransition(async () => {
      await updateSettings({ theme: next })
    })
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionTitle>Account</SectionTitle>
        <Field label="Display name" htmlFor="displayName">
          <Input
            id="displayName"
            value={values.displayName}
            maxLength={60}
            onChange={(event) => setValues({ ...values, displayName: event.target.value })}
            onBlur={() => save({ displayName: values.displayName })}
          />
        </Field>
        <Field label="Time zone" htmlFor="timeZone" hint="Used for streaks and daily goals.">
          <div className="flex gap-2">
            <Input id="timeZone" value={values.timeZone} readOnly className="flex-1" />
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                save({ timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' })
              }
            >
              Detect
            </Button>
          </div>
        </Field>
      </section>

      <section className="space-y-4">
        <SectionTitle>Training</SectionTitle>
        <Field label="Daily goal" htmlFor="dailyGoal">
          <select
            id="dailyGoal"
            className={`${SELECT} w-full`}
            value={values.dailyGoalMinutes}
            onChange={(event) => save({ dailyGoalMinutes: Number(event.target.value) })}
          >
            {DAILY_GOAL_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </Field>

        <Field label="Level" htmlFor="level">
          <select
            id="level"
            className={`${SELECT} w-full`}
            value={values.declaredLevel}
            onChange={(event) =>
              save({ declaredLevel: event.target.value as SettingsValues['declaredLevel'] })
            }
          >
            {['A2', 'B1', 'B2', 'C1', 'unsure'].map((level) => (
              <option key={level} value={level}>
                {level === 'unsure' ? 'Not sure' : level}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Answer with" htmlFor="inputMode" hint="Speaking uses your browser's recogniser where available.">
          <select
            id="inputMode"
            className={`${SELECT} w-full`}
            value={values.inputMode}
            onChange={(event) =>
              save({ inputMode: event.target.value as SettingsValues['inputMode'] })
            }
          >
            <option value="typing">Typing</option>
            <option value="speaking">Speaking</option>
            <option value="mixed">Both</option>
          </select>
        </Field>

        <Field label="English variety" htmlFor="variety">
          <select
            id="variety"
            className={`${SELECT} w-full`}
            value={values.englishVariety}
            onChange={(event) =>
              save({ englishVariety: event.target.value as SettingsValues['englishVariety'] })
            }
          >
            <option value="american">American</option>
            <option value="british">British</option>
          </select>
        </Field>
      </section>

      <section className="space-y-1">
        <SectionTitle>Preferences</SectionTitle>
        <Toggle
          label="Sound"
          description="Read words and sentences aloud."
          checked={values.soundEnabled}
          onChange={(checked) => save({ soundEnabled: checked })}
        />
        <Toggle
          label="Haptics"
          description="A short buzz on answers, where supported."
          checked={values.hapticsEnabled}
          onChange={(checked) => save({ hapticsEnabled: checked })}
        />
        <Toggle
          label="Daily reminder"
          description="Shows the time you plan to train. Notifications are not sent yet."
          checked={values.reminderEnabled}
          onChange={(checked) => save({ reminderEnabled: checked })}
        />
        {values.reminderEnabled && (
          <Field label="Reminder time" htmlFor="reminderTime" className="pt-2">
            <Input
              id="reminderTime"
              type="time"
              value={values.reminderTime ?? '19:00'}
              onChange={(event) => save({ reminderTime: event.target.value })}
            />
          </Field>
        )}
      </section>

      <section className="space-y-3">
        <SectionTitle>Theme</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {(['system', 'light', 'dark'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => saveTheme(option)}
              aria-pressed={theme === option}
              className={
                theme === option
                  ? 'h-12 rounded-[var(--radius-md)] border border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] capitalize'
                  : 'h-12 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] capitalize'
              }
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <p aria-live="polite" className="h-5 text-sm text-[var(--muted)]">
        {pending ? 'Saving…' : ''}
      </p>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 py-3 text-left"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-[var(--muted)]">{description}</span>
      </span>
      <span
        className={
          checked
            ? 'relative h-7 w-12 shrink-0 rounded-full bg-[var(--accent)] transition-colors'
            : 'relative h-7 w-12 shrink-0 rounded-full bg-[var(--surface-3)] transition-colors'
        }
      >
        <span
          className={
            checked
              ? 'absolute top-1 left-6 h-5 w-5 rounded-full bg-white transition-[left]'
              : 'absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-[left]'
          }
        />
      </span>
    </button>
  )
}
