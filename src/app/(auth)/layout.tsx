import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="safe-top safe-bottom flex min-h-dvh flex-col bg-[var(--background)]">
      <header className="px-5 pt-5">
        <Link href="/" className="inline-flex items-center" aria-label="Back to the home page">
          <Logo />
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-5 py-8 sm:items-center">
        <div className="w-full max-w-[26rem]">{children}</div>
      </main>
    </div>
  )
}
