import { BottomNav } from '@/components/bottom-nav'
import { OfflineBanner } from '@/components/offline-banner'
import { requireUser } from '@/lib/supabase/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Every page under this layout is private. The proxy redirects anonymous
  // visitors already; this is the check that actually enforces it.
  await requireUser()

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <OfflineBanner />
      <main id="main" className="mx-auto max-w-2xl pb-24">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
