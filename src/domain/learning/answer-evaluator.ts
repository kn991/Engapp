import {
  SPELLING_SLIP_MAX_EDIT_DISTANCE,
  SPELLING_TOLERANCE_MIN_LENGTH,
} from './config'

export type AnswerVerdict = 'correct' | 'spelling' | 'incorrect' | 'empty'

export interface EvaluationResult {
  verdict: AnswerVerdict
  /** The accepted answer the submission was matched against, if any. */
  matched: string | null
  /** Edit distance to `matched`, for spelling slips. */
  distance: number
  normalized: string
}

export interface EvaluateOptions {
  /** Canonical answer. */
  expected: string
  /** Other answers that are equally right for this exercise. */
  accepted?: readonly string[]
  /**
   * Answers the learner personally asked us to accept for this exercise.
   * Treated exactly like `accepted`.
   */
  userAccepted?: readonly string[]
  /**
   * Other English words the learner is currently studying. If the submission
   * is exactly one of them it is a different word, never a typo.
   */
  otherKnownAnswers?: readonly string[]
}

const LEADING_NOISE = /^(?:to|a|an|the)\s+/i
const PUNCTUATION = /[.,!?;:"'`’“”()[\]{}<>]/g

/**
 * Normalises a submission for comparison: case, surrounding and repeated
 * whitespace, common punctuation, curly quotes, and the leading `to` / article
 * that learners add inconsistently.
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .normalize('NFKC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(PUNCTUATION, ' ')
    .replace(/[-–—_/]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Strips the grammatical noise that should never decide right vs wrong. */
export function canonicalize(raw: string): string {
  let value = normalizeAnswer(raw)
  // Strip at most one leading marker: "to look up" -> "look up".
  value = value.replace(LEADING_NOISE, '')
  return value.trim()
}

/**
 * Optimal string alignment distance (Levenshtein plus adjacent transposition),
 * so `recieve` -> `receive` costs 1 rather than 2.
 */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const rows = a.length + 1
  const cols = b.length + 1
  const d = new Array<number>(rows * cols)

  for (let i = 0; i < rows; i += 1) d[i * cols] = i
  for (let j = 0; j < cols; j += 1) d[j] = j

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let value = Math.min(
        (d[(i - 1) * cols + j] ?? 0) + 1,
        (d[i * cols + j - 1] ?? 0) + 1,
        (d[(i - 1) * cols + j - 1] ?? 0) + cost
      )
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, (d[(i - 2) * cols + j - 2] ?? 0) + cost)
      }
      d[i * cols + j] = value
    }
  }

  return d[a.length * cols + b.length] ?? Math.max(a.length, b.length)
}

/** How much misspelling we forgive for a target of this length. */
export function spellingToleranceFor(target: string): number {
  const letters = target.replace(/\s/g, '').length
  if (letters < SPELLING_TOLERANCE_MIN_LENGTH) return 0
  if (letters < 8) return 1
  return SPELLING_SLIP_MAX_EDIT_DISTANCE
}

function isPlausibleTypo(submitted: string, target: string): number | null {
  const tolerance = spellingToleranceFor(target)
  if (tolerance === 0) return null
  // A typo keeps the opening sound. `affect` is not a misspelling of `effect`.
  if (submitted[0] !== target[0]) return null
  // Multi-word answers must keep the same number of words.
  const subWords = submitted.split(' ')
  const targetWords = target.split(' ')
  if (subWords.length !== targetWords.length) return null
  if (Math.abs(submitted.length - target.length) > tolerance) return null

  const distance = editDistance(submitted, target)
  return distance > 0 && distance <= tolerance ? distance : null
}

/**
 * Grades one submission.
 *
 * Three outcomes matter to the learner: the word came out, the word came out
 * with a slipped letter, or the word did not come out. We separate the middle
 * case because a misspelling is a spelling problem, not a recall failure, and
 * being told "wrong" for it is the fastest way to make someone quit.
 */
export function evaluateAnswer(
  submission: string,
  options: EvaluateOptions
): EvaluationResult {
  const normalized = canonicalize(submission)
  if (normalized.length === 0) {
    return { verdict: 'empty', matched: null, distance: 0, normalized: '' }
  }

  const candidates = dedupe([
    options.expected,
    ...(options.accepted ?? []),
    ...(options.userAccepted ?? []),
  ])

  for (const candidate of candidates) {
    if (canonicalize(candidate) === normalized) {
      return { verdict: 'correct', matched: candidate, distance: 0, normalized }
    }
  }

  // A submission that exactly equals another word being studied is that other
  // word, however close it looks to the target.
  const others = (options.otherKnownAnswers ?? []).map(canonicalize)
  if (others.includes(normalized)) {
    return { verdict: 'incorrect', matched: null, distance: 0, normalized }
  }

  let best: { candidate: string; distance: number } | null = null
  for (const candidate of candidates) {
    const target = canonicalize(candidate)
    const distance = isPlausibleTypo(normalized, target)
    if (distance != null && (best === null || distance < best.distance)) {
      best = { candidate, distance }
    }
  }

  if (best) {
    return {
      verdict: 'spelling',
      matched: best.candidate,
      distance: best.distance,
      normalized,
    }
  }

  return { verdict: 'incorrect', matched: null, distance: 0, normalized }
}

export function isAcceptedVerdict(verdict: AnswerVerdict): boolean {
  return verdict === 'correct' || verdict === 'spelling'
}

function dedupe(values: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const trimmed = value?.trim()
    if (!trimmed) continue
    const key = canonicalize(trimmed)
    if (key.length === 0 || seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }
  return out
}
