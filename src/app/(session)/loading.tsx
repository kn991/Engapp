import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="safe-top space-y-6 px-5 pt-8">
      <Skeleton className="h-1 w-full" />
      <div className="space-y-3 pt-16">
        <Skeleton className="mx-auto h-9 w-48" />
        <Skeleton className="mx-auto h-5 w-64" />
      </div>
      <Skeleton className="mt-16 h-14 w-full rounded-[var(--radius-md)]" />
      <span className="sr-only">Preparing your session…</span>
    </div>
  )
}
