'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Reserved for genuinely meaningful moments: a word becoming active, a new
 * level, an achievement. Never fired after an ordinary correct answer.
 */
export function Celebration() {
  const [visible, setVisible] = useState(true)
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible || reduced) return null

  const pieces = Array.from({ length: 14 }, (_, index) => index)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-40 overflow-hidden">
      {pieces.map((index) => (
        <span
          key={index}
          className="absolute block h-1.5 w-1.5 rounded-[1px]"
          style={{
            left: `${(index * 7 + 6) % 96}%`,
            backgroundColor:
              index % 3 === 0
                ? 'var(--accent)'
                : index % 3 === 1
                  ? 'var(--success)'
                  : 'var(--border-strong)',
            animation: `verba-fade-up 1.6s ${index * 60}ms cubic-bezier(0.22,1,0.36,1) both`,
            transform: `translateY(${10 + (index % 5) * 12}px)`,
          }}
        />
      ))}
    </div>
  )
}
