'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { APP } from '@/config/app'
import { logError } from '@/lib/logger'
import { fail, ok, type ActionResult } from '@/lib/result'
import { createServerSupabase } from '@/lib/supabase/server'

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.')
const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Passwords can be at most 72 characters.')

const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
})

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().trim().max(60).optional(),
})

/** Absolute origin for auth redirect links, trusted from the request headers. */
async function getOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')

  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host')
  const proto = headerList.get('x-forwarded-proto') ?? 'https'
  if (host) return `${proto}://${host}`
  return APP.url
}

export async function signIn(input: unknown): Promise<ActionResult<{ next: string }>> {
  const parsed = credentialsSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return fail(issue?.message ?? 'Check your details.', issue?.path[0]?.toString())
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    // Deliberately vague: never reveal whether an address is registered.
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return fail('Confirm your email address first. Check your inbox for the link.')
    }
    return fail('That email and password do not match.')
  }

  const { data } = await supabase.from('profiles').select('onboarded_at').maybeSingle()
  return ok({ next: data?.onboarded_at ? '/home' : '/onboarding' })
}

export async function signUp(input: unknown): Promise<ActionResult<{ needsConfirmation: boolean }>> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return fail(issue?.message ?? 'Check your details.', issue?.path[0]?.toString())
  }

  const supabase = await createServerSupabase()
  const origin = await getOrigin()

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/onboarding`,
      data: parsed.data.displayName ? { display_name: parsed.data.displayName } : undefined,
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return fail('That email is already registered. Try signing in instead.', 'email')
    }
    if (error.message.toLowerCase().includes('password')) {
      return fail(error.message, 'password')
    }
    logError('signUp', error)
    return fail('We could not create that account. Please try again.')
  }

  // With confirmations on, Supabase returns a user but no session.
  const needsConfirmation = data.session === null
  return ok({ needsConfirmation })
}

export async function requestPasswordReset(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = z.object({ email: emailSchema }).safeParse(input)
  if (!parsed.success) return fail('Enter a valid email address.', 'email')

  const supabase = await createServerSupabase()
  const origin = await getOrigin()

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  })

  if (error) logError('requestPasswordReset', error)
  // Always report success so the form cannot be used to discover accounts.
  return ok(undefined)
}

export async function updatePassword(input: unknown): Promise<ActionResult<undefined>> {
  const parsed = z.object({ password: passwordSchema }).safeParse(input)
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? 'Choose a stronger password.', 'password')
  }

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return fail('That reset link has expired. Request a new one.')

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) {
    return fail(error.message)
  }
  return ok(undefined)
}

export async function signOut(): Promise<never> {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/')
}
