'use client'

import { useCallback } from 'react'
import { SoundIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { isSpeechSynthesisSupported, speak } from '@/lib/speech'
import { useClientValue } from '@/lib/use-client-value'

export function SpeakButton({ text }: { text: string }) {
  const read = useCallback(() => isSpeechSynthesisSupported(), [])
  const supported = useClientValue(read, false)
  if (!supported) return null

  return (
    <IconButton label={`Listen to ${text}`} onClick={() => speak(text)}>
      <SoundIcon />
    </IconButton>
  )
}
