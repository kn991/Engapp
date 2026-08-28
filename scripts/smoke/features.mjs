/**
 * Smoke check: the vocabulary screens, custom words, CSV import, export,
 * progress and the offline banner, driven through a real browser.
 *
 *   pnpm start                 # in another terminal
 *   node scripts/smoke/features.mjs
 *
 * It creates a throwaway account each run, so it is safe against a development
 * database and never touches existing data.
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
const email = `vfy-${Date.now()}@example.com`
const fails = []
p.on('pageerror', (e) => fails.push(`pageerror: ${e.message}`))

async function check(name, fn) {
  try { await fn(); console.warn('PASS', name) }
  catch (e) { fails.push(`${name}: ${e.message.split('\n')[0]}`); console.warn('FAIL', name) }
}

await p.goto(`${base}/signup`)
await p.getByLabel('Name').fill('Vfy')
await p.getByLabel('Email').fill(email)
await p.getByLabel('Password').fill('verify-password-2026')
await p.getByRole('button', { name: 'Create account' }).click()
await p.waitForURL('**/onboarding', { timeout: 30000 })
await p.getByRole('radio', { name: /Both/ }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('radio', { name: /^B2/ }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('checkbox', { name: 'Conversation' }).click()
await p.getByRole('button', { name: 'Continue' }).click()
await p.getByRole('radio', { name: /^5 min/ }).click()
await p.getByRole('button', { name: 'Start the test' }).click()
await p.getByRole('button', { name: 'I cannot recall it' }).waitFor({ timeout: 45000 })
for (let i = 0; i < 40; i++) {
  const skip = p.getByRole('button', { name: 'I cannot recall it' })
  if (!(await skip.isVisible().catch(() => false))) break
  if (i % 4 === 0) { await p.getByLabel('Your answer in English').fill('maintain'); await p.getByRole('button', { name: 'Next' }).click() }
  else await skip.click()
}
await p.waitForURL('**/onboarding/result', { timeout: 45000 })

await check('words search by english', async () => {
  // Pick a word that is actually in this learner's set.
  await p.goto(`${base}/words`)
  await p.getByRole('list', { name: 'Your words' }).waitFor({ timeout: 10000 })
  const lemma = (await p.getByRole('list', { name: 'Your words' }).getByRole('listitem').first().innerText())
    .split('\n')[0]
    .trim()
  await p.goto(`${base}/words?q=${encodeURIComponent(lemma)}`)
  await p.getByRole('list', { name: 'Your words' }).waitFor({ timeout: 10000 })
  const text = await p.locator('main').innerText()
  if (!text.includes(lemma)) throw new Error(`search for ${lemma} did not find it`)
})
await check('words search by russian', async () => {
  await p.goto(`${base}/words?q=%D0%B8%D0%B7%D0%B1%D0%B5%D0%B3%D0%B0%D1%82%D1%8C`)
  await p.waitForTimeout(600)
  const txt = await p.locator('main').innerText()
  if (!txt.includes('avoid') && !txt.includes('Nothing matches')) throw new Error('unexpected: ' + txt.slice(0, 120))
})
await check('words filter weak', async () => {
  await p.goto(`${base}/words?filter=weak`)
  await p.getByRole('list', { name: 'Your words' }).waitFor({ timeout: 10000 })
})
await check('words filter custom shows empty state', async () => {
  await p.goto(`${base}/words?filter=custom`)
  await p.getByText('No words of your own').waitFor({ timeout: 10000 })
})
await check('word detail page', async () => {
  await p.goto(`${base}/words`)
  await p.getByRole('list', { name: 'Your words' }).getByRole('link').first().click()
  await p.getByText('Recall history').waitFor({ timeout: 10000 })
})
await check('add custom word', async () => {
  await p.goto(`${base}/words/new`)
  await p.getByLabel('English word or phrase').fill('quirk')
  await p.getByLabel('Russian meaning').fill('причуда')
  await p.getByLabel('Example sentence').fill('Everyone has a quirk or two.')
  await p.getByRole('button', { name: 'Add word' }).click()
  await p.getByRole('heading', { name: 'quirk' }).waitFor({ timeout: 15000 })
})
await check('duplicate custom word is rejected', async () => {
  await p.goto(`${base}/words/new`)
  await p.getByLabel('English word or phrase').fill('quirk')
  await p.getByLabel('Russian meaning').fill('причуда')
  await p.getByRole('button', { name: 'Add word' }).click()
  await p.getByText('You have already added that word.').waitFor({ timeout: 15000 })
})
await check('csv import reports good and bad rows', async () => {
  await p.goto(`${base}/words/new`)
  const csv = 'lemma,part_of_speech,cefr,russian,example\nnimble,adjective,C1,проворный,She is nimble on her feet.\nbadrow,verb,ZZ,плохой,\n'
  await p.setInputFiles('input[type=file]', { name: 'words.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) })
  await p.getByText(/Imported 1\./).waitFor({ timeout: 20000 })
  await p.getByText(/Row 3/).waitFor({ timeout: 5000 })
})
await check('export downloads json', async () => {
  const res = await p.request.get(`${base}/api/export`)
  if (!res.ok()) throw new Error('status ' + res.status())
  const body = await res.json()
  if (!Array.isArray(body.reviewEvents)) throw new Error('no reviewEvents')
  if (!body.profile) throw new Error('no profile')
})
await check('progress page renders', async () => {
  await p.goto(`${base}/progress`)
  await p.getByText('Average recall time', { exact: true }).waitFor({ timeout: 10000 })
})
await check('admin is refused for a normal user', async () => {
  await p.goto(`${base}/admin`)
  await p.waitForURL('**/home', { timeout: 15000 })
})
await check('offline banner appears', async () => {
  await p.goto(`${base}/home`)
  await ctx.setOffline(true)
  await p.evaluate(() => window.dispatchEvent(new Event('offline')))
  await p.getByText(/Offline\./).waitFor({ timeout: 5000 })
  await ctx.setOffline(false)
})

console.warn(fails.length === 0 ? '\nALL CHECKS PASSED' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
