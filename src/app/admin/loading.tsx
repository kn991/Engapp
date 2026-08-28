import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-64 w-full rounded-[var(--radius-lg)]" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
