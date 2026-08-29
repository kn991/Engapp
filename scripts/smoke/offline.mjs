/**
 * Smoke check: answers given with the network cut are stored locally, reach
 * the server once it returns, and are never counted twice.
 *
 *   node scripts/smoke/offline.mjs
 *
 * Requires the local Supabase stack so the check can count rows directly.
 */
import { chromium } from '@playwright/test'
import { execSync } from 'node:child_process'

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {}
)
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const p = await ctx.newPage()
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000'
const email = `off-${Date.now()}@example.com`
const fails = []

function sql(query) {
  return execSync(
    `docker exec supabase_db_verba psql -U postgres -d postgres -tAc "${query}"`,
    { stdio: 'pipe' }
  ).toString().trim()
}

async function check(name, fn) {
  try { await fn(); console.warn('PASS', name) }
  catch (e) { fails.push(`${name}: ${e.message.split('\n')[0]}`); console.warn('FAIL', name) }
}

await p.goto(`${base}/signup`)
await p.getByLabel('Name').fill('Off')
await p.getByLabel('Email').fill(email)
await p.getByLabel('Password').fill('offline-password-2026')
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

const userId = sql(`select id from auth.users where email = '${email}'`)

await check('answers given offline are stored locally and sync on reconnect', async () => {
  await p.goto(`${base}/train`)
  await p.getByLabel('Your answer in English').waitFor({ timeout: 45000 })

  const before = Number(sql(`select count(*) from public.review_events where user_id = '${userId}'`))

  await ctx.setOffline(true)
  for (let i = 0; i < 5; i += 1) {
    await p.getByLabel('Your answer in English').fill(`offline${i}`)
    await p.getByRole('button', { name: 'Check' }).click()
    await p.getByRole('button', { name: /Continue|Finish/ }).click()
  }
  await p.waitForTimeout(1500)

  const during = Number(sql(`select count(*) from public.review_events where user_id = '${userId}'`))
  if (during !== before) throw new Error(`events reached the server while offline: ${before} -> ${during}`)

  const queued = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const request = indexedDB.open('verba', 1)
        request.onsuccess = () => {
          const db = request.result
          const count = db.transaction('pending-reviews').objectStore('pending-reviews').count()
          count.onsuccess = () => resolve(count.result)
          count.onerror = () => resolve(-1)
        }
        request.onerror = () => resolve(-1)
      })
  )
  if (queued < 5) throw new Error(`expected 5 queued answers, found ${queued}`)

  await ctx.setOffline(false)
  await p.evaluate(() => window.dispatchEvent(new Event('online')))

  let after = before
  for (let attempt = 0; attempt < 25 && after < before + 5; attempt += 1) {
    await p.waitForTimeout(500)
    after = Number(sql(`select count(*) from public.review_events where user_id = '${userId}'`))
  }
  if (after < before + 5) throw new Error(`only ${after - before} of 5 answers synced`)
})

await check('a replayed batch is not counted twice', async () => {
  const total = Number(sql(`select count(*) from public.review_events where user_id = '${userId}'`))
  const distinct = Number(
    sql(`select count(distinct client_event_id) from public.review_events where user_id = '${userId}'`)
  )
  if (total !== distinct) throw new Error(`${total} events but ${distinct} distinct ids`)
})

await check('the outbox is emptied once answers are accepted', async () => {
  const left = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const request = indexedDB.open('verba', 1)
        request.onsuccess = () => {
          const db = request.result
          const count = db.transaction('pending-reviews').objectStore('pending-reviews').count()
          count.onsuccess = () => resolve(count.result)
          count.onerror = () => resolve(-1)
        }
        request.onerror = () => resolve(-1)
      })
  )
  if (left !== 0) throw new Error(`outbox still holds ${left} answers`)
})

console.warn(fails.length === 0 ? '\nALL OFFLINE CHECKS PASSED' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
