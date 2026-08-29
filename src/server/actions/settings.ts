'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { isValidTimeZone } from '@/domain/learning'
import { logError } from '@/lib/logger'
import { fail, GENERIC_ERROR, ok, type ActionResult } from '@/lib/result'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'
import { settingsSchema } from '@/lib/validation'
import type { TablesUpdate } from '@/types/database'

export async function updateSettings(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return fail(issue?.message ?? 'Check those settings.', issue?.path[0]?.toString())
  }

  const user = await requireUser()
  const supabase = await createServerSupabase()
  const data = parsed.data

  try {
    const settingsUpdate: Partial<TablesUpdate<'user_settings'>> = {}
    if (data.dailyGoalMinutes !== undefined) settingsUpdate.daily_goal_minutes = data.dailyGoalMinutes
    if (data.declaredLevel !== undefined) settingsUpdate.declared_level = data.declaredLevel
    if (data.inputMode !== undefined) settingsUpdate.input_mode = data.inputMode
    if (data.englishVariety !== undefined) settingsUpdate.english_variety = data.englishVariety
    if (data.soundEnabled !== undefined) settingsUpdate.sound_enabled = data.soundEnabled
    if (data.hapticsEnabled !== undefined) settingsUpdate.haptics_enabled = data.hapticsEnabled
    if (data.theme !== undefined) settingsUpdate.theme = data.theme
    if (data.reminderEnabled !== undefined) settingsUpdate.reminder_enabled = data.reminderEnabled
    if (data.reminderTime !== undefined) settingsUpdate.reminder_time = data.reminderTime

    if (Object.keys(settingsUpdate).length > 0) {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, ...settingsUpdate }, { onConflict: 'user_id' })
      if (error) throw error
    }

    const profileUpdate: { display_name?: string | null; time_zone?: string } = {}
    if (data.displayName !== undefined) {
      profileUpdate.display_name = data.displayName.trim() || null
    }
    if (data.timeZone !== undefined && isValidTimeZone(data.timeZone)) {
      profileUpdate.time_zone = data.timeZone
    }
    if (Object.keys(profileUpdate).length > 0) {
      const { error } = await supabase.from('profiles').update(profileUpdate).eq('id', user.id)
      if (error) throw error
    }

    revalidatePath('/profile')
    revalidatePath('/home')
    return ok(undefined)
  } catch (error) {
    logError('updateSettings', error, { userId: user.id })
    return fail(GENERIC_ERROR)
  }
}

/**
 * Permanent account removal.
 *
 * Deleting the auth user cascades through every table that references the
 * profile, so no rows are left behind pointing at a user that no longer
 * exists.
 */
export async function deleteAccount(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = z.object({ confirmation: z.literal('DELETE') }).safeParse(input)
  if (!parsed.success) return fail('Type DELETE to confirm.', 'confirmation')

  const user = await requireUser()
  const supabase = await createServerSupabase()

  const { error } = await supabase.rpc('delete_my_account')
  if (error) {
    logError('deleteAccount', error, { userId: user.id })
    return fail('We could not delete your account. Please try again.')
  }

  await supabase.auth.signOut()
  redirect('/?deleted=1')
}
