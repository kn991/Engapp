import { XP } from './config'
import { createRandom, seedFromString } from './random'

/** What a challenge counts. Every metric is derived from the day's reviews. */
export type ChallengeMetric =
  | 'fast_recalls'
  | 'no_hint_reviews'
  | 'weak_recovered'
  | 'collocation_reviews'
  | 'reviews'
  | 'minutes'

export interface ChallengeDefinition {
  code: string
  metric: ChallengeMetric
  target: number
  title: string
  description: string
}

const POOL: ChallengeDefinition[] = [
  {
    code: 'fast_10',
    metric: 'fast_recalls',
    target: 10,
    title: 'Under three seconds',
    description: 'Recall 10 words in under 2.5 seconds.',
  },
  {
    code: 'no_hint_15',
    metric: 'no_hint_reviews',
    target: 15,
    title: 'No help needed',
    description: 'Complete 15 reviews without a hint.',
  },
  {
    code: 'weak_5',
    metric: 'weak_recovered',
    target: 5,
    title: 'Repair work',
    description: 'Get 5 weak words right.',
  },
  {
    code: 'colloc_5',
    metric: 'collocation_reviews',
    target: 5,
    title: 'Words that travel together',
    description: 'Practise 5 collocations.',
  },
  {
    code: 'reviews_25',
    metric: 'reviews',
    target: 25,
    title: 'Full round',
    description: 'Complete 25 reviews today.',
  },
  {
    code: 'minutes_10',
    metric: 'minutes',
    target: 10,
    title: 'Ten minutes',
    description: 'Train for 10 minutes.',
  },
  {
    code: 'fast_20',
    metric: 'fast_recalls',
    target: 20,
    title: 'Quick round',
    description: 'Recall 20 words in under 2.5 seconds.',
  },
]

export interface ChallengeProgressInput {
  fastRecalls: number
  noHintReviews: number
  weakRecovered: number
  collocationReviews: number
  reviews: number
  minutes: number
}

export interface DailyChallenge extends ChallengeDefinition {
  progress: number
  completed: boolean
  xp: number
}

/**
 * Picks the day's challenges deterministically from the user id and date, so
 * every device shows the same set and nothing needs to be pre-generated.
 */
export function challengesForDay(userId: string, day: string, count = 3): ChallengeDefinition[] {
  const random = createRandom(seedFromString(`${userId}:${day}`))
  const pool = [...POOL]
  const picked: ChallengeDefinition[] = []
  const usedMetrics = new Set<ChallengeMetric>()

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length) % pool.length
    const [candidate] = pool.splice(index, 1)
    if (!candidate) continue
    if (usedMetrics.has(candidate.metric)) continue
    usedMetrics.add(candidate.metric)
    picked.push(candidate)
  }

  return picked
}

export function evaluateChallenges(
  definitions: readonly ChallengeDefinition[],
  progress: ChallengeProgressInput
): DailyChallenge[] {
  return definitions.map((definition) => {
    const value = valueFor(definition.metric, progress)
    return {
      ...definition,
      progress: Math.min(1, value / Math.max(1, definition.target)),
      completed: value >= definition.target,
      xp: XP.challengeCompleteBonus,
    }
  })
}

function valueFor(metric: ChallengeMetric, p: ChallengeProgressInput): number {
  switch (metric) {
    case 'fast_recalls':
      return p.fastRecalls
    case 'no_hint_reviews':
      return p.noHintReviews
    case 'weak_recovered':
      return p.weakRecovered
    case 'collocation_reviews':
      return p.collocationReviews
    case 'reviews':
      return p.reviews
    case 'minutes':
      return p.minutes
  }
}
