import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DiagnosticResult } from '@/components/onboarding/diagnostic-result'
import { requireUser } from '@/lib/supabase/auth'
import { createServerSupabase } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Your baseline',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/**
 * Rendered from the stored diagnostic rather than from client state, so the
 * result survives a refresh and can be reached again from a link.
 */
export default async function OnboardingResultPage() {
  const user = await requireUser()
  const supabase = await createServerSupabase()

  const [{ data: diagnostic }, { count }] = await Promise.all([
    supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('user_words')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  if (!diagnostic) redirect('/home')

  const total = Math.max(1, diagnostic.items)
  const share = (value: number) => Math.round((value / total) * 100)

  return (
    <DiagnosticResult
      estimatedLevel={diagnostic.estimated_level}
      fastShare={share(diagnostic.fast_count)}
      slowShare={share(diagnostic.slow_count)}
      missedShare={share(diagnostic.missed_count)}
      avgLatencyMs={diagnostic.avg_latency_ms}
      wordCount={count ?? 0}
    />
  )
}
