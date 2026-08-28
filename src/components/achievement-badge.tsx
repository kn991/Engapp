import {
  ArrowUpIcon,
  BoltIcon,
  CircleCheckIcon,
  FlameIcon,
  GaugeIcon,
  GridIcon,
  LayersIcon,
  ReturnIcon,
  SparkIcon,
} from '@/components/icons'
import type { AchievementIcon } from '@/domain/learning'
import { cn } from '@/lib/utils'

const ICONS = {
  spark: SparkIcon,
  bolt: BoltIcon,
  'arrow-up': ArrowUpIcon,
  'circle-check': CircleCheckIcon,
  flame: FlameIcon,
  layers: LayersIcon,
  return: ReturnIcon,
  gauge: GaugeIcon,
  grid: GridIcon,
} as const

export function AchievementBadge({
  icon,
  unlocked,
  className,
}: {
  icon: AchievementIcon
  unlocked: boolean
  className?: string
}) {
  const Icon = ICONS[icon]
  return (
    <span
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border',
        unlocked
          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--border-strong)]',
        className
      )}
    >
      <Icon size={22} />
    </span>
  )
}
