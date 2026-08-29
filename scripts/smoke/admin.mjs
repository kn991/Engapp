/**
 * Smoke check: the admin panel. Creates a throwaway account, promotes it with
 * the same SQL the README documents, then exercises the list, filters, the
 * editor and the CSV import.
 *
 *   node scripts/smoke/admin.mjs
 *
 * Requires the local Supabase stack, because promoting the account needs
 * database access.
 */
import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {}
)
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000'
const email = `admin-${Date.now()}@example.com`
const password = 'admin-password-2026'
const lemma = `ponder${Date.now() % 100000}`
const fails = []
p.on('pageerror', (e) => fails.push(`pageerror: ${e.message}`))

async function check(name, fn) {
  try { await fn(); console.warn('PASS', name) }
  catch (e) { fails.push(`${name}: ${e.message.split('\n')[0]}`); console.warn('FAIL', name) }
}

await p.goto(`${base}/signup`)
await p.getByLabel('Name').fill('Admin')
await p.getByLabel('Email').fill(email)
await p.getByLabel('Password').fill(password)
await p.getByRole('button', { name: 'Create account' }).click()
await p.waitForURL('**/onboarding', { timeout: 30000 })

// Appoint the administrator exactly the way the README documents.
execSync(
  `docker exec supabase_db_verba psql -U postgres -d postgres -c "update public.profiles set is_admin = true where id = (select id from auth.users where email = '${email}');"`,
  { stdio: 'pipe' }
)

await check('admin list loads', async () => {
  await p.goto(`${base}/admin`)
  await p.getByRole('heading', { name: 'Curated vocabulary' }).waitFor({ timeout: 15000 })
})
await check('admin search filters', async () => {
  await p.goto(`${base}/admin?q=avoid`)
  await p.getByText('avoid', { exact: true }).first().waitFor({ timeout: 10000 })
})
await check('admin cefr filter', async () => {
  await p.goto(`${base}/admin?cefr=C1`)
  await p.waitForTimeout(700)
  const rows = await p.getByRole('listitem').count()
  if (rows === 0) throw new Error('no C1 words')
})
await check('admin creates a curated word', async () => {
  await p.goto(`${base}/admin/words/new`)
  await p.getByLabel('Lemma').fill(lemma)
  await p.getByLabel('Russian').fill('размышлять')
  await p.getByLabel('English definition').fill('to think about something carefully')
  await p.getByLabel('Example 1 sentence').fill('She pondered the offer for a week.')
  await p.getByRole('button', { name: 'Save word' }).click()
  await p.waitForURL('**/admin', { timeout: 20000 })
  await p.goto(`${base}/admin?q=${lemma}`)
  await p.getByText(lemma, { exact: true }).first().waitFor({ timeout: 10000 })
})
await check('admin edits and archives', async () => {
  await p.goto(`${base}/admin?q=${lemma}`)
  await p.getByRole('link', { name: new RegExp(lemma) }).first().click()
  await p.getByLabel('Russian').fill('размышлять, обдумывать')
  await p.getByRole('button', { name: 'Save word' }).click()
  await p.waitForURL('**/admin', { timeout: 20000 })
  await p.goto(`${base}/admin?q=${lemma}`)
  await p.getByRole('button', { name: 'Archive' }).first().click()
  await p.getByText('Nothing matches').waitFor({ timeout: 15000 })
})
await check('admin csv import previews then commits', async () => {
  await p.goto(`${base}/admin/import`)
  const csv = [
    'lemma,part_of_speech,cefr,russian,definition,example',
    `wary${Date.now() % 100000},adjective,C1,настороженный,careful because of possible danger,He was wary of strangers.`,
    'avoid,verb,B1,избегать,,',
    'oops,verb,QQ,ошибка,,',
  ].join('\n')
  await p.setInputFiles('input[type=file]', { name: 'curated.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) })
  await p.getByRole('button', { name: /Import 1 words/ }).waitFor({ timeout: 20000 })
  const table = await p.locator('table').innerText()
  if (!table.includes('duplicate')) throw new Error('duplicate not detected')
  if (!table.includes('invalid')) throw new Error('invalid not detected')
  await p.getByRole('button', { name: /Import 1 words/ }).click()
  await p.getByText(/Imported 1 words/).waitFor({ timeout: 20000 })
})

console.warn(fails.length === 0 ? '\nALL ADMIN CHECKS PASSED' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
