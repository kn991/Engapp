import { formatLatency } from '@/domain/learning'

export interface LatencyPoint {
  day: string
  latencyMs: number
  wasCorrect: boolean
}

/**
 * The one chart that matters: how long this word takes to surface, over time.
 * Drawn as inline SVG so there is no charting dependency for a sparkline.
 */
export function LatencyChart({ points }: { points: LatencyPoint[] }) {
  const correct = points.filter((point) => point.wasCorrect)
  if (correct.length < 2) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Two successful recalls are enough to start a trend. Keep going.
      </p>
    )
  }

  const width = 320
  const height = 96
  const padding = 8
  const max = Math.max(...correct.map((point) => point.latencyMs))
  const min = Math.min(...correct.map((point) => point.latencyMs))
  const span = Math.max(1, max - min)

  const coords = correct.map((point, index) => {
    const x = padding + (index / (correct.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (point.latencyMs - min) / span) * (height - padding * 2)
    return { x, y, point }
  })

  const path = coords
    .map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`)
    .join(' ')

  const first = correct[0]
  const last = correct[correct.length - 1]

  return (
    <figure className="space-y-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-24 w-full"
        role="img"
        aria-label={`Recall time from ${formatLatency(first?.latencyMs)} down to ${formatLatency(last?.latencyMs)} over ${correct.length} reviews`}
      >
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
        {coords.map((coord, index) => (
          <circle
            key={index}
            cx={coord.x}
            cy={coord.y}
            r={index === coords.length - 1 ? 3.5 : 2}
            fill="var(--accent)"
          />
        ))}
      </svg>
      <figcaption className="flex justify-between text-xs text-[var(--muted)]">
        <span className="tabular">{formatLatency(first?.latencyMs)}</span>
        <span>{correct.length} recalls</span>
        <span className="tabular">{formatLatency(last?.latencyMs)}</span>
      </figcaption>
    </figure>
  )
}
