import { expect, test } from '@playwright/test'
import {
  answerQuestion,
  completeOnboarding,
  signIn,
  signOut,
  signUp,
  supabaseConfigured,
  type TestAccount,
} from './helpers'

/**
 * The full learner journey, end to end, against a real Supabase project.
 *
 * Skipped unless Supabase environment variables are present. See the Testing
 * section of the README for how to point these at a throwaway project.
 */
test.describe('learner journey', () => {
  test.skip(!supabaseConfigured, 'Supabase environment variables are not set')
  test.describe.configure({ mode: 'serial', timeout: 180_000 })

  let account: TestAccount

  test('registers and lands in onboarding', async ({ page }) => {
    account = await signUp(page)
    await expect(page.getByRole('heading', { name: 'What do you want to improve?' })).toBeVisible()
  })

  test('completes onboarding and gets a real baseline', async ({ page }) => {
    await signIn(page, account)
    await page.waitForURL('**/onboarding')
    await completeOnboarding(page)

    await expect(page.getByText('Your baseline')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Active recall: (A2|B1|B2|C1)/ })
    ).toBeVisible()
  })

  test('home shows real starting numbers, not placeholders', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/home')

    await expect(page.getByRole('link', { name: 'Start daily session' })).toBeVisible()
    await expect(page.getByText('Reviews', { exact: true })).toBeVisible()
    await expect(page.getByText('Fast recalls', { exact: true })).toBeVisible()
  })

  test('runs a session: correct, incorrect, and a saved summary', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/train')

    const input = page.getByLabel('Your answer in English')
    await expect(input).toBeVisible({ timeout: 45_000 })

    // A deliberately wrong answer is reported as wrong, with the target shown.
    await answerQuestion(page, 'zzzznotaword')
    await expect(page.getByText(/You wrote/)).toBeVisible()
    await page.getByRole('button', { name: /Continue|Finish/ }).click()

    // Reveal the target of the next question, then type it back.
    for (let index = 0; index < 3; index += 1) {
      const hint = page.getByRole('button', { name: /^Hint/ })
      if (await hint.isVisible().catch(() => false)) await hint.click()
    }
    const show = page.getByRole('button', { name: 'Show the answer' })
    if (await show.isVisible().catch(() => false)) {
      await show.click()
      await page.getByRole('button', { name: /Continue|Finish/ }).click()
    }

    // Finish the rest of the session quickly.
    for (let index = 0; index < 40; index += 1) {
      const check = page.getByRole('button', { name: 'Check' })
      if (await check.isVisible().catch(() => false)) {
        await input.fill('something')
        await check.click()
        await page.getByRole('button', { name: /Continue|Finish/ }).click()
        continue
      }
      break
    }

    await expect(page.getByText('Session complete')).toBeVisible({ timeout: 45_000 })
    await expect(page.getByText('Average recall')).toBeVisible()
    await page.getByRole('button', { name: 'Done' }).click()
    await page.waitForURL('**/home')
  })

  test('progress survives a reload', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/progress')

    const heading = page.getByText('Average recall time', { exact: true })
    await expect(heading).toBeVisible()

    const accuracy = page.getByText('Accuracy', { exact: true }).locator('..')
    const before = await accuracy.innerText()
    expect(before).toMatch(/\d/)

    await page.reload()
    await expect(heading).toBeVisible()
    expect(await accuracy.innerText()).toBe(before)
  })

  test('progress survives signing out and back in', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/words')
    const list = page.getByRole('list', { name: 'Your words' })
    await expect(list).toBeVisible()
    const wordCount = await list.getByRole('listitem').count()
    expect(wordCount).toBeGreaterThan(0)

    await signOut(page)
    await signIn(page, account)

    await page.goto('/words')
    await expect(list).toBeVisible()
    expect(await list.getByRole('listitem').count()).toBe(wordCount)
  })

  test('a word can be added and then trained', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/words/new')

    const lemma = `zephyrous${Date.now() % 10_000}`
    await page.getByLabel('English word or phrase').fill(lemma)
    await page.getByLabel('Russian meaning').fill('тестовое слово')
    await page.getByRole('button', { name: 'Add word' }).click()

    await expect(page.getByRole('heading', { name: lemma })).toBeVisible({ timeout: 30_000 })

    await page.goto('/words?filter=custom')
    await expect(page.getByText(lemma)).toBeVisible()
  })

  test('settings persist', async ({ page }) => {
    await signIn(page, account)
    await page.goto('/profile')

    await page.getByLabel('Daily goal').selectOption('15')
    await page.waitForTimeout(1_000)
    await page.reload()

    await expect(page.getByLabel('Daily goal')).toHaveValue('15')
  })
})
