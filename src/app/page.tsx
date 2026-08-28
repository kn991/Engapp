import type { Metadata } from 'next'
import Link from 'next/link'
import { AppPreview, ProgressPreview } from '@/components/landing/app-preview'
import { RecallDemo } from '@/components/landing/recall-demo'
import { Logo } from '@/components/logo'
import { LinkButton } from '@/components/ui/link-button'
import { APP } from '@/config/app'

export const metadata: Metadata = {
  title: `${APP.name} — ${APP.tagline}`,
  description: APP.description,
  alternates: { canonical: '/' },
}

const STEPS = [
  {
    title: 'A short test places you',
    body: 'Twenty-odd words, each shown as a meaning you have to turn into English. We record whether it came out and how long it took.',
  },
  {
    title: 'Every session pushes production',
    body: 'Russian cue, then a situation, then an English definition, then a gap in a sentence. The scaffolding falls away as the word gets faster.',
  },
  {
    title: 'Scheduling follows your speed',
    body: 'A correct answer that took nine seconds comes back tomorrow. One that took under two seconds waits weeks.',
  },
  {
    title: 'Words graduate, slowly',
    body: 'A word is only Active after several fast, unaided recalls on separate days. One lucky answer never counts.',
  },
]

const DIFFERENCES = [
  {
    them: 'Flashcards ask “do you know this?”',
    us: 'Verba asks “can you produce it in time?”',
  },
  {
    them: 'A card is right or wrong.',
    us: 'An answer is instant, good, slow or fragile — and slow is not a pass.',
  },
  {
    them: 'Most decks run English to your language.',
    us: 'Almost everything runs the other way, towards speech and writing.',
  },
  {
    them: 'Progress is a pile of reviewed cards.',
    us: 'Progress is a falling number of seconds.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="safe-top mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="flex items-center gap-1" aria-label="Account">
          <Link
            href="/login"
            className="flex h-11 items-center rounded-[var(--radius-md)] px-3 text-[0.9375rem] font-medium"
          >
            Sign in
          </Link>
          <LinkButton href="/signup" size="sm">
            Start
          </LinkButton>
        </nav>
      </header>

      <main id="main">
        <section className="mx-auto max-w-5xl px-5 pt-8 pb-14 sm:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-[2.25rem] leading-[1.08] tracking-[-0.02em] text-balance sm:text-[3rem]">
                You recognise thousands of English words. Can you recall them in time?
              </h1>
              <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--muted)]">
                Reading and listening feel easy. Speaking does not, because the word you need takes
                four seconds to arrive and the sentence has already moved on. Verba trains that
                delay down.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <LinkButton href="/signup" size="lg">
                  Start training
                </LinkButton>
                <Link
                  href="#demo"
                  className="flex h-14 items-center px-2 text-[1.0625rem] text-[var(--accent)] underline-offset-4 hover:underline"
                >
                  Try it first
                </Link>
              </div>

              <dl className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem]">
                <dt className="text-[var(--muted)]">Passive vocabulary</dt>
                <dd aria-hidden="true" className="text-[var(--border-strong)]">
                  ──▸
                </dd>
                <dt className="font-medium text-[var(--accent)]">Active vocabulary</dt>
                <dd className="w-full text-[var(--muted)]">
                  The words you understand, turned into the words you use.
                </dd>
              </dl>
            </div>

            <div id="demo" className="scroll-mt-6">
              <RecallDemo />
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <h2 className="font-display text-[1.75rem] leading-tight">How it works</h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-2">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="tabular font-display shrink-0 text-[1.25rem] text-[var(--accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-display text-[1.75rem] leading-tight">Not flashcards</h2>
          <ul className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {DIFFERENCES.map((row) => (
              <li key={row.them} className="grid gap-1 py-4 sm:grid-cols-2 sm:gap-8">
                <p className="text-[0.9375rem] text-[var(--muted)]">{row.them}</p>
                <p className="text-[0.9375rem] font-medium">{row.us}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl px-5 py-14">
            <h2 className="font-display text-[1.75rem] leading-tight">Inside the app</h2>
            <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-[var(--muted)]">
              One question at a time, a thin progress line, and a number that tells you the truth
              about how fast the word arrived.
            </p>
            <div className="mt-8 space-y-6">
              <AppPreview />
              <ProgressPreview />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16 text-center">
          <h2 className="font-display text-[1.75rem] leading-tight text-balance">
            Stop losing the word you already know.
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-[0.9375rem] text-[var(--muted)]">
            Five to ten minutes a day. Retrieval practice and spaced repetition, scheduled by how
            fast you actually answer.
          </p>
          <div className="mt-7 flex justify-center">
            <LinkButton href="/signup" size="lg">
              Start training
            </LinkButton>
          </div>
        </section>
      </main>

      <footer className="safe-bottom border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo size="sm" />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms
            </Link>
            <a href={`mailto:${APP.support.email}`} className="underline-offset-4 hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
