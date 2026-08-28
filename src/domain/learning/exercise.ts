import { EXERCISE_LADDER } from './config'
import type {
  ExerciseType,
  SessionItem,
  SessionItemSource,
  UserWordState,
  Word,
} from './types'

/** Exercise formats a given entry actually has the content to support. */
export function supportedExerciseTypes(word: Word): ExerciseType[] {
  const types: ExerciseType[] = ['translation_recall']
  if (word.contextHint) types.push('context_recall')
  if (word.definition) types.push('definition_recall')
  if (word.examples.some((e) => e.clozeSentence)) types.push('cloze')
  if (word.collocations.some((c) => c.pattern.includes('___'))) types.push('collocation')
  if (word.family.length > 0) types.push('word_family')
  return types
}

/**
 * Picks the format for one review.
 *
 * The ladder removes scaffolding as the word gets more active: Russian cue,
 * then situation, then an English definition, then a gap in a sentence. When a
 * word lapses its mastery falls, which automatically walks it back down to
 * more explicit cues.
 */
export function chooseExerciseType(
  word: Word,
  state: UserWordState,
  random: () => number
): ExerciseType {
  const supported = new Set(supportedExerciseTypes(word))
  const rung = EXERCISE_LADDER.find((entry) => state.mastery >= entry.minMastery)
  const preferred = (rung?.types ?? []).filter((type) => supported.has(type))

  // Word families are a spice, not a staple.
  const pool = preferred.filter((type) => type !== 'word_family' || random() < 0.2)
  const usable = pool.length > 0 ? pool : preferred

  if (usable.length === 0) return 'translation_recall'
  return usable[Math.floor(random() * usable.length) % usable.length] ?? 'translation_recall'
}

function firstCloze(word: Word): string | null {
  return word.examples.find((e) => e.clozeSentence)?.clozeSentence ?? null
}

function firstSentence(word: Word): string | null {
  return word.examples[0]?.sentence ?? null
}

/** Derives the hidden tokens of a collocation pattern such as `___ a decision`. */
export function collocationAnswer(collocation: string, pattern: string): string | null {
  const patternTokens = pattern.split(/\s+/)
  const fullTokens = collocation.split(/\s+/)
  if (patternTokens.length !== fullTokens.length) return null
  const missing: string[] = []
  for (let i = 0; i < patternTokens.length; i += 1) {
    if (patternTokens[i] === '___') {
      const token = fullTokens[i]
      if (!token) return null
      missing.push(token)
    }
  }
  return missing.length > 0 ? missing.join(' ') : null
}

export interface BuildItemInput {
  word: Word
  state: UserWordState
  exerciseType: ExerciseType
  source: SessionItemSource
  id: string
  random: () => number
}

/** Turns a word plus a chosen format into the exact question shown on screen. */
export function buildSessionItem(input: BuildItemInput): SessionItem {
  const { word, state, source, id, random } = input
  let exerciseType = input.exerciseType

  const base = {
    id,
    word,
    state,
    source,
    acceptedAnswers: word.acceptedAnswers,
    answer: word.primaryAnswer,
    reveal: firstSentence(word),
  }

  switch (exerciseType) {
    case 'context_recall': {
      if (!word.contextHint) break
      return {
        ...base,
        exerciseType,
        prompt: word.contextHint,
        promptSecondary: firstCloze(word),
        promptLang: 'en',
      }
    }
    case 'definition_recall': {
      if (!word.definition) break
      return {
        ...base,
        exerciseType,
        prompt: word.definition,
        promptSecondary: null,
        promptLang: 'en',
      }
    }
    case 'cloze': {
      const cloze = firstCloze(word)
      if (!cloze) break
      return {
        ...base,
        exerciseType,
        prompt: cloze,
        promptSecondary: null,
        promptLang: 'en',
        reveal: firstSentence(word),
      }
    }
    case 'collocation': {
      const usable = word.collocations.filter((c) => c.pattern.includes('___'))
      const picked = usable[Math.floor(random() * usable.length) % Math.max(usable.length, 1)]
      const answer = picked ? collocationAnswer(picked.collocation, picked.pattern) : null
      if (!picked || !answer) break
      return {
        ...base,
        exerciseType,
        prompt: picked.pattern,
        promptSecondary: picked.meaningRu,
        promptLang: 'en',
        answer,
        acceptedAnswers: [answer],
        reveal: picked.collocation,
      }
    }
    case 'word_family': {
      const picked = word.family[Math.floor(random() * word.family.length) % Math.max(word.family.length, 1)]
      if (!picked) break
      return {
        ...base,
        exerciseType,
        prompt: picked.gloss ?? `${word.lemma} → ${picked.partOfSpeech}`,
        promptSecondary: `from “${word.lemma}” · ${picked.partOfSpeech.replace('_', ' ')}`,
        promptLang: picked.gloss ? 'ru' : 'en',
        answer: picked.form,
        acceptedAnswers: [picked.form],
        reveal: null,
      }
    }
    default:
      break
  }

  exerciseType = 'translation_recall'
  return {
    ...base,
    exerciseType,
    prompt: word.russian,
    promptSecondary: firstCloze(word) ?? word.contextHint,
    promptLang: 'ru',
  }
}

export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  translation_recall: 'Recall',
  context_recall: 'In situation',
  definition_recall: 'From definition',
  cloze: 'Fill the gap',
  collocation: 'Collocation',
  word_family: 'Word family',
}

/** One short line telling the learner what is being asked of them. */
export const EXERCISE_INSTRUCTIONS: Record<ExerciseType, string> = {
  translation_recall: 'Write the English word',
  context_recall: 'Which English word fits?',
  definition_recall: 'Which word is this?',
  cloze: 'Complete the sentence',
  collocation: 'Complete the phrase',
  word_family: 'Write the right form',
}
