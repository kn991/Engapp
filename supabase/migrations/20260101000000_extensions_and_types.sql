-- ---------------------------------------------------------------------------
-- Verba: extensions, enums and shared helpers.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "citext" with schema extensions;

create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

create type public.part_of_speech as enum (
  'noun', 'verb', 'adjective', 'adverb',
  'phrase', 'phrasal_verb', 'collocation', 'idiom'
);

create type public.word_status as enum ('new', 'weak', 'activating', 'strong', 'active');

create type public.exercise_type as enum (
  'translation_recall', 'context_recall', 'definition_recall',
  'cloze', 'collocation', 'word_family'
);

create type public.recall_band as enum ('instant', 'good', 'slow', 'fragile', 'failed');

create type public.training_focus as enum ('speaking', 'writing', 'both');

create type public.input_mode as enum ('typing', 'speaking', 'mixed');

create type public.english_variety as enum ('american', 'british');

create type public.theme_preference as enum ('system', 'light', 'dark');

create type public.session_kind as enum ('daily', 'diagnostic', 'practice');

-- Keeps updated_at honest without trusting the client.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
