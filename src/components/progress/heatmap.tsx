import { formatDayLabel } from '@/domain/learning'
import { cn } from '@/lib/utils'

export interface HeatmapDay {
  day: string
  reviews: number
}

/**
 * Twelve weeks of activity. Kept low contrast so it reads as background
 * texture rather than another scoreboard.
 */
export function Heatmap({ days }: { days: HeatmapDay[] }) {
  const max = Math.max(1, ...days.map((day) => day.reviews))
  const active = days.filter((day) => day.reviews > 0).length
  const weeks: HeatmapDay[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div className="flex min-w-max gap-[3px]">
        {weeks.map((week, index) => (
          <div key={index} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <span
                key={day.day}
                title={`${formatDayLabel(day.day)}: ${day.reviews} reviews`}
                className={cn(
                  'block h-[11px] w-[11px] rounded-[2px]',
                  intensityClass(day.reviews, max)
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {active} active {active === 1 ? 'day' : 'days'} in the last {days.length}
      </p>
    </div>
  )
}

function intensityClass(reviews: number, max: number): string {
  if (reviews === 0) return 'bg-[var(--surface-3)]'
  const ratio = reviews / max
  if (ratio > 0.66) return 'bg-[var(--accent)]'
  if (ratio > 0.33) return 'bg-[var(--accent)]/70'
  return 'bg-[var(--accent)]/40'
}
