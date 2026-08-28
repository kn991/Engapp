import { requireUser } from '@/lib/supabase/auth'

/**
 * Full-screen shell for focused flows.
 *
 * There is deliberately no bottom navigation here: while a question is on
 * screen nothing should compete with it.
 */
export default async function SessionLayout({ children }: { children: React.ReactNode }) {
  await requireUser()
  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <div id="main" className="mx-auto max-w-2xl">
        {children}
      </div>
    </div>
  )
}
