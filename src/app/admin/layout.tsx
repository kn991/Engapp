import Link from 'next/link'
import { Logo } from '@/components/logo'
import { requireAdmin } from '@/lib/supabase/auth'

/**
 * Admin authorisation is decided here, on the server, on every request. There
 * is no client-side check to bypass: a non-admin is redirected before any
 * admin page renders, and the database refuses curated writes independently.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="safe-top border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <div className="flex items-baseline gap-3">
            <Logo size="sm" />
            <span className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">Admin</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="underline-offset-4 hover:underline">
              Words
            </Link>
            <Link href="/admin/import" className="underline-offset-4 hover:underline">
              Import
            </Link>
            <Link href="/home" className="text-[var(--muted)] underline-offset-4 hover:underline">
              Exit
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="safe-bottom mx-auto max-w-4xl px-5 py-6">
        {children}
      </main>
    </div>
  )
}
