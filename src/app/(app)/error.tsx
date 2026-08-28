'use client'

import { ErrorState } from '@/components/ui/error-state'

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="safe-top px-5 py-10">
      <ErrorState onRetry={reset} />
    </div>
  )
}
