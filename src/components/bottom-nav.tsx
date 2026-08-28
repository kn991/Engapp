'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ProfileIcon,
  ProgressIcon,
  TrainIcon,
  WordsIcon,
} from '@/components/icons'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/train', label: 'Train', Icon: TrainIcon },
  { href: '/words', label: 'Words', Icon: WordsIcon },
  { href: '/progress', label: 'Progress', Icon: ProgressIcon },
  { href: '/profile', label: 'Profile', Icon: ProfileIcon },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main"
      className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm"
    >
      <ul className="mx-auto flex max-w-2xl">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5',
                  'transition-colors duration-150',
                  active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                )}
              >
                <Icon size={22} />
                <span className="text-[0.6875rem] leading-none font-medium">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
