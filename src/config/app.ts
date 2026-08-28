/**
 * Single source of truth for product identity.
 * Change the values here to rebrand the whole application.
 */
export const APP = {
  name: 'Verba',
  /** Used in <title> templates and the PWA manifest. */
  shortName: 'Verba',
  tagline: 'Know it. Say it. In time.',
  description:
    'Verba turns the English you understand into English you can actually produce. It measures how long it takes you to recall a word and trains that time down.',
  /** Public origin, overridden by NEXT_PUBLIC_SITE_URL in deployment. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'en',
  themeColor: {
    light: '#faf9f7',
    dark: '#12100e',
  },
  support: {
    email: 'hello@example.com',
    entity: 'Verba',
  },
  twitter: '@verba_app',
} as const

export type AppConfig = typeof APP
