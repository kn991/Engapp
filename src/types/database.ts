/**
 * Database types.
 *
 * Kept in sync with `supabase/migrations`. Regenerate against a running local
 * database with:
 *
 *   pnpm supabase:start && pnpm db:types
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type CefrLevelDb = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type PartOfSpeechDb =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'phrasal_verb'
  | 'collocation'
  | 'idiom'
export type WordStatusDb = 'new' | 'weak' | 'activating' | 'strong' | 'active'
export type ExerciseTypeDb =
  | 'translation_recall'
  | 'context_recall'
  | 'definition_recall'
  | 'cloze'
  | 'collocation'
  | 'word_family'
export type RecallBandDb = 'instant' | 'good' | 'slow' | 'fragile' | 'failed'
export type TrainingFocusDb = 'speaking' | 'writing' | 'both'
export type InputModeDb = 'typing' | 'speaking' | 'mixed'
export type EnglishVarietyDb = 'american' | 'british'
export type ThemePreferenceDb = 'system' | 'light' | 'dark'
export type SessionKindDb = 'daily' | 'diagnostic' | 'practice'

type ProfilesRow = {
  id: string
  display_name: string | null
  time_zone: string
  locale: string
  is_admin: boolean
  onboarded_at: string | null
  created_at: string
  updated_at: string
}

type UserSettingsRow = {
  user_id: string
  focus: TrainingFocusDb
  declared_level: string
  problem_contexts: string[]
  daily_goal_minutes: number
  input_mode: InputModeDb
  english_variety: EnglishVarietyDb
  sound_enabled: boolean
  haptics_enabled: boolean
  theme: ThemePreferenceDb
  reminder_enabled: boolean
  reminder_time: string | null
  created_at: string
  updated_at: string
}

type UserProgressRow = {
  user_id: string
  xp: number
  current_streak: number
  longest_streak: number
  last_active_day: string | null
  streak_freezes: number
  total_reviews: number
  total_sessions: number
  created_at: string
  updated_at: string
}

type WordsRow = {
  id: string
  lemma: string
  part_of_speech: PartOfSpeechDb
  cefr: CefrLevelDb
  russian: string
  definition: string | null
  context_hint: string | null
  primary_answer: string
  accepted_answers: string[]
  tags: string[]
  frequency_rank: number | null
  is_archived: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

type WordExamplesRow = {
  id: string
  word_id: string
  sentence: string
  cloze_sentence: string | null
  translation: string | null
  position: number
}

type WordCollocationsRow = {
  id: string
  word_id: string
  collocation: string
  pattern: string
  meaning_ru: string | null
  position: number
}

type WordFamilyMembersRow = {
  id: string
  word_id: string
  form: string
  part_of_speech: PartOfSpeechDb
  gloss: string | null
  position: number
}

type UserWordsRow = {
  id: string
  user_id: string
  word_id: string
  status: WordStatusDb
  mastery: number
  review_count: number
  correct_count: number
  incorrect_count: number
  fast_recalls: number
  slow_recalls: number
  lapses: number
  hint_count: number
  avg_latency_ms: number | null
  recent_latency_ms: number | null
  best_latency_ms: number | null
  first_latency_ms: number | null
  success_days: number
  last_success_day: string | null
  interval_days: number
  last_reviewed_at: string | null
  next_review_at: string | null
  activated_at: string | null
  was_weak: boolean
  created_at: string
  updated_at: string
}

type TrainingSessionsRow = {
  id: string
  user_id: string
  kind: SessionKindDb
  started_at: string
  completed_at: string | null
  duration_ms: number | null
  planned_count: number
  item_count: number
  correct_count: number
  fast_count: number
  slow_count: number
  missed_count: number
  hint_count: number
  avg_latency_ms: number | null
  xp_earned: number
  words_activated: number
  bonus_xp: number
  local_day: string | null
  created_at: string
}

type ReviewEventsRow = {
  id: string
  user_id: string
  word_id: string
  session_id: string | null
  exercise_type: ExerciseTypeDb
  prompt_ref: string | null
  submitted_answer: string | null
  was_correct: boolean
  is_spelling_slip: boolean
  latency_ms: number
  hint_level: number
  recall_band: RecallBandDb
  mastery_before: number
  mastery_after: number
  scheduled_before: string | null
  scheduled_after: string | null
  xp_awarded: number
  word_activated: boolean
  client_event_id: string
  local_day: string
  created_at: string
}

type DailyStatsRow = {
  user_id: string
  day: string
  seconds_trained: number
  reviews: number
  correct: number
  fast: number
  slow: number
  missed: number
  hints_used: number
  xp: number
  words_activated: number
  avg_latency_ms: number | null
  updated_at: string
}

type UserAcceptedAnswersRow = {
  id: string
  user_id: string
  word_id: string
  answer: string
  created_at: string
}

type UserAchievementsRow = {
  user_id: string
  achievement_code: string
  unlocked_at: string
}

type UserDailyChallengesRow = {
  user_id: string
  day: string
  challenge_code: string
  target: number
  progress: number
  completed_at: string | null
  xp_awarded: number
}

type DiagnosticsRow = {
  id: string
  user_id: string
  items: number
  fast_count: number
  slow_count: number
  missed_count: number
  avg_latency_ms: number | null
  estimated_level: string
  created_at: string
}

type Relationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne: boolean
  referencedRelation: string
  referencedColumns: string[]
}

type TableDefinition<
  Row,
  Insert = Partial<Row>,
  Update = Partial<Row>,
  Rels extends Relationship[] = [],
> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: Rels
}

/** Every child table hangs off `words` through a `word_id` foreign key. */
type WordChildRelationship<Name extends string> = [
  {
    foreignKeyName: `${Name}_word_id_fkey`
    columns: ['word_id']
    isOneToOne: false
    referencedRelation: 'words'
    referencedColumns: ['id']
  },
]

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<ProfilesRow, Partial<ProfilesRow> & { id: string }>
      user_settings: TableDefinition<UserSettingsRow, Partial<UserSettingsRow> & { user_id: string }>
      user_progress: TableDefinition<UserProgressRow, Partial<UserProgressRow> & { user_id: string }>
      words: TableDefinition<
        WordsRow,
        Omit<Partial<WordsRow>, 'lemma' | 'part_of_speech' | 'cefr' | 'russian' | 'primary_answer'> & {
          lemma: string
          part_of_speech: PartOfSpeechDb
          cefr: CefrLevelDb
          russian: string
          primary_answer: string
        }
      >
      word_examples: TableDefinition<
        WordExamplesRow,
        Partial<WordExamplesRow> & { word_id: string; sentence: string },
        Partial<WordExamplesRow>,
        WordChildRelationship<'word_examples'>
      >
      word_collocations: TableDefinition<
        WordCollocationsRow,
        Partial<WordCollocationsRow> & { word_id: string; collocation: string; pattern: string },
        Partial<WordCollocationsRow>,
        WordChildRelationship<'word_collocations'>
      >
      word_family_members: TableDefinition<
        WordFamilyMembersRow,
        Partial<WordFamilyMembersRow> & {
          word_id: string
          form: string
          part_of_speech: PartOfSpeechDb
        },
        Partial<WordFamilyMembersRow>,
        WordChildRelationship<'word_family_members'>
      >
      user_words: TableDefinition<
        UserWordsRow,
        Partial<UserWordsRow> & { user_id: string; word_id: string },
        Partial<UserWordsRow>,
        WordChildRelationship<'user_words'>
      >
      training_sessions: TableDefinition<
        TrainingSessionsRow,
        Partial<TrainingSessionsRow> & { user_id: string }
      >
      review_events: TableDefinition<
        ReviewEventsRow,
        Omit<Partial<ReviewEventsRow>, 'id'> & {
          user_id: string
          word_id: string
          exercise_type: ExerciseTypeDb
          was_correct: boolean
          latency_ms: number
          recall_band: RecallBandDb
          mastery_before: number
          mastery_after: number
          client_event_id: string
          local_day: string
        }
      >
      daily_stats: TableDefinition<DailyStatsRow>
      user_accepted_answers: TableDefinition<
        UserAcceptedAnswersRow,
        Partial<UserAcceptedAnswersRow> & { user_id: string; word_id: string; answer: string }
      >
      user_achievements: TableDefinition<UserAchievementsRow>
      user_daily_challenges: TableDefinition<UserDailyChallengesRow>
      diagnostics: TableDefinition<
        DiagnosticsRow,
        Partial<DiagnosticsRow> & {
          user_id: string
          items: number
          fast_count: number
          slow_count: number
          missed_count: number
          estimated_level: string
        }
      >
    }
    Views: Record<string, never>
    Functions: {
      current_user_is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      refresh_day_stats: { Args: { p_day: string }; Returns: undefined }
      refresh_user_totals: { Args: Record<PropertyKey, never>; Returns: undefined }
      unlock_achievements: { Args: { p_codes: string[] }; Returns: string[] }
      sync_daily_challenges: { Args: { p_day: string; p_rows: Json }; Returns: undefined }
      delete_my_account: { Args: Record<PropertyKey, never>; Returns: undefined }
      new_word_candidates: {
        Args: { p_limit?: number; p_levels?: CefrLevelDb[] | null }
        Returns: Tables<'words'>[]
      }
      recovered_word_count: { Args: Record<PropertyKey, never>; Returns: number }
      most_improved_words: {
        Args: { p_limit?: number }
        Returns: Array<{
          word_id: string
          lemma: string
          first_latency_ms: number
          recent_latency_ms: number
          gain: number
        }>
      }
      tag_mastery: {
        Args: { p_min_words?: number }
        Returns: Array<{ tag: string; words: number; avg_mastery: number }>
      }
      user_word_overview: {
        Args: Record<PropertyKey, never>
        Returns: Array<{
          total: number
          new_count: number
          weak_count: number
          activating: number
          strong_count: number
          active_count: number
          due_now: number
          avg_latency_ms: number | null
          custom_count: number
        }>
      }
      word_latency_history: {
        Args: { p_word_id: string; p_limit?: number }
        Returns: Array<{
          day: string
          latency_ms: number
          was_correct: boolean
          band: RecallBandDb
        }>
      }
    }
    Enums: {
      cefr_level: CefrLevelDb
      part_of_speech: PartOfSpeechDb
      word_status: WordStatusDb
      exercise_type: ExerciseTypeDb
      recall_band: RecallBandDb
      training_focus: TrainingFocusDb
      input_mode: InputModeDb
      english_variety: EnglishVarietyDb
      theme_preference: ThemePreferenceDb
      session_kind: SessionKindDb
    }
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
