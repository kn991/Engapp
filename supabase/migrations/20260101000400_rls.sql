-- ---------------------------------------------------------------------------
-- Row level security.
--
-- Default posture: every table is locked, anon gets nothing, and an
-- authenticated user reaches exactly their own rows. Curated vocabulary is the
-- single shared, read-only exception.
-- ---------------------------------------------------------------------------

alter table public.profiles              enable row level security;
alter table public.user_settings         enable row level security;
alter table public.user_progress         enable row level security;
alter table public.words                 enable row level security;
alter table public.word_examples         enable row level security;
alter table public.word_collocations     enable row level security;
alter table public.word_family_members   enable row level security;
alter table public.user_words            enable row level security;
alter table public.training_sessions     enable row level security;
alter table public.review_events         enable row level security;
alter table public.daily_stats           enable row level security;
alter table public.user_accepted_answers enable row level security;
alter table public.user_achievements     enable row level security;
alter table public.user_daily_challenges enable row level security;
alter table public.diagnostics           enable row level security;

revoke all on all tables in schema public from anon, authenticated;

-- Minimum grants. RLS narrows these to the caller's own rows.
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_settings to authenticated;
grant select, update on public.user_progress to authenticated;
grant select on public.words, public.word_examples, public.word_collocations,
  public.word_family_members to authenticated;
grant insert, update, delete on public.words, public.word_examples,
  public.word_collocations, public.word_family_members to authenticated;
grant select, insert, update, delete on public.user_words to authenticated;
grant select, insert, update on public.training_sessions to authenticated;
grant select, insert on public.review_events to authenticated;
grant select on public.daily_stats to authenticated;
grant select, insert, delete on public.user_accepted_answers to authenticated;
grant select on public.user_achievements to authenticated;
grant select on public.user_daily_challenges to authenticated;
grant select, insert on public.diagnostics to authenticated;

-- Reusable admin check. security definer so the policy can read profiles
-- without recursing through the profiles policy.
create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = (select auth.uid())),
    false
  );
$$;

grant execute on function public.current_user_is_admin() to authenticated;

-- ------------------------------- profiles ---------------------------------

create policy "profiles are self readable"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id or public.current_user_is_admin());

create policy "profiles are self writable"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ----------------------------- user_settings ------------------------------

create policy "settings are self readable"
  on public.user_settings for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "settings are self insertable"
  on public.user_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "settings are self writable"
  on public.user_settings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ----------------------------- user_progress ------------------------------

create policy "progress is self readable"
  on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "progress is self writable"
  on public.user_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- --------------------------------- words ----------------------------------

create policy "curated and own words are readable"
  on public.words for select to authenticated
  using (
    (created_by is null and not is_archived)
    or created_by = (select auth.uid())
    or public.current_user_is_admin()
  );

create policy "own custom words are insertable"
  on public.words for insert to authenticated
  with check (created_by = (select auth.uid()) or public.current_user_is_admin());

create policy "own custom words are updatable"
  on public.words for update to authenticated
  using (created_by = (select auth.uid()) or public.current_user_is_admin())
  with check (created_by = (select auth.uid()) or public.current_user_is_admin());

create policy "own custom words are deletable"
  on public.words for delete to authenticated
  using (created_by = (select auth.uid()) or public.current_user_is_admin());

-- Word detail tables follow their parent word.
create policy "word examples follow the word"
  on public.word_examples for select to authenticated
  using (exists (select 1 from public.words w where w.id = word_id));

create policy "word examples are writable with the word"
  on public.word_examples for all to authenticated
  using (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ))
  with check (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ));

create policy "collocations follow the word"
  on public.word_collocations for select to authenticated
  using (exists (select 1 from public.words w where w.id = word_id));

create policy "collocations are writable with the word"
  on public.word_collocations for all to authenticated
  using (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ))
  with check (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ));

create policy "families follow the word"
  on public.word_family_members for select to authenticated
  using (exists (select 1 from public.words w where w.id = word_id));

create policy "families are writable with the word"
  on public.word_family_members for all to authenticated
  using (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ))
  with check (exists (
    select 1 from public.words w
    where w.id = word_id and (w.created_by = (select auth.uid()) or public.current_user_is_admin())
  ));

-- ------------------------------- user_words -------------------------------

create policy "user words are self managed"
  on public.user_words for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ---------------------------- training_sessions ---------------------------

create policy "sessions are self readable"
  on public.training_sessions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "sessions are self insertable"
  on public.training_sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "sessions are self updatable"
  on public.training_sessions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ------------------------------ review_events -----------------------------
-- Append only: a learner may write and read their history, never rewrite it.

create policy "review events are self readable"
  on public.review_events for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "review events are self insertable"
  on public.review_events for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- ------------------------------- daily_stats ------------------------------
-- Written only by the refresh function, which recomputes from review events.

create policy "daily stats are self readable"
  on public.daily_stats for select to authenticated
  using ((select auth.uid()) = user_id);

-- -------------------------- user_accepted_answers -------------------------

create policy "accepted answers are self readable"
  on public.user_accepted_answers for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "accepted answers are self insertable"
  on public.user_accepted_answers for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "accepted answers are self deletable"
  on public.user_accepted_answers for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------- achievements and challenges -----------------------

create policy "achievements are self readable"
  on public.user_achievements for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "challenges are self readable"
  on public.user_daily_challenges for select to authenticated
  using ((select auth.uid()) = user_id);

-- ------------------------------- diagnostics ------------------------------

create policy "diagnostics are self readable"
  on public.diagnostics for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "diagnostics are self insertable"
  on public.diagnostics for insert to authenticated
  with check ((select auth.uid()) = user_id);
