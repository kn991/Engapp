import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { requireUser } from '@/lib/supabase/auth'
import { loadProfileBundle } from '@/server/queries/profile'

export const metadata: Metadata = {
  title: 'Set up',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const user = await requireUser()
  const bundle = await loadProfileBundle(user.id)
  if (bundle?.profile.onboarded_at) redirect('/home')

  return <OnboardingFlow displayName={bundle?.profile.display_name ?? null} />
}
