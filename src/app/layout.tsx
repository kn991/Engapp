import type { Metadata, Viewport } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { APP } from '@/config/app'
import { ThemeProvider, themeScript } from '@/components/theme'
import { ToastProvider } from '@/components/ui/toast'
import { ServiceWorker } from '@/components/service-worker'
import './globals.css'

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display-serif',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(APP.url),
  title: {
    default: `${APP.name} — ${APP.tagline}`,
    template: `%s · ${APP.name}`,
  },
  description: APP.description,
  applicationName: APP.name,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: APP.name,
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: APP.name,
    title: `${APP.name} — ${APP.tagline}`,
    description: APP.description,
    url: APP.url,
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: APP.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP.name} — ${APP.tagline}`,
    description: APP.description,
    images: ['/og.png'],
  },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: APP.themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: APP.themeColor.dark },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={APP.locale} className={display.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:shadow-[var(--shadow-pop)]"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <ServiceWorker />
      </body>
    </html>
  )
}
