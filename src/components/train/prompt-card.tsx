'use client'

import { SoundIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { EXERCISE_INSTRUCTIONS, type SessionItem } from '@/domain/learning'
import { isSpeechSynthesisSupported, speak } from '@/lib/speech'
import { cn } from '@/lib/utils'

/**
 * The question. Almost everything else on the screen is removed while this is
 * showing: the only job here is meaning in, word out.
 */
export function PromptCard({
  item,
  soundEnabled,
  variety,
}: {
  item: SessionItem
  soundEnabled: boolean
  variety: 'american' | 'british'
}) {
  const isRussianCue = item.promptLang === 'ru'
  const canSpeak = soundEnabled && !isRussianCue && isSpeechSynthesisSupported()

  return (
    <div className="text-center">
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        {EXERCISE_INSTRUCTIONS[item.exerciseType]}
      </p>

      <div className="mt-5 flex items-start justify-center gap-2">
        <p
          lang={item.promptLang}
          className={cn(
            'text-balance',
            isRussianCue
              ? 'font-display text-[2rem] leading-[1.15] tracking-[-0.01em]'
              : 'text-[1.375rem] leading-snug font-medium'
          )}
        >
          {item.prompt}
        </p>
        {canSpeak && (
          <IconButton
            label="Listen"
            className="-mt-1 shrink-0"
            onClick={() => speak(item.prompt, variety)}
          >
            <SoundIcon size={18} />
          </IconButton>
        )}
      </div>

      {item.promptSecondary && (
        <p
          lang={item.exerciseType === 'word_family' ? 'en' : item.promptLang === 'ru' ? 'en' : 'ru'}
          className="mx-auto mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-[var(--muted)]"
        >
          {item.promptSecondary}
        </p>
      )}
    </div>
  )
}
