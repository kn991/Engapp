/**
 * Smoke check: password reset end to end through the real email, and account
 * deletion.
 *
 *   node scripts/smoke/account.mjs
 *
 * Requires the local Supabase stack: the reset link is read out of Mailpit at
 * http://127.0.0.1:54324.
 */
import { chromium } from '@playwright/test'
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {}
)
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3000'
const mail = process.env.SMOKE_MAIL_URL ?? 'http://127.0.0.1:54324'
const fails = []

async function check(name, fn) {
  try { await fn(); console.warn('PASS', name) }
  catch (e) { fails.push(`${name}: ${e.message.split('\n')[0]}`); console.warn('FAIL', name) }
}

// ---- password reset, end to end through the real email ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const p = await ctx.newPage()
  const email = `reset-${Date.now()}@example.com`
  await p.goto(`${base}/signup`)
  await p.getByLabel('Name').fill('Reset')
  await p.getByLabel('Email').fill(email)
  await p.getByLabel('Password').fill('old-password-2026')
  await p.getByRole('button', { name: 'Create account' }).click()
  await p.waitForURL('**/onboarding', { timeout: 30000 })
  await p.goto(`${base}/profile`)
  await p.getByRole('button', { name: 'Log out' }).click()
  await p.waitForURL(`${base}/`, { timeout: 20000 })

  await check('password reset sends a link and sets a new password', async () => {
    await p.goto(`${base}/forgot-password`)
    await p.getByLabel('Email').fill(email)
    await p.getByRole('button', { name: 'Send reset link' }).click()
    await p.getByText(/reset link is on its way/).waitFor({ timeout: 15000 })

    // Read the message out of the local mail catcher.
    let link = null
    for (let attempt = 0; attempt < 20 && !link; attempt += 1) {
      const res = await p.request.get(`${mail}/api/v1/messages?limit=30`)
      const body = await res.json()
      const message = (body.messages ?? []).find((m) =>
        (m.To ?? []).some((to) => to.Address === email)
      )
      if (message) {
        const source = await (await p.request.get(`${mail}/api/v1/message/${message.ID}`)).json()
        const text = `${source.Text ?? ''} ${source.HTML ?? ''}`.replace(/=\r?\n/g, '')
        const match = text.match(/https?:\/\/[^\s"'<>]*(?:verify|confirm)[^\s"'<>]*/i)
        if (match) link = match[0].replace(/&amp;/g, '&')
      }
      if (!link) await p.waitForTimeout(700)
    }
    if (!link) throw new Error('no reset email arrived')

    await p.goto(link)
    await p.waitForURL('**/reset-password', { timeout: 25000 })
    await p.getByLabel('New password').fill('brand-new-password-2026')
    await p.getByLabel('Repeat password').fill('brand-new-password-2026')
    await p.getByRole('button', { name: 'Save new password' }).click()
    // A signed-in user who never finished setup lands on onboarding, not home.
    await p.waitForURL(/\/(home|onboarding)/, { timeout: 25000 })

    // The new password actually works.
    await p.goto(`${base}/profile`)
    await p.getByRole('button', { name: 'Log out' }).click()
    await p.waitForURL(`${base}/`, { timeout: 20000 })
    await p.goto(`${base}/login`)
    await p.getByLabel('Email').fill(email)
    await p.getByLabel('Password').fill('brand-new-password-2026')
    await p.getByRole('button', { name: 'Sign in' }).click()
    await p.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 25000 })
  })
  await ctx.close()
}

// ---- account deletion ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const p = await ctx.newPage()
  const email = `delete-${Date.now()}@example.com`
  const password = 'delete-password-2026'
  await p.goto(`${base}/signup`)
  await p.getByLabel('Name').fill('Gone')
  await p.getByLabel('Email').fill(email)
  await p.getByLabel('Password').fill(password)
  await p.getByRole('button', { name: 'Create account' }).click()
  await p.waitForURL('**/onboarding', { timeout: 30000 })

  await check('deletion needs the exact confirmation word', async () => {
    await p.goto(`${base}/profile`)
    await p.getByRole('button', { name: 'Delete account' }).click()
    await p.getByLabel('Type DELETE to confirm').fill('delete')
    const confirm = p.getByRole('button', { name: 'Delete permanently' })
    if (!(await confirm.isDisabled())) throw new Error('lowercase confirmation was accepted')
  })

  await check('deleting the account signs the user out and removes it', async () => {
    await p.getByLabel('Type DELETE to confirm').fill('DELETE')
    await p.getByRole('button', { name: 'Delete permanently' }).click()
    await p.waitForURL(/\/\?deleted=1|\/$/, { timeout: 25000 })

    await p.goto(`${base}/home`)
    await p.waitForURL('**/login**', { timeout: 20000 })

    await p.goto(`${base}/login`)
    await p.getByLabel('Email').fill(email)
    await p.getByLabel('Password').fill(password)
    await p.getByRole('button', { name: 'Sign in' }).click()
    await p.getByText('That email and password do not match.').waitFor({ timeout: 20000 })
  })
  await ctx.close()
}

console.warn(fails.length === 0 ? '\nALL ACCOUNT CHECKS PASSED' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
