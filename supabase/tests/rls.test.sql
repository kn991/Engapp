-- ---------------------------------------------------------------------------
-- Row level security tests.
--
--   supabase test db
--
-- These are the guarantees the application depends on: a learner reaches only
-- their own rows, cannot write into anyone else's, cannot appoint themselves
-- an administrator, and cannot edit the shared vocabulary.
-- ---------------------------------------------------------------------------

begin;

create extension if not exists pgtap with schema extensions;

select plan(24);

-- ------------------------------- fixtures ---------------------------------

insert into auth.users (id, email, raw_user_meta_data)
values
  ('11111111-1111-4111-8111-111111111111', 'learner-a@example.test', '{}'::jsonb),
  ('22222222-2222-4222-8222-222222222222', 'learner-b@example.test', '{}'::jsonb),
  ('33333333-3333-4333-8333-333333333333', 'admin@example.test', '{}'::jsonb);

update public.profiles set is_admin = true where id = '33333333-3333-4333-8333-333333333333';

insert into public.words (id, lemma, part_of_speech, cefr, russian, primary_answer, created_by)
values ('99999999-9999-4999-8999-999999999999', 'testword', 'verb', 'B1', 'тест', 'testword', null)
on conflict (id) do nothing;

insert into public.user_words (user_id, word_id)
values ('11111111-1111-4111-8111-111111111111', '99999999-9999-4999-8999-999999999999');

insert into public.review_events
  (user_id, word_id, exercise_type, was_correct, latency_ms, recall_band,
   mastery_before, mastery_after, client_event_id, local_day)
values
  ('11111111-1111-4111-8111-111111111111', '99999999-9999-4999-8999-999999999999',
   'translation_recall', true, 1800, 'instant', 0, 12,
   '44444444-4444-4444-8444-444444444444', current_date);

-- --------------------------- the profile trigger --------------------------

select is(
  (select count(*) from public.profiles),
  3::bigint,
  'signing up creates a profile row for every auth user'
);

select is(
  (select count(*) from public.user_settings),
  3::bigint,
  'signing up creates a settings row'
);

select is(
  (select count(*) from public.user_progress),
  3::bigint,
  'signing up creates a progress row'
);

-- ------------------------------- learner A --------------------------------

set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-1111-4111-8111-111111111111';
set local "request.jwt.claim.role" = 'authenticated';

select is((select count(*) from public.user_words), 1::bigint, 'A sees their own word');
select is((select count(*) from public.review_events), 1::bigint, 'A sees their own reviews');
select is((select count(*) from public.profiles), 1::bigint, 'A sees only their own profile');
select ok((select count(*) from public.words) > 0, 'A can read the shared vocabulary');
select is((select count(*) from public.diagnostics), 0::bigint, 'A has no diagnostics yet');

-- ------------------------------- learner B --------------------------------

reset role;
set local role authenticated;
set local "request.jwt.claim.sub" = '22222222-2222-4222-8222-222222222222';
set local "request.jwt.claim.role" = 'authenticated';

select is((select count(*) from public.user_words), 0::bigint, 'B cannot see A''s words');
select is((select count(*) from public.review_events), 0::bigint, 'B cannot see A''s reviews');
select is((select count(*) from public.daily_stats), 0::bigint, 'B cannot see A''s daily stats');
select is((select count(*) from public.user_achievements), 0::bigint, 'B cannot see A''s achievements');
select is((select count(*) from public.profiles), 1::bigint, 'B sees only their own profile');

select throws_ok(
  $$insert into public.user_words (user_id, word_id)
    values ('11111111-1111-4111-8111-111111111111', '99999999-9999-4999-8999-999999999999')$$,
  '42501',
  null,
  'B cannot create learning state for another user'
);

select throws_ok(
  $$insert into public.review_events
      (user_id, word_id, exercise_type, was_correct, latency_ms, recall_band,
       mastery_before, mastery_after, client_event_id, local_day)
    values ('11111111-1111-4111-8111-111111111111', '99999999-9999-4999-8999-999999999999',
            'cloze', true, 100, 'instant', 0, 10,
            '55555555-5555-4555-8555-555555555555', current_date)$$,
  '42501',
  null,
  'B cannot write reviews as another user'
);

select throws_ok(
  $$insert into public.words (lemma, part_of_speech, cefr, russian, primary_answer, created_by)
    values ('sneaky', 'verb', 'B1', 'подкрадываться', 'sneaky', null)$$,
  null,
  'only administrators can manage curated vocabulary',
  'B cannot add a word to the shared vocabulary'
);

-- Self-promotion silently keeps the old value rather than failing loudly.
update public.profiles set is_admin = true where id = '22222222-2222-4222-8222-222222222222';
select is(
  (select is_admin from public.profiles where id = '22222222-2222-4222-8222-222222222222'),
  false,
  'B cannot make themselves an administrator'
);

select lives_ok(
  $$insert into public.words (lemma, part_of_speech, cefr, russian, primary_answer, created_by)
    values ('bmine', 'noun', 'B1', 'шахта', 'bmine', '22222222-2222-4222-8222-222222222222')$$,
  'B can add a word of their own'
);

-- ------------------------- custom word visibility -------------------------

reset role;
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-1111-4111-8111-111111111111';
set local "request.jwt.claim.role" = 'authenticated';

select is(
  (select count(*) from public.words where lemma = 'bmine'),
  0::bigint,
  'A cannot see B''s custom word'
);

-- --------------------------------- admin ----------------------------------

reset role;
set local role authenticated;
set local "request.jwt.claim.sub" = '33333333-3333-4333-8333-333333333333';
set local "request.jwt.claim.role" = 'authenticated';

select ok(public.current_user_is_admin(), 'the admin flag is visible to the admin');

select lives_ok(
  $$insert into public.words (lemma, part_of_speech, cefr, russian, primary_answer, created_by)
    values ('curatedbyadmin', 'verb', 'B2', 'тест', 'curatedbyadmin', null)$$,
  'an administrator can add curated vocabulary'
);

-- ------------------------------- anonymous --------------------------------

reset role;
set local role anon;
set local "request.jwt.claim.role" = 'anon';

select throws_ok(
  'select count(*) from public.words',
  '42501',
  null,
  'anonymous visitors cannot read the vocabulary'
);

select throws_ok(
  'select count(*) from public.profiles',
  '42501',
  null,
  'anonymous visitors cannot read profiles'
);

select throws_ok(
  'select count(*) from public.review_events',
  '42501',
  null,
  'anonymous visitors cannot read review history'
);

select * from finish();
rollback;
