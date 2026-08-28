import { addDays, formatDayLabel, todayKey } from '@/domain/learning'

/** Minutes trained on each of the last seven days. */
export function WeekBars({ minutes, timeZone }: { minutes: number[]; timeZone: string }) {
  const max = Math.max(1, ...minutes)
  const today = todayKey(timeZone)

  return (
    <div className="flex items-end justify-between gap-2" role="img" aria-label={describe(minutes)}>
      {minutes.map((value, index) => {
        const day = addDays(today, -(minutes.length - 1 - index))
        return (
          <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-20 w-full items-end">
              <div
                className="w-full rounded-t-[3px] bg-[var(--accent)]"
                style={{ height: `${Math.max(3, (value / max) * 100)}%`, opacity: value > 0 ? 1 : 0.25 }}
              />
            </div>
            <span className="text-[0.625rem] text-[var(--muted)]">
              {formatDayLabel(day).split(' ')[1]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function describe(minutes: number[]): string {
  const total = minutes.reduce((a, b) => a + b, 0)
  return `${total} minutes trained across the last ${minutes.length} days`
}
