/**
 * Smoke check: the Words list pages correctly, and changing a filter starts
 * again from the first page.
 *
 *   node scripts/smoke/pagination.mjs
 */
import { chromium } from '@playwright/test'
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {}
)
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const p = await ctx.newPage()
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000'
const email = `page-${Date.now()}@example.com`
const fails = []

await p.goto(`${base}/signup`)
await p.getByLabel('Name').fill('Pager')
await p.getByLabel('Email').fill(email)
await p.getByLabel('Password').fill('pager-password-2026')
await p.getByRole('button', { name: 'Create account' }).click()
await p.waitForURL('**/onboarding', { timeout: 30000 })
await p.getByRole('radio', { name: /Both/ }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('radio', { name: /^B1/ }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('checkbox', { name: 'Conversation' }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('radio', { name: /^5 min/ }).click()
await p.getByRole('button', { name: 'Start the test' }).click()
await p.getByRole('button', { name: 'I cannot recall it' }).waitFor({ timeout: 45000 })
for (let i = 0; i < 40; i++) {
  const skip = p.getByRole('button', { name: 'I cannot recall it' })
  if (!(await skip.isVisible().catch(() => false))) break
  await skip.click()
}
await p.waitForURL('**/onboarding/result', { timeout: 45000 })

const list = p.getByRole('list', { name: 'Your words' })
const firstRow = async () => (await list.getByRole('listitem').first().innerText()).split('\n')[0].trim()

await p.goto(`${base}/words`)
await list.waitFor({ timeout: 15000 })
const rowsOne = await list.getByRole('listitem').count()
const lemmaOne = await firstRow()
console.warn('page 1:', rowsOne, 'rows, first =', lemmaOne)
if (rowsOne !== 30) fails.push(`expected 30 rows on page 1, got ${rowsOne}`)

await p.goto(`${base}/words?page=2`)
await list.waitFor({ timeout: 15000 })
const rowsTwo = await list.getByRole('listitem').count()
const lemmaTwo = await firstRow()
console.warn('page 2:', rowsTwo, 'rows, first =', lemmaTwo)
if (rowsTwo === 0) fails.push('page 2 was empty')
if (lemmaOne === lemmaTwo) fails.push('page 2 repeated page 1')

await p.getByRole('link', { name: 'Previous' }).click()
await p.waitForURL((url) => !url.search.includes('page='), { timeout: 15000 })
await list.waitFor({ timeout: 15000 })
if ((await firstRow()) !== lemmaOne) fails.push('previous did not return to page 1')

await p.goto(`${base}/words?page=2`)
await list.waitFor({ timeout: 15000 })
await p.getByRole('button', { name: 'Weak' }).click()
await p.waitForTimeout(1200)
if (p.url().includes('page=')) fails.push(`filter change kept the page: ${p.url()}`)

console.warn(fails.length === 0 ? '\nPAGINATION OK' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
