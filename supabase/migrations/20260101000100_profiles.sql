-- ---------------------------------------------------------------------------
-- Profiles and settings. One row per auth user, created by trigger on signup.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  time_zone     text not null default 'UTC',
  locale        text not null default 'en',
  is_admin      boolean not null default false,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) between 1 and 60
  ),
  constraint profiles_time_zone_length check (char_length(time_zone) between 1 and 64)
);

create table public.user_settings (
  user_id            uuid primary key references public.profiles (id) on delete cascade,
  focus              public.training_focus not null default 'both',
  declared_level     text not null default 'unsure',
  problem_contexts   text[] not null default '{}',
  daily_goal_minutes smallint not null default 10,
  input_mode         public.input_mode not null default 'typing',
  english_variety    public.english_variety not null default 'american',
  sound_enabled      boolean not null default true,
  haptics_enabled    boolean not null default true,
  theme              public.theme_preference not null default 'system',
  reminder_enabled   boolean not null default false,
  reminder_time      time,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint user_settings_goal_range check (daily_goal_minutes between 5 and 60),
  constraint user_settings_level_valid check (
    declared_level in ('A2', 'B1', 'B2', 'C1', 'unsure')
  ),
  constraint user_settings_contexts_len check (array_length(problem_contexts, 1) is null
    or array_length(problem_contexts, 1) <= 10)
);

create table public.user_progress (
  user_id         uuid primary key references public.profiles (id) on delete cascade,
  xp              integer not null default 0,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_active_day date,
  streak_freezes  smallint not null default 0,
  total_reviews   integer not null default 0,
  total_sessions  integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint user_progress_non_negative check (
    xp >= 0 and current_streak >= 0 and longest_streak >= 0
    and streak_freezes >= 0 and total_reviews >= 0 and total_sessions >= 0
  )
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

-- Admin is never client-settable. Anything but the service role that tries to
-- change the flag silently keeps the old value.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.role() is distinct from 'service_role' then
    new.is_admin := old.is_admin;
    new.id := old.id;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- New auth user -> profile + settings + progress, in one transaction.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name',
                         new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_progress (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
