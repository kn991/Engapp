import { z } from 'zod'
import {
  CEFR_LEVELS,
  DAILY_GOAL_OPTIONS,
  EXERCISE_TYPES,
  PARTS_OF_SPEECH,
} from '@/domain/learning'

export const uuidSchema = z.string().uuid()
export const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a YYYY-MM-DD day')

export const attemptSchema = z.object({
  clientEventId: uuidSchema,
  wordId: uuidSchema,
  exerciseType: z.enum(EXERCISE_TYPES),
  /** The exact prompt shown, kept for later analysis. */
  promptRef: z.string().max(200).nullable().default(null),
  submittedAnswer: z.string().max(200),
  latencyMs: z.number().int().min(0).max(600_000),
  hintLevel: z.number().int().min(0).max(4),
  revealed: z.boolean(),
  localDay: daySchema,
  /** Client supplied so the interval fuzz matches the local preview exactly. */
  fuzz: z.number().min(0).max(1),
})

export type AttemptPayload = z.infer<typeof attemptSchema>

export const reviewBatchSchema = z.object({
  sessionId: uuidSchema.nullable(),
  attempts: z.array(attemptSchema).min(1).max(60),
})

export const completeSessionSchema = z.object({
  sessionId: uuidSchema,
  durationMs: z.number().int().min(0).max(86_400_000),
  localDay: daySchema,
})

export const onboardingSchema = z.object({
  focus: z.enum(['speaking', 'writing', 'both']),
  declaredLevel: z.enum(['A2', 'B1', 'B2', 'C1', 'unsure']),
  problemContexts: z.array(z.string().min(1).max(30)).max(10),
  dailyGoalMinutes: z.union(
    DAILY_GOAL_OPTIONS.map((value) => z.literal(value)) as unknown as [
      z.ZodLiteral<number>,
      z.ZodLiteral<number>,
      ...z.ZodLiteral<number>[],
    ]
  ),
  timeZone: z.string().min(1).max(64),
  displayName: z.string().trim().min(1).max(60).optional(),
})

export const settingsSchema = z.object({
  displayName: z.string().trim().max(60).optional(),
  dailyGoalMinutes: z.number().int().min(5).max(60).optional(),
  declaredLevel: z.enum(['A2', 'B1', 'B2', 'C1', 'unsure']).optional(),
  inputMode: z.enum(['typing', 'speaking', 'mixed']).optional(),
  englishVariety: z.enum(['american', 'british']).optional(),
  soundEnabled: z.boolean().optional(),
  hapticsEnabled: z.boolean().optional(),
  theme: z.enum(['system', 'light', 'dark']).optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  timeZone: z.string().min(1).max(64).optional(),
})

export const customWordSchema = z.object({
  lemma: z.string().trim().min(1).max(80),
  partOfSpeech: z.enum(PARTS_OF_SPEECH),
  cefr: z.enum(CEFR_LEVELS),
  russian: z.string().trim().min(1).max(200),
  definition: z.string().trim().max(300).optional(),
  contextHint: z.string().trim().max(300).optional(),
  example: z.string().trim().max(400).optional(),
  acceptedAnswers: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  tags: z.array(z.string().trim().min(1).max(30)).max(12).default([]),
})

export const acceptAnswerSchema = z.object({
  wordId: uuidSchema,
  answer: z.string().trim().min(1).max(80),
})

export const diagnosticResultSchema = z.object({
  items: z.number().int().min(1).max(100),
  fastCount: z.number().int().min(0).max(100),
  slowCount: z.number().int().min(0).max(100),
  missedCount: z.number().int().min(0).max(100),
  avgLatencyMs: z.number().int().min(0).max(600_000).nullable(),
  estimatedLevel: z.enum(['A2', 'B1', 'B2', 'C1']),
  /** Words the learner produced quickly, so we can seed them as known. */
  strongWordIds: z.array(uuidSchema).max(100),
  weakWordIds: z.array(uuidSchema).max(100),
  timeZone: z.string().min(1).max(64),
})

export const adminWordSchema = customWordSchema.extend({
  id: uuidSchema.optional(),
  isArchived: z.boolean().optional(),
  examples: z
    .array(
      z.object({
        sentence: z.string().trim().min(1).max(400),
        clozeSentence: z.string().trim().max(400).nullable().default(null),
      })
    )
    .max(5)
    .default([]),
  collocations: z
    .array(
      z.object({
        collocation: z.string().trim().min(1).max(120),
        pattern: z.string().trim().min(1).max(120),
        meaningRu: z.string().trim().max(200).nullable().default(null),
      })
    )
    .max(6)
    .default([]),
})
