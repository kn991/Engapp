/**
 * Smoke check: the service worker registers, precaches the application shell,
 * and serves the offline page when a navigation has no network.
 *
 *   pnpm build && pnpm start   # the worker only registers in production
 *   node scripts/smoke/pwa.mjs
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
const fails = []

await p.goto(`${base}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)

const state = await p.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration()
  return { registered: Boolean(reg), scope: reg?.scope ?? null, active: Boolean(reg?.active) }
})
console.warn('service worker:', JSON.stringify(state))
if (!state.registered) fails.push('service worker did not register')

await p.evaluate(() => navigator.serviceWorker.ready)
const cached = await p.evaluate(async () => {
  const keys = await caches.keys()
  const results = {}
  for (const key of keys) {
    const cache = await caches.open(key)
    results[key] = (await cache.keys()).map((r) => new URL(r.url).pathname)
  }
  return results
})
console.warn('caches:', JSON.stringify(cached))
const all = Object.values(cached).flat()
if (!all.includes('/offline')) fails.push('/offline was not precached')
if (!all.includes('/manifest.webmanifest')) fails.push('manifest was not precached')

// Cut the network and navigate: the worker must serve the offline page.
await ctx.setOffline(true)
await p.goto(`${base}/progress`, { waitUntil: 'domcontentloaded' }).catch(() => {})
await p.waitForTimeout(1200)
const body = await p.locator('body').innerText().catch(() => '')
console.warn('offline navigation body:', body.slice(0, 90).replace(/\n/g, ' | '))
if (!body.includes('You are offline')) fails.push('offline navigation did not serve the offline page')
await ctx.setOffline(false)

console.warn(fails.length === 0 ? '\nSERVICE WORKER OK' : '\nFAILURES:\n' + fails.join('\n'))
await browser.close()
process.exit(fails.length === 0 ? 0 : 1)
