'use client'

import { CheckIcon, CloseIcon, SoundIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { isSpeechSynthesisSupported, speak } from '@/lib/speech'
import type { RecallBand, SessionItem } from '@/domain/learning'
import { LatencyBadge } from './latency-badge'

export interface FeedbackData {
  item: SessionItem
  band: RecallBand
  latencyMs: number
  wasCorrect: boolean
  isSpellingSlip: boolean
  submitted: string
  justActivated: boolean
  masteryAfter: number
}

/**
 * Shown right after an answer. Correctness is carried by an icon and a word,
 * never by colour alone.
 */
export function RecallFeedback({
  data,
  soundEnabled,
  variety,
  onAcceptAnswer,
  acceptState,
}: {
  data: FeedbackData
  soundEnabled: boolean
  variety: 'american' | 'british'
  onAcceptAnswer?: () => void
  acceptState: 'idle' | 'saving' | 'saved'
}) {
  const { item, band, latencyMs, wasCorrect, isSpellingSlip, submitted } = data
  const canSpeak = soundEnabled && isSpeechSynthesisSupported()
  const canOfferAccept =
    !wasCorrect && submitted.trim().length > 1 && onAcceptAnswer !== undefined

  return (
    <div className="animate-fade-up text-center" aria-live="polite">
      <div className="flex items-center justify-center gap-2">
        <span
          className={
            wasCorrect ? 'text-[var(--success)]' : 'text-[var(--danger)]'
          }
        >
          {wasCorrect ? <CheckIcon size={20} /> : <CloseIcon size={20} />}
        </span>
        <LatencyBadge band={band} latencyMs={latencyMs} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <p className="font-display text-[1.75rem] leading-tight" lang="en">
          {item.answer}
        </p>
        {canSpeak && (
          <IconButton label="Listen" onClick={() => speak(item.answer, variety)}>
            <SoundIcon size={18} />
          </IconButton>
        )}
      </div>

      {isSpellingSlip && (
        <p className="mt-2 text-sm text-[var(--warning)]">
          Almost — spelling. You wrote “{submitted.trim()}”.
        </p>
      )}
      {!wasCorrect && submitted.trim().length > 0 && (
        <p className="mt-2 text-sm text-[var(--muted)]">You wrote “{submitted.trim()}”.</p>
      )}
      {wasCorrect && band === 'slow' && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          You knew it. Now make it quicker.
        </p>
      )}

      {item.reveal && (
        <p className="mx-auto mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-[var(--text-soft)]" lang="en">
          {item.reveal}
        </p>
      )}

      {data.justActivated && (
        <p className="animate-pop mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
          Now active
        </p>
      )}

      {canOfferAccept && (
        <div className="mt-5">
          {acceptState === 'saved' ? (
            <p className="text-sm text-[var(--success)]">
              Saved. “{submitted.trim()}” will count for this word from now on.
            </p>
          ) : (
            <Button
              variant="quiet"
              size="sm"
              loading={acceptState === 'saving'}
              onClick={onAcceptAnswer}
              type="button"
            >
              Accept my answer
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
