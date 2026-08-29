import type { Metadata } from 'next'
import { LegalPage, Section } from '@/components/legal-page'
import { APP } from '@/config/app'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: `How ${APP.name} handles your data.`,
  alternates: { canonical: '/privacy' },
}

/**
 * A plain, accurate description of what this application actually stores.
 * Replace it with text reviewed for your jurisdiction before launching.
 */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="1 January 2026">
      <p>
        This is a template written to describe how the application behaves. It is not legal advice.
        Have it reviewed before you rely on it.
      </p>

      <Section heading="What we store">
        <p>
          Your email address and password are held by our authentication provider, Supabase.
          Passwords are hashed there; {APP.name} never sees or stores them.
        </p>
        <p>
          We store your display name, time zone, training preferences, the words in your personal
          vocabulary, and one record for every answer you give. Each answer record holds the
          exercise shown, what you typed, whether it was correct, how many milliseconds you took,
          and whether you used a hint.
        </p>
      </Section>

      <Section heading="Why we store it">
        <p>
          Recall speed is what the product schedules on. Without the timing of your past answers
          there is no way to decide when a word should come back, so this data is the service
          rather than an addition to it.
        </p>
      </Section>

      <Section heading="What we do not do">
        <p>
          We do not run third-party advertising or analytics trackers. We do not sell your data. We
          do not send your answers to any external service.
        </p>
      </Section>

      <Section heading="Who can see your data">
        <p>
          Only you. Access is enforced in the database itself through row level security, so a
          request signed in as one account cannot read another account&apos;s rows.
        </p>
      </Section>

      <Section heading="Your data, in your hands">
        <p>
          Profile and Settings has an export that downloads everything listed above as a JSON file,
          and a delete option that removes your account and every row attached to it. Deletion is
          immediate and cannot be undone.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          We set the session cookies our authentication provider needs to keep you signed in. There
          are no advertising or tracking cookies.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about this policy: <a href={`mailto:${APP.support.email}`}>{APP.support.email}</a>
          .
        </p>
      </Section>
    </LegalPage>
  )
}
