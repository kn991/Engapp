-- ---------------------------------------------------------------------------
-- Per-user learning state, review history and aggregates.
-- ---------------------------------------------------------------------------

create table public.user_words (
  id                 uuid primary key default extensions.gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  word_id            uuid not null references public.words (id) on delete cascade,
  status             public.word_status not null default 'new',
  mastery            smallint not null default 0,
  review_count       integer not null default 0,
  correct_count      integer not null default 0,
  incorrect_count    integer not null default 0,
  fast_recalls       integer not null default 0,
  slow_recalls       integer not null default 0,
  lapses             integer not null default 0,
  hint_count         integer not null default 0,
  avg_latency_ms     integer,
  recent_latency_ms  integer,
  best_latency_ms    integer,
  first_latency_ms   integer,
  success_days       smallint not null default 0,
  last_success_day   date,
  interval_days      numeric(6, 2) not null default 0,
  last_reviewed_at   timestamptz,
  next_review_at     timestamptz,
  activated_at       timestamptz,
  /** Set when the word has ever dropped to weak, for the comeback achievement. */
  was_weak           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint user_words_unique unique (user_id, word_id),
  constraint user_words_mastery_range check (mastery between 0 and 100),
  constraint user_words_counts_non_negative check (
    review_count >= 0 and correct_count >= 0 and incorrect_count >= 0
    and fast_recalls >= 0 and slow_recalls >= 0 and lapses >= 0 and hint_count >= 0
  ),
  constraint user_words_latency_sane check (
    (avg_latency_ms is null or avg_latency_ms between 0 and 600000)
    and (recent_latency_ms is null or recent_latency_ms between 0 and 600000)
  )
);

-- The two hot paths: "what is due for me" and "show me my weak words".
create index user_words_due_idx on public.user_words (user_id, next_review_at);
create index user_words_status_idx on public.user_words (user_id, status);
create index user_words_word_idx on public.user_words (word_id);
create index user_words_activated_idx on public.user_words (user_id, activated_at)
  where activated_at is not null;

create table public.training_sessions (
  id              uuid primary key default extensions.gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  kind            public.session_kind not null default 'daily',
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  duration_ms     integer,
  planned_count   smallint not null default 0,
  item_count      smallint not null default 0,
  correct_count   smallint not null default 0,
  fast_count      smallint not null default 0,
  slow_count      smallint not null default 0,
  missed_count    smallint not null default 0,
  hint_count      smallint not null default 0,
  avg_latency_ms  integer,
  xp_earned       integer not null default 0,
  words_activated smallint not null default 0,
  bonus_xp        integer not null default 0,
  local_day       date,
  created_at      timestamptz not null default now(),
  constraint training_sessions_duration_sane check (
    duration_ms is null or duration_ms between 0 and 86400000
  )
);
create index training_sessions_user_idx on public.training_sessions (user_id, started_at desc);
create index training_sessions_completed_idx on public.training_sessions (user_id, completed_at desc)
  where completed_at is not null;
create index training_sessions_day_idx on public.training_sessions (user_id, local_day);

create table public.review_events (
  id               uuid primary key default extensions.gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  word_id          uuid not null references public.words (id) on delete cascade,
  session_id       uuid references public.training_sessions (id) on delete set null,
  exercise_type    public.exercise_type not null,
  prompt_ref       text,
  submitted_answer text,
  was_correct      boolean not null,
  is_spelling_slip boolean not null default false,
  latency_ms       integer not null,
  hint_level       smallint not null default 0,
  recall_band      public.recall_band not null,
  mastery_before   smallint not null,
  mastery_after    smallint not null,
  scheduled_before timestamptz,
  scheduled_after  timestamptz,
  xp_awarded       smallint not null default 0,
  /** True when this answer is the one that moved the word to active. */
  word_activated   boolean not null default false,
  /** Idempotency key generated on the client so retries never double-write. */
  client_event_id  uuid not null,
  local_day        date not null,
  created_at       timestamptz not null default now(),
  constraint review_events_latency_sane check (latency_ms between 0 and 600000),
  constraint review_events_hint_range check (hint_level between 0 and 4),
  constraint review_events_answer_length check (
    submitted_answer is null or char_length(submitted_answer) <= 200
  ),
  constraint review_events_client_unique unique (user_id, client_event_id)
);
create index review_events_user_time_idx on public.review_events (user_id, created_at desc);
create index review_events_user_day_idx on public.review_events (user_id, local_day);
create index review_events_word_idx on public.review_events (user_id, word_id, created_at desc);
create index review_events_session_idx on public.review_events (session_id);

create table public.daily_stats (
  user_id         uuid not null references public.profiles (id) on delete cascade,
  day             date not null,
  seconds_trained integer not null default 0,
  reviews         integer not null default 0,
  correct         integer not null default 0,
  fast            integer not null default 0,
  slow            integer not null default 0,
  missed          integer not null default 0,
  hints_used      integer not null default 0,
  xp              integer not null default 0,
  words_activated integer not null default 0,
  avg_latency_ms  integer,
  updated_at      timestamptz not null default now(),
  primary key (user_id, day)
);
create index daily_stats_user_day_idx on public.daily_stats (user_id, day desc);

create table public.user_accepted_answers (
  id         uuid primary key default extensions.gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  word_id    uuid not null references public.words (id) on delete cascade,
  answer     text not null,
  created_at timestamptz not null default now(),
  constraint user_accepted_answers_length check (char_length(answer) between 1 and 80),
  constraint user_accepted_answers_unique unique (user_id, word_id, answer)
);
create index user_accepted_answers_lookup on public.user_accepted_answers (user_id, word_id);

create table public.user_achievements (
  user_id          uuid not null references public.profiles (id) on delete cascade,
  achievement_code text not null,
  unlocked_at      timestamptz not null default now(),
  primary key (user_id, achievement_code),
  constraint user_achievements_code_length check (char_length(achievement_code) between 1 and 60)
);

create table public.user_daily_challenges (
  user_id        uuid not null references public.profiles (id) on delete cascade,
  day            date not null,
  challenge_code text not null,
  target         integer not null,
  progress       integer not null default 0,
  completed_at   timestamptz,
  xp_awarded     integer not null default 0,
  primary key (user_id, day, challenge_code)
);
create index user_daily_challenges_day_idx on public.user_daily_challenges (user_id, day desc);

create table public.diagnostics (
  id               uuid primary key default extensions.gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  items            smallint not null,
  fast_count       smallint not null,
  slow_count       smallint not null,
  missed_count     smallint not null,
  avg_latency_ms   integer,
  estimated_level  text not null,
  created_at       timestamptz not null default now(),
  constraint diagnostics_items_positive check (items > 0)
);
create index diagnostics_user_idx on public.diagnostics (user_id, created_at desc);

create trigger user_words_set_updated_at
  before update on public.user_words
  for each row execute function public.set_updated_at();
