import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="safe-top space-y-4 px-5 pt-6">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-44 w-full rounded-[var(--radius-lg)]" />
      <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
      <Skeleton className="h-24 w-full rounded-[var(--radius-lg)]" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
