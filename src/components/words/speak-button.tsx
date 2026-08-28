'use client'

import { useEffect, useState } from 'react'
import { SoundIcon } from '@/components/icons'
import { IconButton } from '@/components/ui/icon-button'
import { isSpeechSynthesisSupported, speak } from '@/lib/speech'

export function SpeakButton({ text }: { text: string }) {
  const [supported, setSupported] = useState(false)
  useEffect(() => setSupported(isSpeechSynthesisSupported()), [])
  if (!supported) return null

  return (
    <IconButton label={`Listen to ${text}`} onClick={() => speak(text)}>
      <SoundIcon />
    </IconButton>
  )
}
