/**
 * Visual check across the viewports this app is designed for.
 *
 *   pnpm start                 # in another terminal, against a seeded database
 *   pnpm screenshots           # writes to shots/
 *
 * It signs up a throwaway account, walks onboarding and a short session, then
 * captures every screen at 390x844, 430x932 and 1440x900, reporting any page
 * that scrolls sideways.
 *
 * Set PLAYWRIGHT_CHROMIUM_PATH if your machine has Chromium somewhere other
 * than the Playwright download location.
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const OUT = 'shots'
mkdirSync(OUT, { recursive: true })

const base = process.env.SCREENSHOT_BASE_URL ?? 'http://127.0.0.1:3000'
const email = `shot-${Date.now()}@example.com`
const password = 'shot-password-2026'

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
const browser = await chromium.launch(executablePath ? { executablePath } : {})

async function page(width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: width < 800,
    hasTouch: width < 800,
  })
  return context
}

async function overflow(p) {
  return p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
}

// --- public pages at three sizes ---
for (const [w, h, tag] of [
  [390, 844, '390'],
  [430, 932, '430'],
  [1440, 900, '1440'],
]) {
  const ctx = await page(w, h)
  const p = await ctx.newPage()
  for (const [path, name] of [
    ['/', 'landing'],
    ['/login', 'login'],
    ['/privacy', 'privacy'],
  ]) {
    await p.goto(base + path, { waitUntil: 'networkidle' })
    await p.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: path === '/' })
    const o = await overflow(p)
    if (o > 1) console.log(`OVERFLOW ${path} @${tag}: ${o}px`)
  }
  await ctx.close()
}

// --- an authenticated account, screenshotted at 390 and 1440 ---
const setup = await page(390, 844)
const sp = await setup.newPage()
await sp.goto(`${base}/signup`)
await sp.getByLabel('Name').fill('Anna')
await sp.getByLabel('Email').fill(email)
await sp.getByLabel('Password').fill(password)
await sp.getByRole('button', { name: 'Create account' }).click()
await sp.waitForURL('**/onboarding', { timeout: 30000 })
await sp.screenshot({ path: `${OUT}/onboarding-step1-390.png` })

await sp.getByRole('radio', { name: /Both/ }).click()
await sp.getByRole('button', { name: 'Continue' }).click()
await sp.getByRole('radio', { name: /^B1/ }).click()
await sp.getByRole('button', { name: 'Continue' }).click()
await sp.getByRole('checkbox', { name: 'Conversation' }).click()
await sp.getByRole('button', { name: 'Continue' }).click()
await sp.getByRole('radio', { name: '10 min' }).click()
await sp.getByRole('button', { name: 'Start the test' }).click()
await sp.getByRole('button', { name: 'I cannot recall it' }).waitFor({ timeout: 45000 })
await sp.screenshot({ path: `${OUT}/diagnostic-390.png` })

const answers = { избегать: 'avoid', откладывать: 'postpone', колебаться: 'hesitate' }
for (let i = 0; i < 40; i += 1) {
  const skip = sp.getByRole('button', { name: 'I cannot recall it' })
  if (!(await skip.isVisible().catch(() => false))) break
  const cue = await sp.locator('p[lang="ru"]').first().innerText().catch(() => '')
  const known = answers[cue.trim()]
  if (known) {
    await sp.getByLabel('Your answer in English').fill(known)
    await sp.getByRole('button', { name: 'Next' }).click()
  } else if (i % 3 === 0) {
    await sp.getByLabel('Your answer in English').fill('maintain')
    await sp.getByRole('button', { name: 'Next' }).click()
  } else {
    await skip.click()
  }
}
await sp.waitForURL('**/onboarding/result', { timeout: 45000 })
await sp.screenshot({ path: `${OUT}/onboarding-result-390.png`, fullPage: true })

// A short training session so the other screens have real data.
await sp.goto(`${base}/train`)
await sp.getByLabel('Your answer in English').waitFor({ timeout: 45000 })
await sp.screenshot({ path: `${OUT}/train-question-390.png` })
await sp.getByLabel('Your answer in English').fill('avoid')
await sp.getByRole('button', { name: 'Check' }).click()
await sp.screenshot({ path: `${OUT}/train-feedback-390.png` })
await sp.getByRole('button', { name: /Continue|Finish/ }).click()

for (let i = 0; i < 12; i += 1) {
  const check = sp.getByRole('button', { name: 'Check' })
  if (!(await check.isVisible().catch(() => false))) break
  await sp.getByLabel('Your answer in English').fill(i % 2 === 0 ? 'maintain' : 'zzz')
  await check.click()
  await sp.getByRole('button', { name: /Continue|Finish/ }).click()
}
await sp.getByRole('button', { name: 'End session' }).click().catch(() => {})
await sp.getByRole('button', { name: 'End and see summary' }).click().catch(() => {})
await sp.getByText('Session complete').waitFor({ timeout: 45000 }).catch(() => {})
await sp.screenshot({ path: `${OUT}/session-summary-390.png`, fullPage: true })

const storage = await setup.storageState()
await setup.close()

for (const [w, h, tag] of [
  [390, 844, '390'],
  [430, 932, '430'],
  [1440, 900, '1440'],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 800,
    hasTouch: w < 800,
    storageState: storage,
  })
  const p = await ctx.newPage()
  for (const [path, name] of [
    ['/home', 'home'],
    ['/words', 'words'],
    ['/progress', 'progress'],
    ['/profile', 'profile'],
  ]) {
    await p.goto(base + path, { waitUntil: 'networkidle' })
    await p.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true })
    const o = await overflow(p)
    if (o > 1) console.log(`OVERFLOW ${path} @${tag}: ${o}px`)
  }
  await ctx.close()
}

await browser.close()
console.log('screenshots written to', OUT)
