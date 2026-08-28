import Link from 'next/link'
import { ChevronRightIcon } from '@/components/icons'
import { formatLatency, formatNextReview, type UserWordState, type Word } from '@/domain/learning'
import { WordStatusChip } from './word-status-chip'

export function WordRow({ word, state }: { word: Word; state: UserWordState }) {
  return (
    <li>
      <Link
        href={`/words/${word.id}`}
        className="flex min-h-[4.25rem] items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-[var(--surface-2)]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display truncate text-[1.125rem]" lang="en">
              {word.lemma}
            </span>
            {word.isCustom && (
              <span className="text-[0.625rem] tracking-[0.1em] text-[var(--muted)] uppercase">
                yours
              </span>
            )}
          </div>
          <p lang="ru" className="mt-0.5 truncate text-sm text-[var(--muted)]">
            {word.russian}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <WordStatusChip status={state.status} />
            {state.recentLatencyMs != null && (
              <span className="tabular text-xs text-[var(--muted)]">
                {formatLatency(state.recentLatencyMs)}
              </span>
            )}
            <span className="text-xs text-[var(--muted)]">
              {formatNextReview(state.nextReviewAt)}
            </span>
          </div>
        </div>
        <ChevronRightIcon size={18} className="shrink-0 text-[var(--border-strong)]" />
      </Link>
    </li>
  )
}
