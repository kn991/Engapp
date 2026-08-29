'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  INITIAL_SET_SIZE,
  isValidTimeZone,
  type CefrLevel,
  type SessionItem,
} from '@/domain/learning'
import { logError } from '@/lib/logger'
import { fail, GENERIC_ERROR, ok, type ActionResult } from '@/lib/result'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { diagnosticResultSchema, onboardingSchema } from '@/lib/validation'
import { loadDiagnosticQueue } from '@/server/queries/session'

/** Fetches the productive vocabulary test, weighted by the declared level. */
export async function loadDiagnostic(
  declaredLevel: string
): Promise<ActionResult<{ items: SessionItem[] }>> {
  const user = await requireUser()
  try {
    const items = await loadDiagnosticQueue(user.id, declaredLevel)
    return ok({ items })
  } catch (error) {
    logError('loadDiagnostic', error, { userId: user.id })
    return fail('We could not load the test. Check your connection and try again.')
  }
}

/** Saves the answers from steps 1 to 4. Safe to call more than once. */
export async function savePreferences(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = onboardingSchema.safeParse(input)
  if (!parsed.success) return fail('Some answers were missing.')

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const timeZone = isValidTimeZone(parsed.data.timeZone) ? parsed.data.timeZone : 'UTC'

  try {
    const { error: settingsError } = await supabase.from('user_settings').upsert(
      {
        user_id: user.id,
        focus: parsed.data.focus,
        declared_level: parsed.data.declaredLevel,
        problem_contexts: parsed.data.problemContexts,
        daily_goal_minutes: parsed.data.dailyGoalMinutes,
      },
      { onConflict: 'user_id' }
    )
    if (settingsError) throw settingsError

    const profileUpdate: { time_zone: string; display_name?: string } = { time_zone: timeZone }
    if (parsed.data.displayName) profileUpdate.display_name = parsed.data.displayName

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', user.id)
    if (profileError) throw profileError

    return ok(undefined)
  } catch (error) {
    logError('savePreferences', error, { userId: user.id })
    return fail(GENERIC_ERROR)
  }
}

/**
 * Records the test result and builds the learner's first set of words.
 *
 * Words produced quickly start with a small head start so they are not
 * re-taught from zero. Words that did not come out start as weak and are
 * scheduled immediately.
 */
export async function completeOnboarding(
  input: unknown
): Promise<ActionResult<never>> {
  const parsed = diagnosticResultSchema.safeParse(input)
  if (!parsed.success) return fail('We could not save your result.')

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const timeZone = isValidTimeZone(parsed.data.timeZone) ? parsed.data.timeZone : 'UTC'

  try {
    const { error: diagnosticError } = await supabase.from('diagnostics').insert({
      user_id: user.id,
      items: parsed.data.items,
      fast_count: parsed.data.fastCount,
      slow_count: parsed.data.slowCount,
      missed_count: parsed.data.missedCount,
      avg_latency_ms: parsed.data.avgLatencyMs,
      estimated_level: parsed.data.estimatedLevel,
    })
    if (diagnosticError) throw diagnosticError

    const now = new Date().toISOString()
    const seeded = new Map<string, { mastery: number; status: 'new' | 'weak' | 'activating' }>()

    for (const wordId of parsed.data.strongWordIds) {
      seeded.set(wordId, { mastery: 45, status: 'activating' })
    }
    for (const wordId of parsed.data.weakWordIds) {
      seeded.set(wordId, { mastery: 12, status: 'weak' })
    }

    const remaining = Math.max(0, INITIAL_SET_SIZE - seeded.size)
    if (remaining > 0) {
      const { data: extra } = await supabase.rpc('new_word_candidates', {
        p_limit: remaining + seeded.size,
        p_levels: levelsFor(parsed.data.estimatedLevel),
      })
      for (const row of extra ?? []) {
        if (seeded.size >= INITIAL_SET_SIZE) break
        if (seeded.has(row.id)) continue
        seeded.set(row.id, { mastery: 0, status: 'new' })
      }
    }

    if (seeded.size > 0) {
      const { error: wordsError } = await supabase.from('user_words').upsert(
        [...seeded.entries()].map(([wordId, seed]) => ({
          user_id: user.id,
          word_id: wordId,
          status: seed.status,
          mastery: seed.mastery,
          next_review_at: now,
        })),
        { onConflict: 'user_id,word_id', ignoreDuplicates: true }
      )
      if (wordsError) throw wordsError
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarded_at: now, time_zone: timeZone })
      .eq('id', user.id)
    if (profileError) throw profileError

    revalidatePath('/home')
  } catch (error) {
    logError('completeOnboarding', error, { userId: user.id })
    return fail(GENERIC_ERROR)
  }

  // Redirecting from inside the action moves the learner straight to their
  // result. It also avoids re-rendering /onboarding, which would now bounce
  // them to the home screen because setup is finished.
  redirect('/onboarding/result')
}

/** Levels worth training for someone at this productive level. */
function levelsFor(level: 'A2' | 'B1' | 'B2' | 'C1'): CefrLevel[] {
  switch (level) {
    case 'A2':
      return ['A2', 'B1']
    case 'B1':
      return ['A2', 'B1', 'B2']
    case 'B2':
      return ['B1', 'B2', 'C1']
    default:
      return ['B2', 'C1']
  }
}
