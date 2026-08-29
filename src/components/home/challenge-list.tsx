import { CircleCheckIcon } from '@/components/icons'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { DailyChallenge } from '@/domain/learning'

export function ChallengeList({ challenges }: { challenges: DailyChallenge[] }) {
  if (challenges.length === 0) return null

  return (
    <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      {challenges.map((challenge) => (
        <li key={challenge.code} className="px-4 py-3.5">
          <div className="flex items-start gap-3">
            <span
              className={
                challenge.completed
                  ? 'mt-0.5 text-[var(--success)]'
                  : 'mt-0.5 text-[var(--border-strong)]'
              }
            >
              <CircleCheckIcon size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-medium">{challenge.title}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{challenge.description}</p>
              {!challenge.completed && (
                <ProgressBar
                  className="mt-2"
                  size="thin"
                  value={challenge.progress * 100}
                  label={challenge.title}
                />
              )}
            </div>
            <span className="tabular shrink-0 pt-0.5 text-xs font-semibold text-[var(--muted)]">
              +{challenge.xp} XP
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
