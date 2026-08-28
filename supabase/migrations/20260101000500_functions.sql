-- ---------------------------------------------------------------------------
-- Server-side routines.
--
-- Aggregates are always recomputed from review_events rather than incremented,
-- so a retried or duplicated batch can never inflate a learner's numbers.
-- Every function derives the user from auth.uid(); none accepts a user id.
-- ---------------------------------------------------------------------------

create or replace function public.refresh_day_stats(p_day date)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  insert into public.daily_stats as ds (
    user_id, day, seconds_trained, reviews, correct, fast, slow, missed,
    hints_used, xp, words_activated, avg_latency_ms, updated_at
  )
  select
    v_user,
    p_day,
    coalesce(sessions.seconds_trained, 0),
    coalesce(events.reviews, 0),
    coalesce(events.correct, 0),
    coalesce(events.fast, 0),
    coalesce(events.slow, 0),
    coalesce(events.missed, 0),
    coalesce(events.hints_used, 0),
    coalesce(events.xp, 0) + coalesce(sessions.bonus_xp, 0),
    coalesce(events.activated, 0),
    events.avg_latency_ms,
    now()
  from
    (select
       count(*)::int as reviews,
       count(*) filter (where was_correct)::int as correct,
       count(*) filter (where recall_band in ('instant', 'good'))::int as fast,
       count(*) filter (where recall_band in ('slow', 'fragile'))::int as slow,
       count(*) filter (where recall_band = 'failed')::int as missed,
       count(*) filter (where hint_level > 0)::int as hints_used,
       count(*) filter (where word_activated)::int as activated,
       coalesce(sum(xp_awarded), 0)::int as xp,
       (avg(latency_ms) filter (where was_correct))::int as avg_latency_ms
     from public.review_events
     where user_id = v_user and local_day = p_day) as events,
    (select
       (coalesce(sum(duration_ms), 0) / 1000)::int as seconds_trained,
       coalesce(sum(bonus_xp), 0)::int as bonus_xp
     from public.training_sessions
     where user_id = v_user and local_day = p_day and completed_at is not null) as sessions
  on conflict (user_id, day) do update set
    seconds_trained = excluded.seconds_trained,
    reviews         = excluded.reviews,
    correct         = excluded.correct,
    fast            = excluded.fast,
    slow            = excluded.slow,
    missed          = excluded.missed,
    hints_used      = excluded.hints_used,
    xp              = excluded.xp,
    words_activated = excluded.words_activated,
    avg_latency_ms  = excluded.avg_latency_ms,
    updated_at      = now()
  where ds.user_id = v_user;
end;
$$;

create or replace function public.refresh_user_totals()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  update public.user_progress up set
    xp = coalesce((select sum(xp) from public.daily_stats where user_id = v_user), 0),
    total_reviews = coalesce((select count(*) from public.review_events where user_id = v_user), 0),
    total_sessions = coalesce((
      select count(*) from public.training_sessions
      where user_id = v_user and completed_at is not null
    ), 0),
    updated_at = now()
  where up.user_id = v_user;
end;
$$;

create or replace function public.unlock_achievements(p_codes text[])
returns setof text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  return query
  insert into public.user_achievements (user_id, achievement_code)
  select v_user, code
  from unnest(p_codes) as code
  where char_length(code) between 1 and 60
  on conflict (user_id, achievement_code) do nothing
  returning achievement_code;
end;
$$;

create or replace function public.sync_daily_challenges(p_day date, p_rows jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  insert into public.user_daily_challenges as c
    (user_id, day, challenge_code, target, progress, completed_at, xp_awarded)
  select
    v_user,
    p_day,
    row_data ->> 'code',
    (row_data ->> 'target')::int,
    (row_data ->> 'progress')::int,
    case when (row_data ->> 'completed')::boolean then now() else null end,
    case when (row_data ->> 'completed')::boolean then (row_data ->> 'xp')::int else 0 end
  from jsonb_array_elements(p_rows) as row_data
  on conflict (user_id, day, challenge_code) do update set
    target = excluded.target,
    progress = greatest(c.progress, excluded.progress),
    completed_at = coalesce(c.completed_at, excluded.completed_at),
    xp_awarded = greatest(c.xp_awarded, excluded.xp_awarded);
end;
$$;

-- Full account removal. Deleting the auth user cascades through every table
-- that references profiles, so no orphan rows are left behind.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  delete from auth.users where id = v_user;
end;
$$;

-- Latency history for one word, oldest first, for the recall trend chart.
create or replace function public.word_latency_history(p_word_id uuid, p_limit int default 30)
returns table (day date, latency_ms int, was_correct boolean, band public.recall_band)
language sql
stable
security invoker
set search_path = ''
as $$
  select local_day, latency_ms, was_correct, recall_band
  from public.review_events
  where user_id = (select auth.uid()) and word_id = p_word_id
  order by created_at desc
  limit least(greatest(p_limit, 1), 200);
$$;

revoke all on function public.refresh_day_stats(date) from public, anon;
revoke all on function public.refresh_user_totals() from public, anon;
revoke all on function public.unlock_achievements(text[]) from public, anon;
revoke all on function public.sync_daily_challenges(date, jsonb) from public, anon;
revoke all on function public.delete_my_account() from public, anon;
revoke all on function public.word_latency_history(uuid, int) from public, anon;

grant execute on function public.refresh_day_stats(date) to authenticated;
grant execute on function public.refresh_user_totals() to authenticated;
grant execute on function public.unlock_achievements(text[]) to authenticated;
grant execute on function public.sync_daily_challenges(date, jsonb) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.word_latency_history(uuid, int) to authenticated;
