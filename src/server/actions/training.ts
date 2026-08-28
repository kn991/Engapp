'use server'

import { revalidatePath } from 'next/cache'
import {
  ACHIEVEMENTS,
  challengesForDay,
  collocationAnswer,
  evaluateAnswer,
  evaluateChallenges,
  gradeAttempt,
  initialWordState,
  classifyRecall,
  isAcceptedVerdict,
  newlyUnlocked,
  nextCombo,
  STREAK,
  XP,
  applyTrainingDay,
  type AttemptOutcome,
  type RecallBand,
  type UserWordState,
} from '@/domain/learning'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { logError } from '@/lib/logger'
import { fail, GENERIC_ERROR, ok, type ActionResult } from '@/lib/result'
import {
  acceptAnswerSchema,
  completeSessionSchema,
  reviewBatchSchema,
  uuidSchema,
} from '@/lib/validation'
import {
  toUserWordState,
  toUserWordUpdate,
  toWord,
  WORD_SELECT,
  type WordRowWithDetails,
} from '@/server/mappers'

export interface AttemptResult {
  clientEventId: string
  wordId: string
  band: RecallBand
  wasCorrect: boolean
  isSpellingSlip: boolean
  masteryAfter: number
  statusAfter: string
  justActivated: boolean
  xp: number
}

/** Opens a session row so every review can be attributed to it. */
export async function startSession(
  kind: 'daily' | 'diagnostic' | 'practice',
  plannedCount: number,
  localDay: string
): Promise<ActionResult<{ sessionId: string }>> {
  const user = await requireUser()
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('training_sessions')
    .insert({
      user_id: user.id,
      kind,
      planned_count: Math.max(0, Math.min(plannedCount, 100)),
      local_day: localDay,
    })
    .select('id')
    .single()

  if (error || !data) {
    logError('startSession', error, { userId: user.id })
    return fail(GENERIC_ERROR)
  }
  return ok({ sessionId: data.id })
}

/**
 * Persists a batch of answers.
 *
 * The client grades locally for instant feedback, but nothing it computes is
 * trusted: the server re-evaluates each answer against the stored word and
 * re-runs the same scheduler. Batches are idempotent through
 * `client_event_id`, so a retry after a dropped connection is free.
 */
export async function submitReviewBatch(
  input: unknown
): Promise<ActionResult<{ results: AttemptResult[] }>> {
  const parsed = reviewBatchSchema.safeParse(input)
  if (!parsed.success) return fail('That answer could not be saved.')

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const { attempts, sessionId } = parsed.data

  try {
    const wordIds = [...new Set(attempts.map((a) => a.wordId))]

    const [wordsResponse, statesResponse, acceptedResponse, existingResponse] = await Promise.all([
      supabase.from('words').select(WORD_SELECT).in('id', wordIds),
      supabase.from('user_words').select('*').eq('user_id', user.id).in('word_id', wordIds),
      supabase
        .from('user_accepted_answers')
        .select('word_id, answer')
        .eq('user_id', user.id)
        .in('word_id', wordIds),
      supabase
        .from('review_events')
        .select('client_event_id')
        .eq('user_id', user.id)
        .in(
          'client_event_id',
          attempts.map((a) => a.clientEventId)
        ),
    ])

    if (wordsResponse.error) throw wordsResponse.error

    const acceptedByWord = new Map<string, string[]>()
    for (const row of acceptedResponse.data ?? []) {
      const list = acceptedByWord.get(row.word_id) ?? []
      list.push(row.answer)
      acceptedByWord.set(row.word_id, list)
    }

    const words = new Map(
      ((wordsResponse.data ?? []) as WordRowWithDetails[]).map((row) => [
        row.id,
        toWord(row, acceptedByWord.get(row.id) ?? []),
      ])
    )

    const states = new Map<string, UserWordState>(
      (statesResponse.data ?? []).map((row) => [row.word_id, toUserWordState(row)])
    )
    const firstLatency = new Map<string, number | null>(
      (statesResponse.data ?? []).map((row) => [row.word_id, row.first_latency_ms])
    )

    const alreadyStored = new Set(
      (existingResponse.data ?? []).map((row) => row.client_event_id)
    )

    const results: AttemptResult[] = []
    const eventRows: Array<Record<string, unknown>> = []
    const wordUpdates = new Map<string, ReturnType<typeof toUserWordUpdate>>()
    let combo = 0
    const days = new Set<string>()

    for (const attempt of attempts) {
      const word = words.get(attempt.wordId)
      if (!word) continue

      const state = states.get(attempt.wordId) ?? initialWordState(attempt.wordId)
      const expected = expectedAnswersFor(word, attempt.exerciseType)

      const evaluation = evaluateAnswer(attempt.submittedAnswer, {
        expected: expected.primary,
        accepted: expected.accepted,
      })
      const wasCorrect = !attempt.revealed && isAcceptedVerdict(evaluation.verdict)
      const isSpellingSlip = evaluation.verdict === 'spelling'

      // Classify first so the combo counter is correct before XP is awarded.
      const band = classifyRecall({
        latencyMs: attempt.latencyMs,
        wasCorrect,
        hintLevel: attempt.hintLevel,
        revealed: attempt.revealed,
      })
      combo = nextCombo(combo, band)

      const outcome: AttemptOutcome = gradeAttempt({
        state,
        now: new Date(),
        day: attempt.localDay,
        latencyMs: attempt.latencyMs,
        hintLevel: attempt.hintLevel,
        submittedAnswer: attempt.submittedAnswer,
        wasCorrect,
        isSpellingSlip,
        revealed: attempt.revealed,
        comboLength: combo,
        random: attempt.fuzz,
      })

      states.set(attempt.wordId, outcome.nextState)
      days.add(attempt.localDay)

      wordUpdates.set(
        attempt.wordId,
        toUserWordUpdate(
          user.id,
          outcome.nextState,
          firstLatency.get(attempt.wordId) ?? attempt.latencyMs
        )
      )

      if (!alreadyStored.has(attempt.clientEventId)) {
        eventRows.push({
          user_id: user.id,
          word_id: attempt.wordId,
          session_id: sessionId,
          exercise_type: attempt.exerciseType,
          prompt_ref: attempt.promptRef,
          submitted_answer: attempt.submittedAnswer.slice(0, 200),
          was_correct: wasCorrect,
          is_spelling_slip: isSpellingSlip,
          latency_ms: attempt.latencyMs,
          hint_level: attempt.hintLevel,
          recall_band: outcome.band,
          mastery_before: outcome.masteryBefore,
          mastery_after: outcome.masteryAfter,
          scheduled_before: state.nextReviewAt,
          scheduled_after: outcome.nextReviewAt,
          xp_awarded: outcome.xp,
          word_activated: outcome.justActivated,
          client_event_id: attempt.clientEventId,
          local_day: attempt.localDay,
        })
      }

      results.push({
        clientEventId: attempt.clientEventId,
        wordId: attempt.wordId,
        band: outcome.band,
        wasCorrect,
        isSpellingSlip,
        masteryAfter: outcome.masteryAfter,
        statusAfter: outcome.statusAfter,
        justActivated: outcome.justActivated,
        xp: outcome.xp,
      })
    }

    if (wordUpdates.size > 0) {
      const { error } = await supabase
        .from('user_words')
        .upsert([...wordUpdates.values()], { onConflict: 'user_id,word_id' })
      if (error) throw error
    }

    if (eventRows.length > 0) {
      const { error } = await supabase
        .from('review_events')
        // Ignore rows already stored by an earlier delivery of this batch.
        .upsert(eventRows as never, {
          onConflict: 'user_id,client_event_id',
          ignoreDuplicates: true,
        })
      if (error) throw error
    }

    for (const day of days) {
      await supabase.rpc('refresh_day_stats', { p_day: day })
    }

    return ok({ results })
  } catch (error) {
    logError('submitReviewBatch', error, { userId: user.id, attempts: attempts.length })
    return fail('We could not save those answers. They will be retried automatically.')
  }
}

/**
 * Closes a session and rolls up everything that depends on a finished day:
 * bonus XP, the streak, daily challenges and achievements.
 */
export async function completeSession(input: unknown): Promise<
  ActionResult<{ xpAwarded: number; unlocked: string[]; streak: number }>
> {
  const parsed = completeSessionSchema.safeParse(input)
  if (!parsed.success) return fail('That session could not be closed.')

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const { sessionId, durationMs, localDay } = parsed.data

  try {
    const { data: events, error: eventsError } = await supabase
      .from('review_events')
      .select('recall_band, hint_level, latency_ms, was_correct, xp_awarded, word_activated, exercise_type')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
    if (eventsError) throw eventsError

    const rows = events ?? []
    const correct = rows.filter((row) => row.was_correct).length
    const fast = rows.filter((row) => row.recall_band === 'instant' || row.recall_band === 'good').length
    const slow = rows.filter((row) => row.recall_band === 'slow' || row.recall_band === 'fragile').length
    const missed = rows.filter((row) => row.recall_band === 'failed').length
    const hints = rows.filter((row) => row.hint_level > 0).length
    const activated = rows.filter((row) => row.word_activated).length
    const correctLatencies = rows.filter((row) => row.was_correct).map((row) => row.latency_ms)
    const avgLatency =
      correctLatencies.length > 0
        ? Math.round(correctLatencies.reduce((a, b) => a + b, 0) / correctLatencies.length)
        : null

    const { data: settings } = await supabase
      .from('user_settings')
      .select('daily_goal_minutes')
      .eq('user_id', user.id)
      .maybeSingle()

    const goalMinutes = settings?.daily_goal_minutes ?? 10
    const { data: dayStats } = await supabase
      .from('daily_stats')
      .select('seconds_trained, reviews')
      .eq('user_id', user.id)
      .eq('day', localDay)
      .maybeSingle()

    const secondsToday = (dayStats?.seconds_trained ?? 0) + Math.round(durationMs / 1000)
    const goalMet = secondsToday >= goalMinutes * 60

    let bonusXp = rows.length > 0 ? XP.sessionCompleteBonus : 0
    bonusXp += activated * XP.wordActivatedBonus
    if (goalMet) bonusXp += XP.dailyGoalBonus

    const { error: sessionError } = await supabase
      .from('training_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
        item_count: rows.length,
        correct_count: correct,
        fast_count: fast,
        slow_count: slow,
        missed_count: missed,
        hint_count: hints,
        avg_latency_ms: avgLatency,
        words_activated: activated,
        bonus_xp: bonusXp,
        xp_earned: bonusXp + rows.reduce((total, row) => total + row.xp_awarded, 0),
        local_day: localDay,
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)
    if (sessionError) throw sessionError

    await supabase.rpc('refresh_day_stats', { p_day: localDay })

    const streak = await updateStreak(user.id, localDay)
    await syncChallenges(user.id, localDay)
    const unlocked = await syncAchievements(user.id)
    await supabase.rpc('refresh_user_totals')

    revalidatePath('/home')
    revalidatePath('/progress')

    return ok({ xpAwarded: bonusXp, unlocked, streak })
  } catch (error) {
    logError('completeSession', error, { userId: user.id })
    return fail('Your answers were saved, but the summary could not be finished.')
  }
}

/** Adds a learner-specific synonym for one word. Never changes the dictionary. */
export async function acceptMyAnswer(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = acceptAnswerSchema.safeParse(input)
  if (!parsed.success) return fail('That answer could not be added.')

  const user = await requireUser()
  const supabase = await createServerSupabase()

  const { error } = await supabase.from('user_accepted_answers').insert({
    user_id: user.id,
    word_id: parsed.data.wordId,
    answer: parsed.data.answer.toLowerCase(),
  })

  // A duplicate simply means it is already accepted.
  if (error && error.code !== '23505') {
    logError('acceptMyAnswer', error, { userId: user.id })
    return fail('We could not add that answer.')
  }
  return ok(undefined)
}

export async function abandonSession(sessionId: string): Promise<ActionResult<undefined>> {
  if (!uuidSchema.safeParse(sessionId).success) return fail('Unknown session.')
  const user = await requireUser()
  const supabase = await createServerSupabase()

  // A session left halfway keeps its reviews; only the roll-up is skipped.
  const { error } = await supabase
    .from('training_sessions')
    .update({ completed_at: null })
    .eq('id', sessionId)
    .eq('user_id', user.id)

  if (error) logError('abandonSession', error, { userId: user.id })
  return ok(undefined)
}

// --------------------------------------------------------------------------

function expectedAnswersFor(
  word: ReturnType<typeof toWord>,
  exerciseType: string
): { primary: string; accepted: string[] } {
  if (exerciseType === 'collocation') {
    const answers = word.collocations
      .map((c) => collocationAnswer(c.collocation, c.pattern))
      .filter((value): value is string => value !== null)
    if (answers.length > 0) {
      return { primary: answers[0] ?? word.primaryAnswer, accepted: answers }
    }
  }
  if (exerciseType === 'word_family') {
    const forms = word.family.map((member) => member.form)
    if (forms.length > 0) {
      return { primary: forms[0] ?? word.primaryAnswer, accepted: forms }
    }
  }
  return { primary: word.primaryAnswer, accepted: word.acceptedAnswers }
}

async function updateStreak(userId: string, localDay: string): Promise<number> {
  const supabase = await createServerSupabase()
  const [{ data: progress }, { data: stats }] = await Promise.all([
    supabase
      .from('user_progress')
      .select('current_streak, longest_streak, last_active_day, streak_freezes')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('daily_stats')
      .select('reviews')
      .eq('user_id', userId)
      .eq('day', localDay)
      .maybeSingle(),
  ])

  if (!progress) return 0
  if ((stats?.reviews ?? 0) < STREAK.minReviewsForDay) return progress.current_streak

  const next = applyTrainingDay(
    {
      currentStreak: progress.current_streak,
      longestStreak: progress.longest_streak,
      lastActiveDay: progress.last_active_day,
      freezes: progress.streak_freezes,
    },
    localDay
  )

  if (!next.extended) return progress.current_streak

  await supabase
    .from('user_progress')
    .update({
      current_streak: next.currentStreak,
      longest_streak: next.longestStreak,
      last_active_day: next.lastActiveDay,
      streak_freezes: next.freezes,
    })
    .eq('user_id', userId)
    // Idempotent: a repeated call for the same day changes nothing.
    .neq('last_active_day', localDay)

  return next.currentStreak
}

async function syncChallenges(userId: string, localDay: string): Promise<void> {
  const supabase = await createServerSupabase()
  const [{ data: events }, { data: stats }] = await Promise.all([
    supabase
      .from('review_events')
      .select('recall_band, hint_level, exercise_type, mastery_before, was_correct')
      .eq('user_id', userId)
      .eq('local_day', localDay),
    supabase
      .from('daily_stats')
      .select('seconds_trained, reviews')
      .eq('user_id', userId)
      .eq('day', localDay)
      .maybeSingle(),
  ])

  const rows = events ?? []
  const progress = {
    fastRecalls: rows.filter((row) => row.recall_band === 'instant').length,
    noHintReviews: rows.filter((row) => row.hint_level === 0).length,
    weakRecovered: rows.filter((row) => row.was_correct && row.mastery_before < 50).length,
    collocationReviews: rows.filter((row) => row.exercise_type === 'collocation').length,
    reviews: stats?.reviews ?? rows.length,
    minutes: Math.round((stats?.seconds_trained ?? 0) / 60),
  }

  const definitions = challengesForDay(userId, localDay)
  const evaluated = evaluateChallenges(definitions, progress)

  await supabase.rpc('sync_daily_challenges', {
    p_day: localDay,
    p_rows: evaluated.map((challenge) => ({
      code: challenge.code,
      target: challenge.target,
      progress: Math.round(challenge.progress * challenge.target),
      completed: challenge.completed,
      xp: challenge.xp,
    })),
  })
}

async function syncAchievements(userId: string): Promise<string[]> {
  const supabase = await createServerSupabase()
  const context = await buildAchievementContext(userId)
  const { data: owned } = await supabase
    .from('user_achievements')
    .select('achievement_code')
    .eq('user_id', userId)

  const codes = newlyUnlocked(
    context,
    (owned ?? []).map((row) => row.achievement_code)
  )
  if (codes.length === 0) return []

  const valid = codes.filter((code) => ACHIEVEMENTS.some((a) => a.code === code))
  const { data } = await supabase.rpc('unlock_achievements', { p_codes: valid })
  return (data as string[] | null) ?? valid
}

/** Every achievement value is recomputed from stored data, never incremented. */
export async function buildAchievementContext(userId: string) {
  const supabase = await createServerSupabase()

  const [
    sessions,
    reviews,
    instant,
    noHint,
    active,
    custom,
    challenges,
    recovered,
    progress,
    earliest,
    latest,
  ] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase.from('review_events').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('review_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('recall_band', 'instant'),
    supabase
      .from('review_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('hint_level', 0),
    supabase
      .from('user_words')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active'),
    supabase
      .from('words')
      .select('id', { count: 'exact', head: true })
      .eq('created_by', userId),
    supabase
      .from('user_daily_challenges')
      .select('challenge_code', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase.rpc('recovered_word_count'),
    supabase
      .from('user_progress')
      .select('current_streak, longest_streak, xp')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('daily_stats')
      .select('avg_latency_ms')
      .eq('user_id', userId)
      .not('avg_latency_ms', 'is', null)
      .order('day', { ascending: true })
      .limit(3),
    supabase
      .from('daily_stats')
      .select('avg_latency_ms')
      .eq('user_id', userId)
      .not('avg_latency_ms', 'is', null)
      .order('day', { ascending: false })
      .limit(3),
  ])

  const average = (rows: Array<{ avg_latency_ms: number | null }> | null) => {
    const values = (rows ?? []).map((row) => row.avg_latency_ms).filter((v): v is number => v != null)
    if (values.length === 0) return null
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }

  return {
    sessionsCompleted: sessions.count ?? 0,
    totalReviews: reviews.count ?? 0,
    instantRecalls: instant.count ?? 0,
    activeWords: active.count ?? 0,
    currentStreak: progress.data?.current_streak ?? 0,
    longestStreak: progress.data?.longest_streak ?? 0,
    recoveredWords: (recovered.data as number | null) ?? 0,
    baselineAvgLatencyMs: average(earliest.data),
    currentAvgLatencyMs: average(latest.data),
    noHintReviews: noHint.count ?? 0,
    customWords: custom.count ?? 0,
    challengesCompleted: challenges.count ?? 0,
    level: 1,
  }
}
