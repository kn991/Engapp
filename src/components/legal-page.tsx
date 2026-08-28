import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="safe-top mx-auto max-w-2xl px-5 py-4">
        <Link href="/" aria-label="Back to the home page">
          <Logo />
        </Link>
      </header>
      <main id="main" className="safe-bottom mx-auto max-w-2xl px-5 pb-16">
        <h1 className="font-display text-[2rem] leading-tight">{title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated {updated}</p>
        <div className="prose mt-8 space-y-6 text-[1.0625rem] leading-relaxed">{children}</div>
      </main>
    </div>
  )
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.25rem]">{heading}</h2>
      <div className="mt-2 space-y-3 text-[var(--text-soft)]">{children}</div>
    </section>
  )
}
