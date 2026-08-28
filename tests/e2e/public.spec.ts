import { expect, test } from '@playwright/test'

/** The public journey works with no account and no database. */

test.describe('landing page', () => {
  test('states the problem and offers a way in', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /Can you recall them in time\?/ })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Start training' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })

  test('never scrolls sideways on a phone', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('runs the recall demo without an account and reports a real time', async ({ page }) => {
    await page.goto('/')
    const demo = page.locator('#demo')

    await demo.getByRole('button', { name: 'Try it' }).click()
    await expect(demo.getByText('избегать')).toBeVisible()

    await page.getByLabel('Your answer in English').fill('avoid')
    await page.getByRole('button', { name: 'Check' }).click()
    await expect(page.getByText(/sec/).first()).toBeVisible()

    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByLabel('Your answer in English').fill('postpone')
    await page.getByRole('button', { name: 'Check' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByLabel('Your answer in English').fill('hesitate')
    await page.getByRole('button', { name: 'Check' }).click()
    await page.getByRole('button', { name: 'See your result' }).click()

    await expect(page.getByText('Your recall time')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Train your own vocabulary' })).toBeVisible()
  })

  test('accepts a listed alternative in the demo', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Try it' }).click()
    await page.getByLabel('Your answer in English').fill('avoid')
    await page.getByRole('button', { name: 'Check' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByLabel('Your answer in English').fill('put off')
    await page.getByRole('button', { name: 'Check' }).click()
    await expect(page.getByText('You knew it. We train you to reach it faster.')).toBeVisible()
  })
})

test.describe('legal pages', () => {
  test('privacy and terms are reachable and indexable', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { name: 'Privacy policy' })).toBeVisible()

    await page.goto('/terms')
    await expect(page.getByRole('heading', { name: 'Terms of use' })).toBeVisible()
  })
})

test.describe('progressive web app', () => {
  test('serves a manifest with icons and standalone display', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest')
    expect(response.ok()).toBeTruthy()

    const manifest = await response.json()
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/home')
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)
    expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(
      true
    )
  })

  test('serves the service worker and an offline page', async ({ request }) => {
    expect((await request.get('/sw.js')).ok()).toBeTruthy()
    expect((await request.get('/offline')).ok()).toBeTruthy()
  })

  test('keeps the app out of search results', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Disallow: /home')
    expect(robots).toContain('Disallow: /admin')
  })
})

test.describe('route protection', () => {
  test('sends an anonymous visitor from the app to sign in', async ({ page }) => {
    await page.goto('/home')
    await page.waitForURL('**/login**')
    expect(page.url()).toContain('/login')
  })

  test('protects the admin area too', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForURL('**/login**')
    expect(page.url()).toContain('/login')
  })
})
