-- ---------------------------------------------------------------------------
-- Vocabulary. Curated entries have created_by = null and are readable by every
-- authenticated user. Rows with created_by set are that user's custom words.
-- ---------------------------------------------------------------------------

create table public.words (
  id               uuid primary key default extensions.gen_random_uuid(),
  lemma            text not null,
  part_of_speech   public.part_of_speech not null,
  cefr             public.cefr_level not null,
  russian          text not null,
  definition       text,
  context_hint     text,
  primary_answer   text not null,
  accepted_answers text[] not null default '{}',
  tags             text[] not null default '{}',
  frequency_rank   integer,
  is_archived      boolean not null default false,
  created_by       uuid references public.profiles (id) on delete cascade,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint words_lemma_length check (char_length(lemma) between 1 and 80),
  constraint words_russian_length check (char_length(russian) between 1 and 200),
  constraint words_primary_answer_length check (char_length(primary_answer) between 1 and 80),
  constraint words_definition_length check (definition is null or char_length(definition) <= 300),
  constraint words_context_length check (context_hint is null or char_length(context_hint) <= 300),
  constraint words_accepted_count check (coalesce(array_length(accepted_answers, 1), 0) <= 12),
  constraint words_tags_count check (coalesce(array_length(tags, 1), 0) <= 12)
);

-- One curated entry per lemma + part of speech.
create unique index words_curated_unique
  on public.words (lower(lemma), part_of_speech)
  where created_by is null;

-- A user cannot add the same custom word twice.
create unique index words_custom_unique
  on public.words (created_by, lower(lemma), part_of_speech)
  where created_by is not null;

create index words_curated_lookup
  on public.words (cefr, is_archived)
  where created_by is null;

create index words_owner_idx on public.words (created_by) where created_by is not null;
create index words_tags_idx on public.words using gin (tags);
create index words_search_idx on public.words
  using gin (to_tsvector('simple', lemma || ' ' || russian || ' ' || coalesce(definition, '')));

create table public.word_examples (
  id             uuid primary key default extensions.gen_random_uuid(),
  word_id        uuid not null references public.words (id) on delete cascade,
  sentence       text not null,
  cloze_sentence text,
  translation    text,
  position       smallint not null default 0,
  constraint word_examples_sentence_length check (char_length(sentence) between 1 and 400)
);
create index word_examples_word_idx on public.word_examples (word_id, position);

create table public.word_collocations (
  id           uuid primary key default extensions.gen_random_uuid(),
  word_id      uuid not null references public.words (id) on delete cascade,
  collocation  text not null,
  pattern      text not null,
  meaning_ru   text,
  position     smallint not null default 0,
  constraint word_collocations_length check (char_length(collocation) between 1 and 120)
);
create index word_collocations_word_idx on public.word_collocations (word_id, position);

create table public.word_family_members (
  id             uuid primary key default extensions.gen_random_uuid(),
  word_id        uuid not null references public.words (id) on delete cascade,
  form           text not null,
  part_of_speech public.part_of_speech not null,
  gloss          text,
  position       smallint not null default 0,
  constraint word_family_form_length check (char_length(form) between 1 and 80)
);
create index word_family_word_idx on public.word_family_members (word_id, position);

create trigger words_set_updated_at
  before update on public.words
  for each row execute function public.set_updated_at();

-- Custom words always belong to the caller; curated rows only the service role
-- or an admin can create (enforced by RLS, restated here as a safety net).
create or replace function public.enforce_word_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if new.created_by is null then
    if not exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
    ) then
      raise exception 'only administrators can manage curated vocabulary';
    end if;
  elsif new.created_by is distinct from auth.uid() then
    raise exception 'custom words must belong to the current user';
  end if;

  return new;
end;
$$;

create trigger words_enforce_ownership
  before insert or update on public.words
  for each row execute function public.enforce_word_ownership();
