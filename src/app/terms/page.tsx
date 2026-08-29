import type { Metadata } from 'next'
import { LegalPage, Section } from '@/components/legal-page'
import { APP } from '@/config/app'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: `The terms for using ${APP.name}.`,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="1 January 2026">
      <p>
        A template, written to be accurate about how the service works. Replace it with terms
        reviewed for your jurisdiction before launching.
      </p>

      <Section heading="Your account">
        <p>
          You need an account to train. Keep your password to yourself, and tell us if you think
          someone else has it. You are responsible for what happens under your account.
        </p>
      </Section>

      <Section heading="What the service does">
        <p>
          {APP.name} is a vocabulary trainer. It measures how quickly you produce English words and
          schedules reviews accordingly. It does not assess pronunciation, and it does not issue
          certificates or recognised language qualifications.
        </p>
      </Section>

      <Section heading="Content you add">
        <p>
          Words and examples you add stay yours and are visible only to you. Do not upload content
          you do not have the right to use.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>
          Do not attempt to access other people&apos;s accounts or data, disrupt the service, or use
          automated tools to extract the curated vocabulary in bulk.
        </p>
      </Section>

      <Section heading="Availability">
        <p>
          The service is provided as it is, without a guarantee of uninterrupted availability. We
          may change or discontinue features. Your export remains available while your account
          does.
        </p>
      </Section>

      <Section heading="Ending your account">
        <p>
          You can delete your account at any time from Profile and Settings. We may suspend accounts
          that break these terms.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          <a href={`mailto:${APP.support.email}`}>{APP.support.email}</a>
        </p>
      </Section>
    </LegalPage>
  )
}
