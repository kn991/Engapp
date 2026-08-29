import type { SessionItem } from './types'

export const MAX_HINT_LEVEL = 3

export interface Hint {
  level: number
  label: string
  text: string
}

/**
 * Progressive help.
 *
 * Level 1 narrows the meaning without giving away any letters, so it still
 * counts as recall (one band slower). Levels 2 and 3 hand over part of the
 * word itself, which is why they are scored as a failed retrieval.
 */
export function hintForLevel(item: SessionItem, level: number): Hint | null {
  const answer = item.answer.trim()
  if (level <= 0 || answer.length === 0) return null

  switch (level) {
    case 1: {
      const pos = item.word.partOfSpeech.replace('_', ' ')
      const extra =
        item.exerciseType === 'translation_recall'
          ? (item.word.definition ?? item.word.contextHint)
          : item.word.russian
      return {
        level,
        label: 'Meaning',
        text: extra ? `${pos} · ${extra}` : pos,
      }
    }
    case 2:
      return { level, label: 'First letter', text: maskAnswer(answer, 1) }
    default:
      return {
        level,
        label: 'More letters',
        text: maskAnswer(answer, Math.max(2, Math.ceil(answer.replace(/\s/g, '').length / 3))),
      }
  }
}

/** `avoid` with 1 revealed letter becomes `a · · · ·`. */
export function maskAnswer(answer: string, revealed: number): string {
  let shown = 0
  return answer
    .split('')
    .map((char) => {
      if (char === ' ') return '  '
      if (shown < revealed) {
        shown += 1
        return char
      }
      return '·'
    })
    .join(' ')
    .replace(/\s{3,}/g, '   ')
}

/** Hints are scored as a cost, so the UI can warn before one is taken. */
export function hintCostLabel(level: number): string {
  if (level <= 1) return 'Counts as a slower recall'
  return 'Counts as a missed recall'
}
