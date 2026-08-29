'use client'

/**
 * Browser speech, used strictly as progressive enhancement.
 *
 * Both APIs are optional: if a browser does not have them the training screen
 * simply does not offer the button. Recognition here transcribes what was
 * said so it can be graded like typing. It does not judge pronunciation and we
 * never claim that it does.
 */

interface SpeechRecognitionResultLike {
  transcript: string
}

type RecognitionEvent = {
  results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>>
}

interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: { error?: string }) => void) | null
  onend: (() => void) | null
}

type RecognitionConstructor = new () => RecognitionLike

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  const candidate =
    (window as unknown as { SpeechRecognition?: RecognitionConstructor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: RecognitionConstructor })
      .webkitSpeechRecognition
  return candidate ?? null
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionConstructor() !== null
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export interface RecognitionHandle {
  stop: () => void
}

export function startRecognition(
  options: {
    lang?: string
    onResult: (transcript: string) => void
    onError?: (reason: string) => void
    onEnd?: () => void
  }
): RecognitionHandle | null {
  const Constructor = getRecognitionConstructor()
  if (!Constructor) return null

  const recognition = new Constructor()
  recognition.lang = options.lang ?? 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.continuous = false

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript
    if (transcript) options.onResult(transcript.trim())
  }
  recognition.onerror = (event) => options.onError?.(event.error ?? 'unknown')
  recognition.onend = () => options.onEnd?.()

  try {
    recognition.start()
  } catch {
    return null
  }

  return { stop: () => recognition.abort() }
}

let voicesLoaded = false

/** Reads an English word or sentence aloud. Silent if unsupported. */
export function speak(text: string, variety: 'american' | 'british' = 'american'): void {
  if (!isSpeechSynthesisSupported() || text.trim().length === 0) return

  const synth = window.speechSynthesis
  const lang = variety === 'british' ? 'en-GB' : 'en-US'

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  utter.rate = 0.95

  if (!voicesLoaded) {
    // Some browsers populate the voice list asynchronously.
    synth.getVoices()
    voicesLoaded = true
  }
  const voice = synth.getVoices().find((candidate) => candidate.lang === lang)
  if (voice) utter.voice = voice

  synth.cancel()
  synth.speak(utter)
}
