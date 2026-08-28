import { expect, type Page } from '@playwright/test'

/**
 * The full journey tests need a real Supabase project, so they are skipped
 * unless one is configured. The public journey (landing, demo, legal pages)
 * always runs.
 */
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
)

export function uniqueEmail(): string {
  return `verba-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
}

export const TEST_PASSWORD = 'verba-e2e-password-2026'

export interface TestAccount {
  email: string
  password: string
}

/**
 * Signs up and lands on onboarding.
 *
 * Requires "Confirm email" to be OFF in the Supabase project used for testing,
 * which is the documented configuration for a test project.
 */
export async function signUp(page: Page): Promise<TestAccount> {
  const account = { email: uniqueEmail(), password: TEST_PASSWORD }

  await page.goto('/signup')
  await page.getByLabel('Name').fill('Test Learner')
  await page.getByLabel('Email').fill(account.email)
  await page.getByLabel('Password').fill(account.password)
  await page.getByRole('button', { name: 'Create account' }).click()

  await page.waitForURL('**/onboarding', { timeout: 30_000 })
  return account
}

export async function signIn(page: Page, account: TestAccount): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email').fill(account.email)
  await page.getByLabel('Password').fill(account.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 })
}

export async function signOut(page: Page): Promise<void> {
  await page.goto('/profile')
  await page.getByRole('button', { name: 'Log out' }).click()
  await page.waitForURL('**/', { timeout: 30_000 })
}

/** Walks the four preference steps and the diagnostic, ending on the result. */
export async function completeOnboarding(page: Page): Promise<void> {
  await page.getByRole('radio', { name: /Both/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('radio', { name: /^B1/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('checkbox', { name: 'Conversation' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByRole('radio', { name: '10 min' }).click()
  await page.getByRole('button', { name: 'Start the test' }).click()

  await expect(page.getByRole('button', { name: 'I cannot recall it' })).toBeVisible({
    timeout: 45_000,
  })

  // Skip through the test; the point here is that the flow completes and
  // produces a real result, not that the answers are right.
  for (let index = 0; index < 40; index += 1) {
    const skip = page.getByRole('button', { name: 'I cannot recall it' })
    if (!(await skip.isVisible().catch(() => false))) break
    await skip.click()
  }

  await expect(page.getByRole('button', { name: 'Start your first session' })).toBeVisible({
    timeout: 45_000,
  })
}

/** Answers one training question and returns to the question phase. */
export async function answerQuestion(page: Page, answer: string): Promise<void> {
  const input = page.getByLabel('Your answer in English')
  await input.fill(answer)
  await page.getByRole('button', { name: 'Check' }).click()
}
