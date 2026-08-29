-- ---------------------------------------------------------------------------
-- Curated starter vocabulary.
--
-- Generated from data/vocabulary.txt by `pnpm db:generate-seed`. Do not edit
-- this file by hand: edit the source list and regenerate.
-- ---------------------------------------------------------------------------

-- 209 entries

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'cf49045c-7a65-5baf-b64b-734cbe03963f', 'avoid', 'verb', 'B1',
  'избегать', 'to deliberately stay away from something or stop it happening', 'You deliberately keep away from something unpleasant.',
  'avoid', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'cf49045c-7a65-5baf-b64b-0003e803963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'I try to avoid unnecessary meetings.', 'I try to ___ unnecessary meetings.', 0
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'cf49045c-7a65-5baf-b64b-0003e903963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'She avoided eye contact all evening.', 'She ___ eye contact all evening.', 1
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'cf49045c-7a65-5baf-b64b-0007d003963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'avoid conflict', '___ conflict', 'избегать конфликта', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'cf49045c-7a65-5baf-b64b-0007d103963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'avoid responsibility', '___ responsibility', 'избегать ответственности', 1
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'cf49045c-7a65-5baf-b64b-000bb803963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'avoidable', 'adjective', 'которого можно избежать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'cf49045c-7a65-5baf-b64b-000bb903963f', 'cf49045c-7a65-5baf-b64b-734cbe03963f', 'unavoidable', 'adjective', 'неизбежный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c59e5969-e75a-50fa-aca4-66b190fffdf5', 'hesitate', 'verb', 'B1',
  'колебаться', 'to pause before doing something because you are not certain', 'You stop for a moment because you are not sure.',
  'hesitate', '{}', '{"communication","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c59e5969-e75a-50fa-aca4-0003e8fffdf5', 'c59e5969-e75a-50fa-aca4-66b190fffdf5', 'Do not hesitate to ask if anything is unclear.', 'Do not ___ to ask if anything is unclear.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c59e5969-e75a-50fa-aca4-0007d0fffdf5', 'c59e5969-e75a-50fa-aca4-66b190fffdf5', 'hesitate to ask', '___ to ask', 'стесняться спросить', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'c59e5969-e75a-50fa-aca4-000bb8fffdf5', 'c59e5969-e75a-50fa-aca4-66b190fffdf5', 'hesitation', 'noun', 'колебание', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'c59e5969-e75a-50fa-aca4-000bb9fffdf5', 'c59e5969-e75a-50fa-aca4-66b190fffdf5', 'hesitant', 'adjective', 'нерешительный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a01a3dd6-9a12-52cb-98a5-764a40145012', 'postpone', 'verb', 'B1',
  'откладывать', 'to move an event to a later time', 'You promised to meet someone but now you need a later date.',
  'postpone', '{"put off","delay"}', '{"work","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a01a3dd6-9a12-52cb-98a5-0003e8145012', 'a01a3dd6-9a12-52cb-98a5-764a40145012', 'Could we postpone the meeting until Friday?', 'Could we ___ the meeting until Friday?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a01a3dd6-9a12-52cb-98a5-0007d0145012', 'a01a3dd6-9a12-52cb-98a5-764a40145012', 'postpone a decision', '___ a decision', 'отложить решение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a01a3dd6-9a12-52cb-98a5-000bb8145012', 'a01a3dd6-9a12-52cb-98a5-764a40145012', 'postponement', 'noun', 'отсрочка', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd39cd49a-3fc3-52dd-bc39-38ec4fc4afd1', 'maintain', 'verb', 'B2',
  'поддерживать', 'to keep something in the same state or at the same level', 'You keep something going at the same level over time.',
  'maintain', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd39cd49a-3fc3-52dd-bc39-0003e8c4afd1', 'd39cd49a-3fc3-52dd-bc39-38ec4fc4afd1', 'It is hard to maintain that level of concentration.', 'It is hard to ___ that level of concentration.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd39cd49a-3fc3-52dd-bc39-0007d0c4afd1', 'd39cd49a-3fc3-52dd-bc39-38ec4fc4afd1', 'maintain contact', '___ contact', 'поддерживать связь', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd39cd49a-3fc3-52dd-bc39-0007d1c4afd1', 'd39cd49a-3fc3-52dd-bc39-38ec4fc4afd1', 'maintain standards', '___ standards', 'поддерживать стандарты', 1
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd39cd49a-3fc3-52dd-bc39-000bb8c4afd1', 'd39cd49a-3fc3-52dd-bc39-38ec4fc4afd1', 'maintenance', 'noun', 'обслуживание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '195f7bdd-fd17-584f-bb5e-e16d8a7914f2', 'despite', 'phrase', 'B2',
  'несмотря на', 'used to say something happens even though something else might have stopped it', 'Something happened even though there was a reason it should not have.',
  'despite', '{}', '{"abstract","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '195f7bdd-fd17-584f-bb5e-0003e87914f2', '195f7bdd-fd17-584f-bb5e-e16d8a7914f2', 'Despite the rain we walked home.', '___ the rain we walked home.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '195f7bdd-fd17-584f-bb5e-0007d07914f2', '195f7bdd-fd17-584f-bb5e-e16d8a7914f2', 'despite the fact', '___ the fact', 'несмотря на то что', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '195f7bdd-fd17-584f-bb5e-000bb87914f2', '195f7bdd-fd17-584f-bb5e-e16d8a7914f2', 'in spite of', 'phrase', 'несмотря на', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '649a679a-66fa-5d13-92cf-23e64a77da4e', 'aware', 'adjective', 'B1',
  'осознающий', 'knowing that something exists or is happening', 'You know that something is happening around you.',
  'aware', '{}', '{"opinions","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '649a679a-66fa-5d13-92cf-0003e877da4e', '649a679a-66fa-5d13-92cf-23e64a77da4e', 'I was not aware of the deadline.', 'I was not ___ of the deadline.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '649a679a-66fa-5d13-92cf-0007d077da4e', '649a679a-66fa-5d13-92cf-23e64a77da4e', 'aware of', '___ of', 'в курсе', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '649a679a-66fa-5d13-92cf-0007d177da4e', '649a679a-66fa-5d13-92cf-23e64a77da4e', 'become aware', 'become ___', 'осознать', 1
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '649a679a-66fa-5d13-92cf-000bb877da4e', '649a679a-66fa-5d13-92cf-23e64a77da4e', 'awareness', 'noun', 'осведомлённость', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '649a679a-66fa-5d13-92cf-000bb977da4e', '649a679a-66fa-5d13-92cf-23e64a77da4e', 'unaware', 'adjective', 'не знающий', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '020b92d1-fd97-58d9-be8e-0ea0e1329bd4', 'approach', 'verb', 'B2',
  'подходить к', 'to deal with a problem or situation in a particular way', 'You start dealing with a problem in a particular way.',
  'approach', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '020b92d1-fd97-58d9-be8e-0003e8329bd4', '020b92d1-fd97-58d9-be8e-0ea0e1329bd4', 'We need to approach this differently.', 'We need to ___ this differently.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '020b92d1-fd97-58d9-be8e-0007d0329bd4', '020b92d1-fd97-58d9-be8e-0ea0e1329bd4', 'approach a problem', '___ a problem', 'подходить к проблеме', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '020b92d1-fd97-58d9-be8e-000bb8329bd4', '020b92d1-fd97-58d9-be8e-0ea0e1329bd4', 'approachable', 'adjective', 'доступный для общения', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '74da09eb-3254-5fd2-95f4-6ff63ef2032b', 'struggle', 'verb', 'B1',
  'с трудом справляться', 'to try very hard to do something difficult', 'You are having a hard time doing something.',
  'struggle', '{}', '{"emotions","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '74da09eb-3254-5fd2-95f4-0003e8f2032b', '74da09eb-3254-5fd2-95f4-6ff63ef2032b', 'He is struggling to keep up with the course.', 'He is ___ to keep up with the course.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '74da09eb-3254-5fd2-95f4-0007d0f2032b', '74da09eb-3254-5fd2-95f4-6ff63ef2032b', 'struggle with', '___ with', 'бороться с', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '74da09eb-3254-5fd2-95f4-000bb8f2032b', '74da09eb-3254-5fd2-95f4-6ff63ef2032b', 'struggle', 'noun', 'борьба', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3934549a-5988-5891-b534-34d25c059152', 'assume', 'verb', 'B2',
  'предполагать', 'to think something is true without proof', 'You believe something without checking it first.',
  'assume', '{}', '{"opinions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3934549a-5988-5891-b534-0003e8059152', '3934549a-5988-5891-b534-34d25c059152', 'I assumed you already knew.', 'I ___ you already knew.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3934549a-5988-5891-b534-0007d0059152', '3934549a-5988-5891-b534-34d25c059152', 'assume responsibility', '___ responsibility', 'взять на себя ответственность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3934549a-5988-5891-b534-000bb8059152', '3934549a-5988-5891-b534-34d25c059152', 'assumption', 'noun', 'предположение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9a3e67c0-552d-5628-9dce-f438989aada5', 'achieve', 'verb', 'B1',
  'достигать', 'to succeed in getting a result after effort', 'You finally get the result you worked for.',
  'achieve', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9a3e67c0-552d-5628-9dce-0003e89aada5', '9a3e67c0-552d-5628-9dce-f438989aada5', 'She achieved everything she set out to do.', 'She ___ everything she set out to do.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9a3e67c0-552d-5628-9dce-0007d09aada5', '9a3e67c0-552d-5628-9dce-f438989aada5', 'achieve a goal', '___ a goal', 'достичь цели', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9a3e67c0-552d-5628-9dce-000bb89aada5', '9a3e67c0-552d-5628-9dce-f438989aada5', 'achievement', 'noun', 'достижение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9a3e67c0-552d-5628-9dce-000bb99aada5', '9a3e67c0-552d-5628-9dce-f438989aada5', 'achievable', 'adjective', 'достижимый', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'beff2327-69b7-54d4-821d-6fccd66b9266', 'admit', 'verb', 'B1',
  'признавать', 'to agree that something is true, often unwillingly', 'You finally accept that something is true even though it is uncomfortable.',
  'admit', '{}', '{"communication","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'beff2327-69b7-54d4-821d-0003e86b9266', 'beff2327-69b7-54d4-821d-6fccd66b9266', 'He admitted that he had forgotten.', 'He ___ that he had forgotten.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'beff2327-69b7-54d4-821d-0007d06b9266', 'beff2327-69b7-54d4-821d-6fccd66b9266', 'admit a mistake', '___ a mistake', 'признать ошибку', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'beff2327-69b7-54d4-821d-000bb86b9266', 'beff2327-69b7-54d4-821d-6fccd66b9266', 'admission', 'noun', 'признание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ae5995c4-65d7-5ebd-af66-985618142a79', 'afford', 'verb', 'B1',
  'позволить себе', 'to have enough money or time for something', 'You have enough money or time for something.',
  'afford', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ae5995c4-65d7-5ebd-af66-0003e8142a79', 'ae5995c4-65d7-5ebd-af66-985618142a79', 'We cannot afford another delay.', 'We cannot ___ another delay.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ae5995c4-65d7-5ebd-af66-0007d0142a79', 'ae5995c4-65d7-5ebd-af66-985618142a79', 'afford to', '___ to', 'позволить себе', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ae5995c4-65d7-5ebd-af66-000bb8142a79', 'ae5995c4-65d7-5ebd-af66-985618142a79', 'affordable', 'adjective', 'доступный по цене', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd477fad0-d00f-5a3e-a1f4-8dfba4d0efc3', 'apply', 'verb', 'B1',
  'подавать заявление', 'to make a formal request for a job or place', 'You send a formal request for a job or a place.',
  'apply', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd477fad0-d00f-5a3e-a1f4-0003e8d0efc3', 'd477fad0-d00f-5a3e-a1f4-8dfba4d0efc3', 'She applied for three jobs this week.', 'She ___ for three jobs this week.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd477fad0-d00f-5a3e-a1f4-0007d0d0efc3', 'd477fad0-d00f-5a3e-a1f4-8dfba4d0efc3', 'apply for a job', '___ for a job', 'подать заявление на работу', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd477fad0-d00f-5a3e-a1f4-000bb8d0efc3', 'd477fad0-d00f-5a3e-a1f4-8dfba4d0efc3', 'application', 'noun', 'заявление', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd477fad0-d00f-5a3e-a1f4-000bb9d0efc3', 'd477fad0-d00f-5a3e-a1f4-8dfba4d0efc3', 'applicant', 'noun', 'кандидат', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '57398c53-0ee0-5dc3-8ed3-62d18fefdf89', 'argue', 'verb', 'B1',
  'спорить', 'to disagree with someone in words', 'You disagree with someone out loud.',
  'argue', '{}', '{"communication","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '57398c53-0ee0-5dc3-8ed3-0003e8efdf89', '57398c53-0ee0-5dc3-8ed3-62d18fefdf89', 'They argue about money constantly.', 'They ___ about money constantly.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '57398c53-0ee0-5dc3-8ed3-0007d0efdf89', '57398c53-0ee0-5dc3-8ed3-62d18fefdf89', 'argue with', '___ with', 'спорить с', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '57398c53-0ee0-5dc3-8ed3-000bb8efdf89', '57398c53-0ee0-5dc3-8ed3-62d18fefdf89', 'argument', 'noun', 'спор', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '31a7d1a0-09bd-5646-a20e-0604f0201e61', 'attend', 'verb', 'B1',
  'посещать', 'to go to an event or a class', 'You go to an event or a class.',
  'attend', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '31a7d1a0-09bd-5646-a20e-0003e8201e61', '31a7d1a0-09bd-5646-a20e-0604f0201e61', 'Only twelve people attended the lecture.', 'Only twelve people ___ the lecture.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '31a7d1a0-09bd-5646-a20e-0007d0201e61', '31a7d1a0-09bd-5646-a20e-0604f0201e61', 'attend a meeting', '___ a meeting', 'присутствовать на встрече', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '31a7d1a0-09bd-5646-a20e-000bb8201e61', '31a7d1a0-09bd-5646-a20e-0604f0201e61', 'attendance', 'noun', 'посещаемость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '43d269cd-814b-5c24-a762-277e49cfd525', 'blame', 'verb', 'B1',
  'винить', 'to say that someone is responsible for something bad', 'You say someone is responsible for something bad.',
  'blame', '{}', '{"relationships","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '43d269cd-814b-5c24-a762-0003e8cfd525', '43d269cd-814b-5c24-a762-277e49cfd525', 'Do not blame yourself for this.', 'Do not ___ yourself for this.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '43d269cd-814b-5c24-a762-0007d0cfd525', '43d269cd-814b-5c24-a762-277e49cfd525', 'blame someone for', '___ someone for', 'винить кого-то за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '43d269cd-814b-5c24-a762-000bb8cfd525', '43d269cd-814b-5c24-a762-277e49cfd525', 'blameless', 'adjective', 'невиновный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1dd75f30-6964-5175-b6e7-25fd61a56792', 'borrow', 'verb', 'A2',
  'занимать', 'to take something and give it back later', 'You take something and plan to return it.',
  'borrow', '{}', '{"everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1dd75f30-6964-5175-b6e7-0003e8a56792', '1dd75f30-6964-5175-b6e7-25fd61a56792', 'Can I borrow your charger for a minute?', 'Can I ___ your charger for a minute?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1dd75f30-6964-5175-b6e7-0007d0a56792', '1dd75f30-6964-5175-b6e7-25fd61a56792', 'borrow money', '___ money', 'занять денег', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bff7738e-ac6a-5c32-a200-78aba3c80312', 'complain', 'verb', 'B1',
  'жаловаться', 'to say that you are not satisfied with something', 'You tell someone you are not happy with something.',
  'complain', '{}', '{"communication","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bff7738e-ac6a-5c32-a200-0003e8c80312', 'bff7738e-ac6a-5c32-a200-78aba3c80312', 'Guests complained about the noise.', 'Guests ___ about the noise.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bff7738e-ac6a-5c32-a200-0007d0c80312', 'bff7738e-ac6a-5c32-a200-78aba3c80312', 'complain about', '___ about', 'жаловаться на', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'bff7738e-ac6a-5c32-a200-000bb8c80312', 'bff7738e-ac6a-5c32-a200-78aba3c80312', 'complaint', 'noun', 'жалоба', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a87644e9-cfb0-513e-8f0d-13c78e432d6f', 'consider', 'verb', 'B1',
  'рассматривать', 'to think about something carefully before deciding', 'You think carefully before you decide.',
  'consider', '{}', '{"work","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a87644e9-cfb0-513e-8f0d-0003e8432d6f', 'a87644e9-cfb0-513e-8f0d-13c78e432d6f', 'Have you considered working from home?', 'Have you ___ working from home?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a87644e9-cfb0-513e-8f0d-0007d0432d6f', 'a87644e9-cfb0-513e-8f0d-13c78e432d6f', 'consider an option', '___ an option', 'рассмотреть вариант', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a87644e9-cfb0-513e-8f0d-000bb8432d6f', 'a87644e9-cfb0-513e-8f0d-13c78e432d6f', 'consideration', 'noun', 'рассмотрение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a87644e9-cfb0-513e-8f0d-000bb9432d6f', 'a87644e9-cfb0-513e-8f0d-13c78e432d6f', 'considerable', 'adjective', 'значительный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '62c1ba85-af0c-5191-96f9-ff37f2b6c4e5', 'convince', 'verb', 'B2',
  'убеждать', 'to make someone believe something or agree to do it', 'You make someone believe you and agree.',
  'convince', '{"persuade"}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '62c1ba85-af0c-5191-96f9-0003e8b6c4e5', '62c1ba85-af0c-5191-96f9-ff37f2b6c4e5', 'She convinced me to stay another day.', 'She ___ me to stay another day.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '62c1ba85-af0c-5191-96f9-0007d0b6c4e5', '62c1ba85-af0c-5191-96f9-ff37f2b6c4e5', 'convince someone to', '___ someone to', 'убедить кого-то', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '62c1ba85-af0c-5191-96f9-000bb8b6c4e5', '62c1ba85-af0c-5191-96f9-ff37f2b6c4e5', 'convincing', 'adjective', 'убедительный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b9596dae-35e9-55a6-a719-c0f86c68f9ca', 'cope', 'verb', 'B2',
  'справляться', 'to deal successfully with a difficult situation', 'You manage a difficult situation without falling apart.',
  'cope', '{"manage"}', '{"emotions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b9596dae-35e9-55a6-a719-0003e868f9ca', 'b9596dae-35e9-55a6-a719-c0f86c68f9ca', 'He is coping surprisingly well.', 'He is ___ surprisingly well.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b9596dae-35e9-55a6-a719-0007d068f9ca', 'b9596dae-35e9-55a6-a719-c0f86c68f9ca', 'cope with', '___ with', 'справляться с', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ba79f34b-0b8b-5326-b1fc-ecf476bdf9bd', 'delay', 'verb', 'B1',
  'задерживать', 'to make something happen later than planned', 'Something happens later than planned.',
  'delay', '{}', '{"travel","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ba79f34b-0b8b-5326-b1fc-0003e8bdf9bd', 'ba79f34b-0b8b-5326-b1fc-ecf476bdf9bd', 'The flight was delayed by two hours.', 'The flight was ___ by two hours.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ba79f34b-0b8b-5326-b1fc-0007d0bdf9bd', 'ba79f34b-0b8b-5326-b1fc-ecf476bdf9bd', 'delay a decision', '___ a decision', 'отложить решение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ba79f34b-0b8b-5326-b1fc-000bb8bdf9bd', 'ba79f34b-0b8b-5326-b1fc-ecf476bdf9bd', 'delay', 'noun', 'задержка', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a9cf328a-ac97-57c5-9852-85dd2773417d', 'deny', 'verb', 'B2',
  'отрицать', 'to say that something is not true', 'You say something is not true.',
  'deny', '{}', '{"communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a9cf328a-ac97-57c5-9852-0003e873417d', 'a9cf328a-ac97-57c5-9852-85dd2773417d', 'He denied ever seeing the message.', 'He ___ ever seeing the message.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a9cf328a-ac97-57c5-9852-0007d073417d', 'a9cf328a-ac97-57c5-9852-85dd2773417d', 'deny a claim', '___ a claim', 'отрицать утверждение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a9cf328a-ac97-57c5-9852-000bb873417d', 'a9cf328a-ac97-57c5-9852-85dd2773417d', 'denial', 'noun', 'отрицание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '66e91952-59b7-511e-8e83-5c2668e6f24d', 'encourage', 'verb', 'B1',
  'поощрять', 'to give someone confidence or support to do something', 'You give someone the confidence to try.',
  'encourage', '{}', '{"relationships","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '66e91952-59b7-511e-8e83-0003e8e6f24d', '66e91952-59b7-511e-8e83-5c2668e6f24d', 'My teacher encouraged me to apply.', 'My teacher ___ me to apply.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '66e91952-59b7-511e-8e83-0007d0e6f24d', '66e91952-59b7-511e-8e83-5c2668e6f24d', 'encourage someone to', '___ someone to', 'поощрять кого-то', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '66e91952-59b7-511e-8e83-000bb8e6f24d', '66e91952-59b7-511e-8e83-5c2668e6f24d', 'encouragement', 'noun', 'поддержка', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '66e91952-59b7-511e-8e83-000bb9e6f24d', '66e91952-59b7-511e-8e83-5c2668e6f24d', 'encouraging', 'adjective', 'обнадёживающий', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b09988ec-c073-56a8-a7b7-dd864b4dc15e', 'ensure', 'verb', 'B2',
  'обеспечивать', 'to make certain that something happens', 'You make certain something happens.',
  'ensure', '{"make sure"}', '{"work","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b09988ec-c073-56a8-a7b7-0003e84dc15e', 'b09988ec-c073-56a8-a7b7-dd864b4dc15e', 'Please ensure the door is locked.', 'Please ___ the door is locked.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b09988ec-c073-56a8-a7b7-0007d04dc15e', 'b09988ec-c073-56a8-a7b7-dd864b4dc15e', 'ensure that', '___ that', 'убедиться что', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a2f7a1cc-7687-5c5b-82e9-ea2864c3dcde', 'expect', 'verb', 'B1',
  'ожидать', 'to think that something will happen', 'You think something will happen.',
  'expect', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a2f7a1cc-7687-5c5b-82e9-0003e8c3dcde', 'a2f7a1cc-7687-5c5b-82e9-ea2864c3dcde', 'I did not expect it to take so long.', 'I did not ___ it to take so long.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a2f7a1cc-7687-5c5b-82e9-0007d0c3dcde', 'a2f7a1cc-7687-5c5b-82e9-ea2864c3dcde', 'expect a reply', '___ a reply', 'ожидать ответа', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a2f7a1cc-7687-5c5b-82e9-000bb8c3dcde', 'a2f7a1cc-7687-5c5b-82e9-ea2864c3dcde', 'expectation', 'noun', 'ожидание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9aaacb2f-51fc-58ed-88b8-411f8dff33a3', 'handle', 'verb', 'B2',
  'справляться с', 'to deal with a situation or a person', 'You deal with a difficult situation or person.',
  'handle', '{"deal with"}', '{"work","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9aaacb2f-51fc-58ed-88b8-0003e8ff33a3', '9aaacb2f-51fc-58ed-88b8-411f8dff33a3', 'She handled the complaint calmly.', 'She ___ the complaint calmly.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9aaacb2f-51fc-58ed-88b8-0007d0ff33a3', '9aaacb2f-51fc-58ed-88b8-411f8dff33a3', 'handle pressure', '___ pressure', 'справляться с давлением', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9aaacb2f-51fc-58ed-88b8-000bb8ff33a3', '9aaacb2f-51fc-58ed-88b8-411f8dff33a3', 'handling', 'noun', 'обращение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '26a53349-5d8e-539f-9a83-27044218f48b', 'ignore', 'verb', 'B1',
  'игнорировать', 'to deliberately pay no attention to something', 'You choose not to pay any attention.',
  'ignore', '{}', '{"relationships","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '26a53349-5d8e-539f-9a83-0003e818f48b', '26a53349-5d8e-539f-9a83-27044218f48b', 'He ignored my last two messages.', 'He ___ my last two messages.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '26a53349-5d8e-539f-9a83-0007d018f48b', '26a53349-5d8e-539f-9a83-27044218f48b', 'ignore advice', '___ advice', 'игнорировать совет', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9acbd6ed-abc9-56b7-aeb2-8a8e4ad6e034', 'improve', 'verb', 'A2',
  'улучшать', 'to make something better or become better', 'Something gets better than it was.',
  'improve', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9acbd6ed-abc9-56b7-aeb2-0003e8d6e034', '9acbd6ed-abc9-56b7-aeb2-8a8e4ad6e034', 'Her writing has improved a lot.', 'Her writing has ___ a lot.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9acbd6ed-abc9-56b7-aeb2-0007d0d6e034', '9acbd6ed-abc9-56b7-aeb2-8a8e4ad6e034', 'improve quality', '___ quality', 'улучшить качество', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9acbd6ed-abc9-56b7-aeb2-000bb8d6e034', '9acbd6ed-abc9-56b7-aeb2-8a8e4ad6e034', 'improvement', 'noun', 'улучшение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '8016d719-b55c-5074-b6b3-c78f2b5207f3', 'involve', 'verb', 'B2',
  'включать в себя', 'to include something as a necessary part', 'Something is a necessary part of it.',
  'involve', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '8016d719-b55c-5074-b6b3-0003e85207f3', '8016d719-b55c-5074-b6b3-c78f2b5207f3', 'The job involves a lot of travel.', 'The job ___ a lot of travel.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '8016d719-b55c-5074-b6b3-0007d05207f3', '8016d719-b55c-5074-b6b3-c78f2b5207f3', 'involve risk', '___ risk', 'быть связанным с риском', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '8016d719-b55c-5074-b6b3-000bb85207f3', '8016d719-b55c-5074-b6b3-c78f2b5207f3', 'involvement', 'noun', 'участие', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3f5b2d3d-0fb5-520a-b1ef-098c5360ff97', 'manage', 'verb', 'B1',
  'суметь', 'to succeed in doing something difficult', 'You succeed at something difficult.',
  'manage', '{}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3f5b2d3d-0fb5-520a-b1ef-0003e860ff97', '3f5b2d3d-0fb5-520a-b1ef-098c5360ff97', 'We managed to finish before midnight.', 'We ___ to finish before midnight.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3f5b2d3d-0fb5-520a-b1ef-0007d060ff97', '3f5b2d3d-0fb5-520a-b1ef-098c5360ff97', 'manage to', '___ to', 'суметь', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3f5b2d3d-0fb5-520a-b1ef-000bb860ff97', '3f5b2d3d-0fb5-520a-b1ef-098c5360ff97', 'manageable', 'adjective', 'выполнимый', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3f5b2d3d-0fb5-520a-b1ef-000bb960ff97', '3f5b2d3d-0fb5-520a-b1ef-098c5360ff97', 'management', 'noun', 'управление', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '505875ca-a8a8-5cfe-a4a2-b0ef851c4a43', 'mention', 'verb', 'B1',
  'упоминать', 'to say something briefly, without details', 'You say something briefly in passing.',
  'mention', '{}', '{"communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '505875ca-a8a8-5cfe-a4a2-0003e81c4a43', '505875ca-a8a8-5cfe-a4a2-b0ef851c4a43', 'She mentioned it once and never again.', 'She ___ it once and never again.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '505875ca-a8a8-5cfe-a4a2-0007d01c4a43', '505875ca-a8a8-5cfe-a4a2-b0ef851c4a43', 'mention briefly', '___ briefly', 'кратко упомянуть', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b35fd983-72d3-5b4b-b448-5bc82ffb33e6', 'notice', 'verb', 'A2',
  'замечать', 'to see or become conscious of something', 'You become conscious of something.',
  'notice', '{}', '{"everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b35fd983-72d3-5b4b-b448-0003e8fb33e6', 'b35fd983-72d3-5b4b-b448-5bc82ffb33e6', 'I did not notice the sign.', 'I did not ___ the sign.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b35fd983-72d3-5b4b-b448-0007d0fb33e6', 'b35fd983-72d3-5b4b-b448-5bc82ffb33e6', 'notice a difference', '___ a difference', 'заметить разницу', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'b35fd983-72d3-5b4b-b448-000bb8fb33e6', 'b35fd983-72d3-5b4b-b448-5bc82ffb33e6', 'noticeable', 'adjective', 'заметный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9807485c-79f6-566b-b16f-46b7d1c52d41', 'offer', 'verb', 'A2',
  'предлагать', 'to say you are willing to give or do something', 'You say you are willing to give or do something.',
  'offer', '{}', '{"work","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9807485c-79f6-566b-b16f-0003e8c52d41', '9807485c-79f6-566b-b16f-46b7d1c52d41', 'They offered me the job on Monday.', 'They ___ me the job on Monday.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9807485c-79f6-566b-b16f-0007d0c52d41', '9807485c-79f6-566b-b16f-46b7d1c52d41', 'offer help', '___ help', 'предложить помощь', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9807485c-79f6-566b-b16f-000bb8c52d41', '9807485c-79f6-566b-b16f-46b7d1c52d41', 'offer', 'noun', 'предложение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4f30dee3-720d-5108-88ef-eb27aaaaab95', 'prevent', 'verb', 'B1',
  'предотвращать', 'to stop something from happening', 'You stop something before it happens.',
  'prevent', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4f30dee3-720d-5108-88ef-0003e8aaab95', '4f30dee3-720d-5108-88ef-eb27aaaaab95', 'Nothing can prevent this now.', 'Nothing can ___ this now.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4f30dee3-720d-5108-88ef-0007d0aaab95', '4f30dee3-720d-5108-88ef-eb27aaaaab95', 'prevent damage', '___ damage', 'предотвратить ущерб', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '4f30dee3-720d-5108-88ef-000bb8aaab95', '4f30dee3-720d-5108-88ef-eb27aaaaab95', 'prevention', 'noun', 'профилактика', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e5c48751-61d0-59e4-918d-d5abdb1faa55', 'provide', 'verb', 'B1',
  'предоставлять', 'to give someone something they need', 'You give someone what they need.',
  'provide', '{}', '{"work","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e5c48751-61d0-59e4-918d-0003e81faa55', 'e5c48751-61d0-59e4-918d-d5abdb1faa55', 'The hotel provides towels.', 'The hotel ___ towels.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e5c48751-61d0-59e4-918d-0007d01faa55', 'e5c48751-61d0-59e4-918d-d5abdb1faa55', 'provide support', '___ support', 'оказывать поддержку', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e5c48751-61d0-59e4-918d-000bb81faa55', 'e5c48751-61d0-59e4-918d-d5abdb1faa55', 'provider', 'noun', 'поставщик', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ebcde4a7-d61f-5f87-8c08-6bf79b529925', 'realise', 'verb', 'B1',
  'осознавать', 'to suddenly understand something', 'You suddenly understand something you did not before.',
  'realise', '{"realize"}', '{"emotions","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ebcde4a7-d61f-5f87-8c08-0003e8529925', 'ebcde4a7-d61f-5f87-8c08-6bf79b529925', 'I did not realise how late it was.', 'I did not ___ how late it was.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ebcde4a7-d61f-5f87-8c08-0007d0529925', 'ebcde4a7-d61f-5f87-8c08-6bf79b529925', 'realise a mistake', '___ a mistake', 'осознать ошибку', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3a16cb73-f4a4-5129-b418-69f71d716bb3', 'recognise', 'verb', 'B1',
  'узнавать', 'to know someone or something because you have seen it before', 'You know something because you have seen it before.',
  'recognise', '{"recognize"}', '{"everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3a16cb73-f4a4-5129-b418-0003e8716bb3', '3a16cb73-f4a4-5129-b418-69f71d716bb3', 'I barely recognised him.', 'I barely ___ him.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3a16cb73-f4a4-5129-b418-0007d0716bb3', '3a16cb73-f4a4-5129-b418-69f71d716bb3', 'recognise a face', '___ a face', 'узнать лицо', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3a16cb73-f4a4-5129-b418-000bb8716bb3', '3a16cb73-f4a4-5129-b418-69f71d716bb3', 'recognition', 'noun', 'узнавание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a5b3637f-9ea0-5f31-a624-2b51978df80d', 'refuse', 'verb', 'B1',
  'отказываться', 'to say firmly that you will not do something', 'You say firmly that you will not do it.',
  'refuse', '{}', '{"communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a5b3637f-9ea0-5f31-a624-0003e88df80d', 'a5b3637f-9ea0-5f31-a624-2b51978df80d', 'She refused to sign anything.', 'She ___ to sign anything.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a5b3637f-9ea0-5f31-a624-0007d08df80d', 'a5b3637f-9ea0-5f31-a624-2b51978df80d', 'refuse an offer', '___ an offer', 'отклонить предложение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a5b3637f-9ea0-5f31-a624-000bb88df80d', 'a5b3637f-9ea0-5f31-a624-2b51978df80d', 'refusal', 'noun', 'отказ', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '14e764f1-440f-5fb5-a831-593ec536b272', 'remind', 'verb', 'B1',
  'напоминать', 'to make someone remember something', 'You make someone remember something.',
  'remind', '{}', '{"everyday","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '14e764f1-440f-5fb5-a831-0003e836b272', '14e764f1-440f-5fb5-a831-593ec536b272', 'Remind me to call the bank.', '___ me to call the bank.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '14e764f1-440f-5fb5-a831-0007d036b272', '14e764f1-440f-5fb5-a831-593ec536b272', 'remind someone of', '___ someone of', 'напоминать кому-то о', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '14e764f1-440f-5fb5-a831-000bb836b272', '14e764f1-440f-5fb5-a831-593ec536b272', 'reminder', 'noun', 'напоминание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '45ec2b8d-9a21-5079-91f7-65b4c8482e71', 'replace', 'verb', 'B1',
  'заменять', 'to put something new in the place of something else', 'You put something new where the old thing was.',
  'replace', '{}', '{"everyday","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '45ec2b8d-9a21-5079-91f7-0003e8482e71', '45ec2b8d-9a21-5079-91f7-65b4c8482e71', 'We replaced the whole system last year.', 'We ___ the whole system last year.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '45ec2b8d-9a21-5079-91f7-0007d0482e71', '45ec2b8d-9a21-5079-91f7-65b4c8482e71', 'replace a part', '___ a part', 'заменить деталь', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '45ec2b8d-9a21-5079-91f7-000bb8482e71', '45ec2b8d-9a21-5079-91f7-65b4c8482e71', 'replacement', 'noun', 'замена', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3ae36cac-b27b-580a-b6d9-cae386d2a879', 'require', 'verb', 'B2',
  'требовать', 'to need something, or to make it necessary', 'Something is necessary for it to work.',
  'require', '{}', '{"work","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3ae36cac-b27b-580a-b6d9-0003e8d2a879', '3ae36cac-b27b-580a-b6d9-cae386d2a879', 'The role requires fluent English.', 'The role ___ fluent English.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3ae36cac-b27b-580a-b6d9-0007d0d2a879', '3ae36cac-b27b-580a-b6d9-cae386d2a879', 'require attention', '___ attention', 'требовать внимания', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3ae36cac-b27b-580a-b6d9-000bb8d2a879', '3ae36cac-b27b-580a-b6d9-cae386d2a879', 'requirement', 'noun', 'требование', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7655775e-ec43-5f32-bcbb-51be0b90bf4f', 'suggest', 'verb', 'B1',
  'предлагать', 'to put forward an idea for someone to consider', 'You put an idea forward for others to think about.',
  'suggest', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7655775e-ec43-5f32-bcbb-0003e890bf4f', '7655775e-ec43-5f32-bcbb-51be0b90bf4f', 'He suggested meeting halfway.', 'He ___ meeting halfway.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7655775e-ec43-5f32-bcbb-0007d090bf4f', '7655775e-ec43-5f32-bcbb-51be0b90bf4f', 'suggest an idea', '___ an idea', 'предложить идею', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '7655775e-ec43-5f32-bcbb-000bb890bf4f', '7655775e-ec43-5f32-bcbb-51be0b90bf4f', 'suggestion', 'noun', 'предложение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9b432c7f-7edb-5911-a100-73ee48939009', 'support', 'verb', 'B1',
  'поддерживать', 'to help someone by agreeing with them or giving them what they need', 'You help someone by standing behind them.',
  'support', '{}', '{"relationships","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9b432c7f-7edb-5911-a100-0003e8939009', '9b432c7f-7edb-5911-a100-73ee48939009', 'My family supported me the whole time.', 'My family ___ me the whole time.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9b432c7f-7edb-5911-a100-0007d0939009', '9b432c7f-7edb-5911-a100-73ee48939009', 'support a decision', '___ a decision', 'поддержать решение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9b432c7f-7edb-5911-a100-000bb8939009', '9b432c7f-7edb-5911-a100-73ee48939009', 'supportive', 'adjective', 'поддерживающий', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '492e73e6-87f3-513e-9093-587a13a3775f', 'survive', 'verb', 'B1',
  'выживать', 'to continue to live or exist after something difficult', 'You keep going after something very hard.',
  'survive', '{}', '{"abstract","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '492e73e6-87f3-513e-9093-0003e8a3775f', '492e73e6-87f3-513e-9093-587a13a3775f', 'Somehow the plant survived the winter.', 'Somehow the plant ___ the winter.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '492e73e6-87f3-513e-9093-0007d0a3775f', '492e73e6-87f3-513e-9093-587a13a3775f', 'survive a crisis', '___ a crisis', 'пережить кризис', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '492e73e6-87f3-513e-9093-000bb8a3775f', '492e73e6-87f3-513e-9093-587a13a3775f', 'survival', 'noun', 'выживание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '82268d9e-b7ce-52df-a546-c57bf2693ed2', 'tend', 'verb', 'B2',
  'иметь склонность', 'to usually do a particular thing', 'You usually do a particular thing.',
  'tend', '{}', '{"abstract","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '82268d9e-b7ce-52df-a546-0003e8693ed2', '82268d9e-b7ce-52df-a546-c57bf2693ed2', 'I tend to work better in the morning.', 'I ___ to work better in the morning.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '82268d9e-b7ce-52df-a546-0007d0693ed2', '82268d9e-b7ce-52df-a546-c57bf2693ed2', 'tend to', '___ to', 'иметь склонность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '82268d9e-b7ce-52df-a546-000bb8693ed2', '82268d9e-b7ce-52df-a546-c57bf2693ed2', 'tendency', 'noun', 'тенденция', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '81f4fa9a-9515-5ca5-8fb3-a693d03e00cd', 'threaten', 'verb', 'B2',
  'угрожать', 'to say you will cause harm if you do not get what you want', 'You say you will cause harm unless you get what you want.',
  'threaten', '{}', '{"relationships","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '81f4fa9a-9515-5ca5-8fb3-0003e83e00cd', '81f4fa9a-9515-5ca5-8fb3-a693d03e00cd', 'He threatened to resign.', 'He ___ to resign.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '81f4fa9a-9515-5ca5-8fb3-0007d03e00cd', '81f4fa9a-9515-5ca5-8fb3-a693d03e00cd', 'threaten to', '___ to', 'угрожать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '81f4fa9a-9515-5ca5-8fb3-000bb83e00cd', '81f4fa9a-9515-5ca5-8fb3-a693d03e00cd', 'threat', 'noun', 'угроза', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1d279874-60e4-50e5-ba55-8f52d681157d', 'warn', 'verb', 'B1',
  'предупреждать', 'to tell someone about a possible danger or problem', 'You tell someone about a possible danger.',
  'warn', '{}', '{"communication","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1d279874-60e4-50e5-ba55-0003e881157d', '1d279874-60e4-50e5-ba55-8f52d681157d', 'I warned them about the traffic.', 'I ___ them about the traffic.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1d279874-60e4-50e5-ba55-0007d081157d', '1d279874-60e4-50e5-ba55-8f52d681157d', 'warn against', '___ against', 'предостерегать от', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '1d279874-60e4-50e5-ba55-000bb881157d', '1d279874-60e4-50e5-ba55-8f52d681157d', 'warning', 'noun', 'предупреждение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b3fadb01-3e76-5e97-8ab4-fcddf1add37f', 'accurate', 'adjective', 'B1',
  'точный', 'correct in every detail', 'Every detail is correct.',
  'accurate', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b3fadb01-3e76-5e97-8ab4-0003e8add37f', 'b3fadb01-3e76-5e97-8ab4-fcddf1add37f', 'The figures are not accurate.', 'The figures are not ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b3fadb01-3e76-5e97-8ab4-0007d0add37f', 'b3fadb01-3e76-5e97-8ab4-fcddf1add37f', 'accurate description', '___ description', 'точное описание', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'b3fadb01-3e76-5e97-8ab4-000bb8add37f', 'b3fadb01-3e76-5e97-8ab4-fcddf1add37f', 'accuracy', 'noun', 'точность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'b3fadb01-3e76-5e97-8ab4-000bb9add37f', 'b3fadb01-3e76-5e97-8ab4-fcddf1add37f', 'inaccurate', 'adjective', 'неточный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd9b457c8-7ed6-517a-a2c3-9e1213417f71', 'reluctant', 'adjective', 'B2',
  'неохотный', 'not wanting to do something and showing it', 'You do it but you clearly do not want to.',
  'reluctant', '{}', '{"emotions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd9b457c8-7ed6-517a-a2c3-0003e8417f71', 'd9b457c8-7ed6-517a-a2c3-9e1213417f71', 'She was reluctant to give her name.', 'She was ___ to give her name.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd9b457c8-7ed6-517a-a2c3-0007d0417f71', 'd9b457c8-7ed6-517a-a2c3-9e1213417f71', 'reluctant to', '___ to', 'не желающий', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd9b457c8-7ed6-517a-a2c3-000bb8417f71', 'd9b457c8-7ed6-517a-a2c3-9e1213417f71', 'reluctance', 'noun', 'нежелание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd281ab5c-2761-5534-915a-4690f1cd6633', 'confident', 'adjective', 'B1',
  'уверенный', 'feeling sure about your own ability', 'You feel sure about your own ability.',
  'confident', '{}', '{"emotions","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd281ab5c-2761-5534-915a-0003e8cd6633', 'd281ab5c-2761-5534-915a-4690f1cd6633', 'He sounded confident on the phone.', 'He sounded ___ on the phone.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd281ab5c-2761-5534-915a-0007d0cd6633', 'd281ab5c-2761-5534-915a-4690f1cd6633', 'confident about', '___ about', 'уверенный в', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd281ab5c-2761-5534-915a-000bb8cd6633', 'd281ab5c-2761-5534-915a-4690f1cd6633', 'confidence', 'noun', 'уверенность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6202ef36-6007-5acb-9e3f-fad36336544c', 'disappointed', 'adjective', 'B1',
  'разочарованный', 'unhappy because something was not as good as you hoped', 'Something was worse than you hoped and you feel low.',
  'disappointed', '{}', '{"emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6202ef36-6007-5acb-9e3f-0003e836544c', '6202ef36-6007-5acb-9e3f-fad36336544c', 'I was disappointed by the ending.', 'I was ___ by the ending.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6202ef36-6007-5acb-9e3f-0007d036544c', '6202ef36-6007-5acb-9e3f-fad36336544c', 'deeply disappointed', 'deeply ___', 'глубоко разочарованный', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6202ef36-6007-5acb-9e3f-000bb836544c', '6202ef36-6007-5acb-9e3f-fad36336544c', 'disappointment', 'noun', 'разочарование', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6202ef36-6007-5acb-9e3f-000bb936544c', '6202ef36-6007-5acb-9e3f-fad36336544c', 'disappointing', 'adjective', 'разочаровывающий', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a3a36bd9-2116-5484-bb79-7bd30429cff4', 'embarrassed', 'adjective', 'B1',
  'смущённый', 'feeling uncomfortable because of what others might think', 'You feel uncomfortable about what others saw.',
  'embarrassed', '{}', '{"emotions","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a3a36bd9-2116-5484-bb79-0003e829cff4', 'a3a36bd9-2116-5484-bb79-7bd30429cff4', 'I was too embarrassed to say anything.', 'I was too ___ to say anything.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a3a36bd9-2116-5484-bb79-0007d029cff4', 'a3a36bd9-2116-5484-bb79-7bd30429cff4', 'embarrassed about', '___ about', 'смущённый из-за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a3a36bd9-2116-5484-bb79-000bb829cff4', 'a3a36bd9-2116-5484-bb79-7bd30429cff4', 'embarrassing', 'adjective', 'неловкий', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a3a36bd9-2116-5484-bb79-000bb929cff4', 'a3a36bd9-2116-5484-bb79-7bd30429cff4', 'embarrassment', 'noun', 'смущение', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '5504b1cf-5496-5fb5-9f9a-da90a322e634', 'frustrated', 'adjective', 'B2',
  'раздражённый', 'annoyed because you cannot do what you want', 'You cannot get what you want and it annoys you.',
  'frustrated', '{}', '{"emotions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '5504b1cf-5496-5fb5-9f9a-0003e822e634', '5504b1cf-5496-5fb5-9f9a-da90a322e634', 'Everyone was frustrated with the delays.', 'Everyone was ___ with the delays.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '5504b1cf-5496-5fb5-9f9a-0007d022e634', '5504b1cf-5496-5fb5-9f9a-da90a322e634', 'frustrated with', '___ with', 'раздражённый из-за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '5504b1cf-5496-5fb5-9f9a-000bb822e634', '5504b1cf-5496-5fb5-9f9a-da90a322e634', 'frustration', 'noun', 'разочарование', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '5504b1cf-5496-5fb5-9f9a-000bb922e634', '5504b1cf-5496-5fb5-9f9a-da90a322e634', 'frustrating', 'adjective', 'раздражающий', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4a6e9373-0d5d-598c-9be2-76e8ba9210ce', 'grateful', 'adjective', 'B1',
  'благодарный', 'wanting to thank someone for something', 'You want to thank someone.',
  'grateful', '{"thankful"}', '{"emotions","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4a6e9373-0d5d-598c-9be2-0003e89210ce', '4a6e9373-0d5d-598c-9be2-76e8ba9210ce', 'I am grateful for your patience.', 'I am ___ for your patience.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4a6e9373-0d5d-598c-9be2-0007d09210ce', '4a6e9373-0d5d-598c-9be2-76e8ba9210ce', 'grateful for', '___ for', 'благодарный за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '4a6e9373-0d5d-598c-9be2-000bb89210ce', '4a6e9373-0d5d-598c-9be2-76e8ba9210ce', 'gratitude', 'noun', 'благодарность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'acf84360-2928-51f1-beb2-6d8eb2c7ad1c', 'guilty', 'adjective', 'B1',
  'виноватый', 'feeling bad because you did something wrong', 'You feel bad because you did something wrong.',
  'guilty', '{}', '{"emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'acf84360-2928-51f1-beb2-0003e8c7ad1c', 'acf84360-2928-51f1-beb2-6d8eb2c7ad1c', 'I still feel guilty about it.', 'I still feel ___ about it.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'acf84360-2928-51f1-beb2-0007d0c7ad1c', 'acf84360-2928-51f1-beb2-6d8eb2c7ad1c', 'feel guilty', 'feel ___', 'чувствовать вину', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'acf84360-2928-51f1-beb2-000bb8c7ad1c', 'acf84360-2928-51f1-beb2-6d8eb2c7ad1c', 'guilt', 'noun', 'вина', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bf117e22-496b-56bd-a6b2-cb297aa588e6', 'overwhelmed', 'adjective', 'B2',
  'перегруженный', 'feeling unable to cope because there is too much', 'There is too much and you cannot cope.',
  'overwhelmed', '{}', '{"emotions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bf117e22-496b-56bd-a6b2-0003e8a588e6', 'bf117e22-496b-56bd-a6b2-cb297aa588e6', 'She felt completely overwhelmed.', 'She felt completely ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bf117e22-496b-56bd-a6b2-0007d0a588e6', 'bf117e22-496b-56bd-a6b2-cb297aa588e6', 'overwhelmed by', '___ by', 'перегруженный', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'bf117e22-496b-56bd-a6b2-000bb8a588e6', 'bf117e22-496b-56bd-a6b2-cb297aa588e6', 'overwhelming', 'adjective', 'подавляющий', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ef838908-4617-5bbf-bc44-9797f72befcf', 'relieved', 'adjective', 'B1',
  'испытывающий облегчение', 'happy because a worry has gone', 'A worry has gone and you feel light again.',
  'relieved', '{}', '{"emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ef838908-4617-5bbf-bc44-0003e82befcf', 'ef838908-4617-5bbf-bc44-9797f72befcf', 'I was relieved when they called.', 'I was ___ when they called.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ef838908-4617-5bbf-bc44-0007d02befcf', 'ef838908-4617-5bbf-bc44-9797f72befcf', 'relieved to hear', '___ to hear', 'рад слышать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ef838908-4617-5bbf-bc44-000bb82befcf', 'ef838908-4617-5bbf-bc44-9797f72befcf', 'relief', 'noun', 'облегчение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '475098eb-b27a-5554-8147-d7eeec9bffc4', 'anxious', 'adjective', 'B2',
  'тревожный', 'worried about something that might happen', 'You worry about something that has not happened yet.',
  'anxious', '{}', '{"emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '475098eb-b27a-5554-8147-0003e89bffc4', '475098eb-b27a-5554-8147-d7eeec9bffc4', 'He gets anxious before presentations.', 'He gets ___ before presentations.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '475098eb-b27a-5554-8147-0007d09bffc4', '475098eb-b27a-5554-8147-d7eeec9bffc4', 'anxious about', '___ about', 'тревожащийся о', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '475098eb-b27a-5554-8147-000bb89bffc4', '475098eb-b27a-5554-8147-d7eeec9bffc4', 'anxiety', 'noun', 'тревога', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e54406f5-8d0b-5d9f-8022-92e459bafcd9', 'annoyed', 'adjective', 'B1',
  'раздражённый', 'slightly angry', 'You are slightly angry.',
  'annoyed', '{}', '{"emotions","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e54406f5-8d0b-5d9f-8022-0003e8bafcd9', 'e54406f5-8d0b-5d9f-8022-92e459bafcd9', 'She was annoyed that nobody asked.', 'She was ___ that nobody asked.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e54406f5-8d0b-5d9f-8022-0007d0bafcd9', 'e54406f5-8d0b-5d9f-8022-92e459bafcd9', 'annoyed with', '___ with', 'сердитый на', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e54406f5-8d0b-5d9f-8022-000bb8bafcd9', 'e54406f5-8d0b-5d9f-8022-92e459bafcd9', 'annoying', 'adjective', 'надоедливый', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1db807f1-6a58-5030-97cd-77f6bc4377ae', 'exhausted', 'adjective', 'B2',
  'измотанный', 'extremely tired', 'You are so tired you can barely move.',
  'exhausted', '{}', '{"emotions","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1db807f1-6a58-5030-97cd-0003e84377ae', '1db807f1-6a58-5030-97cd-77f6bc4377ae', 'We were exhausted by the time we arrived.', 'We were ___ by the time we arrived.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1db807f1-6a58-5030-97cd-0007d04377ae', '1db807f1-6a58-5030-97cd-77f6bc4377ae', 'utterly exhausted', 'utterly ___', 'совершенно измотанный', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '1db807f1-6a58-5030-97cd-000bb84377ae', '1db807f1-6a58-5030-97cd-77f6bc4377ae', 'exhaustion', 'noun', 'истощение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '23f5c944-9eba-52b3-997f-ac574f81b1cf', 'proud', 'adjective', 'B1',
  'гордый', 'pleased about something you or someone close has done', 'You feel good about what you or someone close achieved.',
  'proud', '{}', '{"emotions","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '23f5c944-9eba-52b3-997f-0003e881b1cf', '23f5c944-9eba-52b3-997f-ac574f81b1cf', 'I am proud of what we built.', 'I am ___ of what we built.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '23f5c944-9eba-52b3-997f-0007d081b1cf', '23f5c944-9eba-52b3-997f-ac574f81b1cf', 'proud of', '___ of', 'гордый за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '23f5c944-9eba-52b3-997f-000bb881b1cf', '23f5c944-9eba-52b3-997f-ac574f81b1cf', 'pride', 'noun', 'гордость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e79626c5-236f-5a56-8aa6-1a91b5afc3bd', 'curious', 'adjective', 'B1',
  'любопытный', 'wanting to know or learn about something', 'You want to know more about something.',
  'curious', '{}', '{"emotions","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e79626c5-236f-5a56-8aa6-0003e8afc3bd', 'e79626c5-236f-5a56-8aa6-1a91b5afc3bd', 'I was curious about how it worked.', 'I was ___ about how it worked.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e79626c5-236f-5a56-8aa6-0007d0afc3bd', 'e79626c5-236f-5a56-8aa6-1a91b5afc3bd', 'curious about', '___ about', 'любопытствующий о', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e79626c5-236f-5a56-8aa6-000bb8afc3bd', 'e79626c5-236f-5a56-8aa6-1a91b5afc3bd', 'curiosity', 'noun', 'любопытство', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '487ffd3d-6467-5878-a0fd-658a272e08eb', 'willing', 'adjective', 'B2',
  'готовый', 'ready and happy to do something', 'You are ready and happy to do it.',
  'willing', '{}', '{"work","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '487ffd3d-6467-5878-a0fd-0003e82e08eb', '487ffd3d-6467-5878-a0fd-658a272e08eb', 'Are you willing to work weekends?', 'Are you ___ to work weekends?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '487ffd3d-6467-5878-a0fd-0007d02e08eb', '487ffd3d-6467-5878-a0fd-658a272e08eb', 'willing to', '___ to', 'готовый', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '487ffd3d-6467-5878-a0fd-000bb82e08eb', '487ffd3d-6467-5878-a0fd-658a272e08eb', 'willingness', 'noun', 'готовность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '487ffd3d-6467-5878-a0fd-000bb92e08eb', '487ffd3d-6467-5878-a0fd-658a272e08eb', 'unwilling', 'adjective', 'не желающий', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '8652bb27-b886-57dc-99f9-44c1890db7b8', 'reliable', 'adjective', 'B2',
  'надёжный', 'able to be trusted to do what is needed', 'You can trust it to work every time.',
  'reliable', '{"dependable"}', '{"work","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '8652bb27-b886-57dc-99f9-0003e80db7b8', '8652bb27-b886-57dc-99f9-44c1890db7b8', 'We need a reliable supplier.', 'We need a ___ supplier.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '8652bb27-b886-57dc-99f9-0007d00db7b8', '8652bb27-b886-57dc-99f9-44c1890db7b8', 'reliable source', '___ source', 'надёжный источник', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '8652bb27-b886-57dc-99f9-000bb80db7b8', '8652bb27-b886-57dc-99f9-44c1890db7b8', 'reliability', 'noun', 'надёжность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '8652bb27-b886-57dc-99f9-000bb90db7b8', '8652bb27-b886-57dc-99f9-44c1890db7b8', 'rely', 'verb', 'полагаться', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ba44a7a6-c596-5206-895d-1879cb96f59b', 'obvious', 'adjective', 'B1',
  'очевидный', 'easy to see or understand', 'Anyone can see it immediately.',
  'obvious', '{}', '{"opinions","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ba44a7a6-c596-5206-895d-0003e896f59b', 'ba44a7a6-c596-5206-895d-1879cb96f59b', 'The answer was obvious in hindsight.', 'The answer was ___ in hindsight.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ba44a7a6-c596-5206-895d-0007d096f59b', 'ba44a7a6-c596-5206-895d-1879cb96f59b', 'obvious reason', '___ reason', 'очевидная причина', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ba44a7a6-c596-5206-895d-000bb896f59b', 'ba44a7a6-c596-5206-895d-1879cb96f59b', 'obviously', 'adverb', 'очевидно', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '9f45b10f-ea3a-552d-9f40-b2090fad7b77', 'relevant', 'adjective', 'B2',
  'уместный', 'connected to what is being discussed', 'It connects directly to what is being discussed.',
  'relevant', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '9f45b10f-ea3a-552d-9f40-0003e8ad7b77', '9f45b10f-ea3a-552d-9f40-b2090fad7b77', 'That is not relevant here.', 'That is not ___ here.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '9f45b10f-ea3a-552d-9f40-0007d0ad7b77', '9f45b10f-ea3a-552d-9f40-b2090fad7b77', 'relevant experience', '___ experience', 'соответствующий опыт', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9f45b10f-ea3a-552d-9f40-000bb8ad7b77', '9f45b10f-ea3a-552d-9f40-b2090fad7b77', 'relevance', 'noun', 'уместность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '9f45b10f-ea3a-552d-9f40-000bb9ad7b77', '9f45b10f-ea3a-552d-9f40-b2090fad7b77', 'irrelevant', 'adjective', 'не относящийся к делу', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6e631333-2df0-5b60-a986-f1602a31b100', 'significant', 'adjective', 'B2',
  'значительный', 'large or important enough to have an effect', 'Big enough to actually matter.',
  'significant', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6e631333-2df0-5b60-a986-0003e831b100', '6e631333-2df0-5b60-a986-f1602a31b100', 'There was a significant drop in sales.', 'There was a ___ drop in sales.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6e631333-2df0-5b60-a986-0007d031b100', '6e631333-2df0-5b60-a986-f1602a31b100', 'significant difference', '___ difference', 'значительная разница', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6e631333-2df0-5b60-a986-000bb831b100', '6e631333-2df0-5b60-a986-f1602a31b100', 'significance', 'noun', 'значимость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bdf6918a-bafb-57cc-a636-0f35bca4212e', 'essential', 'adjective', 'B2',
  'необходимый', 'completely necessary', 'You cannot do without it.',
  'essential', '{"crucial","vital"}', '{"work","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bdf6918a-bafb-57cc-a636-0003e8a4212e', 'bdf6918a-bafb-57cc-a636-0f35bca4212e', 'Sleep is essential before an exam.', 'Sleep is ___ before an exam.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bdf6918a-bafb-57cc-a636-0007d0a4212e', 'bdf6918a-bafb-57cc-a636-0f35bca4212e', 'essential part', '___ part', 'неотъемлемая часть', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'bdf6918a-bafb-57cc-a636-000bb8a4212e', 'bdf6918a-bafb-57cc-a636-0f35bca4212e', 'essentially', 'adverb', 'по существу', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1b404478-b6ff-5b37-8c34-27608207019f', 'appropriate', 'adjective', 'B2',
  'подходящий', 'suitable for a particular situation', 'It fits the situation properly.',
  'appropriate', '{"suitable"}', '{"work","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1b404478-b6ff-5b37-8c34-0003e807019f', '1b404478-b6ff-5b37-8c34-27608207019f', 'That is not appropriate in a meeting.', 'That is not ___ in a meeting.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1b404478-b6ff-5b37-8c34-0007d007019f', '1b404478-b6ff-5b37-8c34-27608207019f', 'appropriate response', '___ response', 'уместный ответ', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '1b404478-b6ff-5b37-8c34-000bb807019f', '1b404478-b6ff-5b37-8c34-27608207019f', 'inappropriate', 'adjective', 'неуместный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '5ef92f92-ae78-5668-b545-17b0411b8ca0', 'severe', 'adjective', 'B2',
  'суровый', 'very bad or very strict', 'Very bad or very strict.',
  'severe', '{}', '{"abstract","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '5ef92f92-ae78-5668-b545-0003e81b8ca0', '5ef92f92-ae78-5668-b545-17b0411b8ca0', 'The delays were severe all week.', 'The delays were ___ all week.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '5ef92f92-ae78-5668-b545-0007d01b8ca0', '5ef92f92-ae78-5668-b545-17b0411b8ca0', 'severe weather', '___ weather', 'суровая погода', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '5ef92f92-ae78-5668-b545-000bb81b8ca0', '5ef92f92-ae78-5668-b545-17b0411b8ca0', 'severity', 'noun', 'серьёзность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4d566ced-324c-51d4-92c5-78444e0fcad1', 'brief', 'adjective', 'B2',
  'краткий', 'lasting only a short time', 'It lasts only a short time.',
  'brief', '{"short"}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4d566ced-324c-51d4-92c5-0003e80fcad1', '4d566ced-324c-51d4-92c5-78444e0fcad1', 'We had a brief conversation.', 'We had a ___ conversation.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4d566ced-324c-51d4-92c5-0007d00fcad1', '4d566ced-324c-51d4-92c5-78444e0fcad1', 'brief summary', '___ summary', 'краткое изложение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '4d566ced-324c-51d4-92c5-000bb80fcad1', '4d566ced-324c-51d4-92c5-78444e0fcad1', 'briefly', 'adverb', 'кратко', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'abfcfe30-5579-53d8-8a1c-fedae7651fe2', 'tough', 'adjective', 'B2',
  'тяжёлый', 'difficult to deal with', 'It is hard to deal with.',
  'tough', '{"hard"}', '{"emotions","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'abfcfe30-5579-53d8-8a1c-0003e8651fe2', 'abfcfe30-5579-53d8-8a1c-fedae7651fe2', 'It has been a tough month.', 'It has been a ___ month.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'abfcfe30-5579-53d8-8a1c-0007d0651fe2', 'abfcfe30-5579-53d8-8a1c-fedae7651fe2', 'tough decision', '___ decision', 'трудное решение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '5d389400-dc4d-511a-9064-34b8eb0e3d1b', 'stubborn', 'adjective', 'B2',
  'упрямый', 'refusing to change your mind', 'You refuse to change your mind whatever anyone says.',
  'stubborn', '{}', '{"relationships","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '5d389400-dc4d-511a-9064-0003e80e3d1b', '5d389400-dc4d-511a-9064-34b8eb0e3d1b', 'He is stubborn about the smallest things.', 'He is ___ about the smallest things.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '5d389400-dc4d-511a-9064-0007d00e3d1b', '5d389400-dc4d-511a-9064-34b8eb0e3d1b', 'stubborn refusal', '___ refusal', 'упрямый отказ', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '5d389400-dc4d-511a-9064-000bb80e3d1b', '5d389400-dc4d-511a-9064-34b8eb0e3d1b', 'stubbornness', 'noun', 'упрямство', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bd66bc12-2aa4-5dd8-8f8b-bb369eebd379', 'generous', 'adjective', 'B1',
  'щедрый', 'willing to give more than is usual', 'You give more than most people would.',
  'generous', '{}', '{"relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bd66bc12-2aa4-5dd8-8f8b-0003e8ebd379', 'bd66bc12-2aa4-5dd8-8f8b-bb369eebd379', 'That is a very generous offer.', 'That is a very ___ offer.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bd66bc12-2aa4-5dd8-8f8b-0007d0ebd379', 'bd66bc12-2aa4-5dd8-8f8b-bb369eebd379', 'generous with', '___ with', 'щедрый на', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'bd66bc12-2aa4-5dd8-8f8b-000bb8ebd379', 'bd66bc12-2aa4-5dd8-8f8b-bb369eebd379', 'generosity', 'noun', 'щедрость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '657bd4a3-27c0-5751-90e0-71ae91e3e069', 'awkward', 'adjective', 'B2',
  'неловкий', 'making you feel uncomfortable', 'It makes everyone feel uncomfortable.',
  'awkward', '{}', '{"relationships","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '657bd4a3-27c0-5751-90e0-0003e8e3e069', '657bd4a3-27c0-5751-90e0-71ae91e3e069', 'There was an awkward silence.', 'There was an ___ silence.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '657bd4a3-27c0-5751-90e0-0007d0e3e069', '657bd4a3-27c0-5751-90e0-71ae91e3e069', 'awkward silence', '___ silence', 'неловкое молчание', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '657bd4a3-27c0-5751-90e0-000bb8e3e069', '657bd4a3-27c0-5751-90e0-71ae91e3e069', 'awkwardly', 'adverb', 'неловко', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '73fea1aa-6d0a-508b-aae3-030db373d309', 'efficient', 'adjective', 'B2',
  'эффективный', 'working well without wasting time or effort', 'It works well with no waste.',
  'efficient', '{}', '{"work","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '73fea1aa-6d0a-508b-aae3-0003e873d309', '73fea1aa-6d0a-508b-aae3-030db373d309', 'The new process is far more efficient.', 'The new process is far more ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '73fea1aa-6d0a-508b-aae3-0007d073d309', '73fea1aa-6d0a-508b-aae3-030db373d309', 'efficient use', '___ use', 'эффективное использование', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '73fea1aa-6d0a-508b-aae3-000bb873d309', '73fea1aa-6d0a-508b-aae3-030db373d309', 'efficiency', 'noun', 'эффективность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '73fea1aa-6d0a-508b-aae3-000bb973d309', '73fea1aa-6d0a-508b-aae3-030db373d309', 'inefficient', 'adjective', 'неэффективный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f96f949a-b66c-5677-9eb4-8f72ac83c971', 'thorough', 'adjective', 'C1',
  'тщательный', 'done carefully and completely', 'Done carefully with nothing skipped.',
  'thorough', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f96f949a-b66c-5677-9eb4-0003e883c971', 'f96f949a-b66c-5677-9eb4-8f72ac83c971', 'She did a thorough check of the data.', 'She did a ___ check of the data.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f96f949a-b66c-5677-9eb4-0007d083c971', 'f96f949a-b66c-5677-9eb4-8f72ac83c971', 'thorough review', '___ review', 'тщательный обзор', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'f96f949a-b66c-5677-9eb4-000bb883c971', 'f96f949a-b66c-5677-9eb4-8f72ac83c971', 'thoroughly', 'adverb', 'тщательно', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3d714a76-08a2-5416-9573-574c971a8d92', 'subtle', 'adjective', 'C1',
  'тонкий', 'not obvious, needing attention to notice', 'Not obvious. You have to pay attention to catch it.',
  'subtle', '{}', '{"abstract","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3d714a76-08a2-5416-9573-0003e81a8d92', '3d714a76-08a2-5416-9573-574c971a8d92', 'There is a subtle difference between them.', 'There is a ___ difference between them.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3d714a76-08a2-5416-9573-0007d01a8d92', '3d714a76-08a2-5416-9573-574c971a8d92', 'subtle difference', '___ difference', 'тонкое различие', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3d714a76-08a2-5416-9573-000bb81a8d92', '3d714a76-08a2-5416-9573-574c971a8d92', 'subtlety', 'noun', 'тонкость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'fb7e80a5-81fd-57c6-b3a6-aa0a5965c0fe', 'vague', 'adjective', 'B2',
  'расплывчатый', 'not clear or exact', 'Not clear enough to act on.',
  'vague', '{}', '{"communication","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'fb7e80a5-81fd-57c6-b3a6-0003e865c0fe', 'fb7e80a5-81fd-57c6-b3a6-aa0a5965c0fe', 'His answer was deliberately vague.', 'His answer was deliberately ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'fb7e80a5-81fd-57c6-b3a6-0007d065c0fe', 'fb7e80a5-81fd-57c6-b3a6-aa0a5965c0fe', 'vague idea', '___ idea', 'смутное представление', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'fb7e80a5-81fd-57c6-b3a6-000bb865c0fe', 'fb7e80a5-81fd-57c6-b3a6-aa0a5965c0fe', 'vaguely', 'adverb', 'смутно', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '2db2b96d-8145-5e53-a68e-0f3e33a16abe', 'issue', 'noun', 'B1',
  'проблема', 'a problem that needs attention', 'A problem someone needs to deal with.',
  'issue', '{}', '{"work","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '2db2b96d-8145-5e53-a68e-0003e8a16abe', '2db2b96d-8145-5e53-a68e-0f3e33a16abe', 'We ran into an issue with the payment.', 'We ran into an ___ with the payment.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '2db2b96d-8145-5e53-a68e-0007d0a16abe', '2db2b96d-8145-5e53-a68e-0f3e33a16abe', 'raise an issue', 'raise an ___', 'поднять вопрос', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '2db2b96d-8145-5e53-a68e-0007d1a16abe', '2db2b96d-8145-5e53-a68e-0f3e33a16abe', 'address an issue', 'address an ___', 'решить проблему', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '8dbbf5ff-7ab2-554b-9053-cccbb471dbec', 'opportunity', 'noun', 'B1',
  'возможность', 'a chance to do something good', 'A chance to do something worthwhile.',
  'opportunity', '{"chance"}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '8dbbf5ff-7ab2-554b-9053-0003e871dbec', '8dbbf5ff-7ab2-554b-9053-cccbb471dbec', 'This is a real opportunity for you.', 'This is a real ___ for you.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '8dbbf5ff-7ab2-554b-9053-0007d071dbec', '8dbbf5ff-7ab2-554b-9053-cccbb471dbec', 'miss an opportunity', 'miss an ___', 'упустить возможность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd6d48b06-f80c-5cad-b8a9-b2eabe36ca5f', 'attitude', 'noun', 'B2',
  'отношение', 'the way you think and feel about something', 'How you think and feel about something, shown in how you act.',
  'attitude', '{}', '{"relationships","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd6d48b06-f80c-5cad-b8a9-0003e836ca5f', 'd6d48b06-f80c-5cad-b8a9-b2eabe36ca5f', 'Her attitude changed completely.', 'Her ___ changed completely.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd6d48b06-f80c-5cad-b8a9-0007d036ca5f', 'd6d48b06-f80c-5cad-b8a9-b2eabe36ca5f', 'positive attitude', 'positive ___', 'позитивный настрой', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '5afecfd3-bfe6-5dce-8f94-699ce0a5c617', 'purpose', 'noun', 'B1',
  'цель', 'the reason why something is done', 'The reason something is done at all.',
  'purpose', '{}', '{"abstract","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '5afecfd3-bfe6-5dce-8f94-0003e8a5c617', '5afecfd3-bfe6-5dce-8f94-699ce0a5c617', 'What is the purpose of this form?', 'What is the ___ of this form?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '5afecfd3-bfe6-5dce-8f94-0007d0a5c617', '5afecfd3-bfe6-5dce-8f94-699ce0a5c617', 'on purpose', 'on ___', 'намеренно', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '5afecfd3-bfe6-5dce-8f94-000bb8a5c617', '5afecfd3-bfe6-5dce-8f94-699ce0a5c617', 'purposeful', 'adjective', 'целенаправленный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3d4a8161-ab8f-5816-b1dc-6a9102716b3e', 'benefit', 'noun', 'B2',
  'польза', 'a helpful or good effect', 'The good that comes out of something.',
  'benefit', '{"advantage"}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3d4a8161-ab8f-5816-b1dc-0003e8716b3e', '3d4a8161-ab8f-5816-b1dc-6a9102716b3e', 'The main benefit is flexibility.', 'The main ___ is flexibility.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3d4a8161-ab8f-5816-b1dc-0007d0716b3e', '3d4a8161-ab8f-5816-b1dc-6a9102716b3e', 'health benefits', 'health ___', 'польза для здоровья', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3d4a8161-ab8f-5816-b1dc-000bb8716b3e', '3d4a8161-ab8f-5816-b1dc-6a9102716b3e', 'beneficial', 'adjective', 'полезный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f9161bcb-90f7-5618-8581-ae19b59a457b', 'concern', 'noun', 'B2',
  'беспокойство', 'a worry about something important', 'A worry about something that matters.',
  'concern', '{}', '{"work","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f9161bcb-90f7-5618-8581-0003e89a457b', 'f9161bcb-90f7-5618-8581-ae19b59a457b', 'My main concern is the timing.', 'My main ___ is the timing.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f9161bcb-90f7-5618-8581-0007d09a457b', 'f9161bcb-90f7-5618-8581-ae19b59a457b', 'cause for concern', 'cause for ___', 'повод для беспокойства', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'f9161bcb-90f7-5618-8581-000bb89a457b', 'f9161bcb-90f7-5618-8581-ae19b59a457b', 'concerned', 'adjective', 'обеспокоенный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a33b81da-0ba7-5735-b4f7-bfb3eab53e23', 'decision', 'noun', 'A2',
  'решение', 'a choice you make after thinking', 'The choice you land on after thinking.',
  'decision', '{}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a33b81da-0ba7-5735-b4f7-0003e8b53e23', 'a33b81da-0ba7-5735-b4f7-bfb3eab53e23', 'It was the hardest decision of my life.', 'It was the hardest ___ of my life.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a33b81da-0ba7-5735-b4f7-0007d0b53e23', 'a33b81da-0ba7-5735-b4f7-bfb3eab53e23', 'make a decision', 'make a ___', 'принять решение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a33b81da-0ba7-5735-b4f7-000bb8b53e23', 'a33b81da-0ba7-5735-b4f7-bfb3eab53e23', 'decide', 'verb', 'решать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'a33b81da-0ba7-5735-b4f7-000bb9b53e23', 'a33b81da-0ba7-5735-b4f7-bfb3eab53e23', 'decisive', 'adjective', 'решительный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1919cde5-1100-577d-9e48-2ed91adb6c2f', 'effort', 'noun', 'B1',
  'усилие', 'the physical or mental energy you put into something', 'The energy you put into something.',
  'effort', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1919cde5-1100-577d-9e48-0003e8db6c2f', '1919cde5-1100-577d-9e48-2ed91adb6c2f', 'It took a lot of effort to get here.', 'It took a lot of ___ to get here.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1919cde5-1100-577d-9e48-0007d0db6c2f', '1919cde5-1100-577d-9e48-2ed91adb6c2f', 'make an effort', 'make an ___', 'приложить усилие', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '1919cde5-1100-577d-9e48-000bb8db6c2f', '1919cde5-1100-577d-9e48-2ed91adb6c2f', 'effortless', 'adjective', 'лёгкий', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3bda8bc1-c2a5-5784-8d4c-e99540422851', 'experience', 'noun', 'A2',
  'опыт', 'knowledge or skill gained from doing something', 'What you know because you have done it before.',
  'experience', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3bda8bc1-c2a5-5784-8d4c-0003e8422851', '3bda8bc1-c2a5-5784-8d4c-e99540422851', 'She has ten years of experience.', 'She has ten years of ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3bda8bc1-c2a5-5784-8d4c-0007d0422851', '3bda8bc1-c2a5-5784-8d4c-e99540422851', 'gain experience', 'gain ___', 'набраться опыта', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '3bda8bc1-c2a5-5784-8d4c-000bb8422851', '3bda8bc1-c2a5-5784-8d4c-e99540422851', 'experienced', 'adjective', 'опытный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3e77b25c-c686-5176-94d2-ca69638b7daa', 'impact', 'noun', 'B2',
  'воздействие', 'a strong effect on something', 'A strong effect on something else.',
  'impact', '{"effect"}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3e77b25c-c686-5176-94d2-0003e88b7daa', '3e77b25c-c686-5176-94d2-ca69638b7daa', 'The change had an immediate impact.', 'The change had an immediate ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3e77b25c-c686-5176-94d2-0007d08b7daa', '3e77b25c-c686-5176-94d2-ca69638b7daa', 'have an impact', 'have an ___', 'оказывать влияние', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b92c0390-4b39-5984-a1dc-d16ef4cb982c', 'progress', 'noun', 'B1',
  'прогресс', 'movement towards a better state', 'Movement towards something better.',
  'progress', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b92c0390-4b39-5984-a1dc-0003e8cb982c', 'b92c0390-4b39-5984-a1dc-d16ef4cb982c', 'We are making slow progress.', 'We are making slow ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b92c0390-4b39-5984-a1dc-0007d0cb982c', 'b92c0390-4b39-5984-a1dc-d16ef4cb982c', 'make progress', 'make ___', 'делать успехи', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'db0b26ae-b170-5303-beb2-eebb4e02cfda', 'reason', 'noun', 'A2',
  'причина', 'why something happens or is done', 'Why something happens.',
  'reason', '{}', '{"abstract","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'db0b26ae-b170-5303-beb2-0003e802cfda', 'db0b26ae-b170-5303-beb2-eebb4e02cfda', 'There is no reason to worry.', 'There is no ___ to worry.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'db0b26ae-b170-5303-beb2-0007d002cfda', 'db0b26ae-b170-5303-beb2-eebb4e02cfda', 'for that reason', 'for that ___', 'по этой причине', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'db0b26ae-b170-5303-beb2-000bb802cfda', 'db0b26ae-b170-5303-beb2-eebb4e02cfda', 'reasonable', 'adjective', 'разумный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '87ae3d40-164d-5a6f-92ce-c339045e3875', 'solution', 'noun', 'B1',
  'решение', 'a way of dealing with a problem', 'A way of dealing with a problem.',
  'solution', '{}', '{"work","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '87ae3d40-164d-5a6f-92ce-0003e85e3875', '87ae3d40-164d-5a6f-92ce-c339045e3875', 'We found a temporary solution.', 'We found a temporary ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '87ae3d40-164d-5a6f-92ce-0007d05e3875', '87ae3d40-164d-5a6f-92ce-c339045e3875', 'find a solution', 'find a ___', 'найти решение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '87ae3d40-164d-5a6f-92ce-000bb85e3875', '87ae3d40-164d-5a6f-92ce-c339045e3875', 'solve', 'verb', 'решать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '0bd5474f-5544-53c9-bec9-9629a0493a0a', 'advantage', 'noun', 'B1',
  'преимущество', 'something that helps you do better', 'Something that puts you ahead.',
  'advantage', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '0bd5474f-5544-53c9-bec9-0003e8493a0a', '0bd5474f-5544-53c9-bec9-9629a0493a0a', 'Speaking two languages is an advantage.', 'Speaking two languages is an ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '0bd5474f-5544-53c9-bec9-0007d0493a0a', '0bd5474f-5544-53c9-bec9-9629a0493a0a', 'take advantage of', 'take ___ of', 'воспользоваться', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '0bd5474f-5544-53c9-bec9-000bb8493a0a', '0bd5474f-5544-53c9-bec9-9629a0493a0a', 'disadvantage', 'noun', 'недостаток', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd8cdfa5f-877a-5e5c-b729-05ec22598577', 'attempt', 'noun', 'B2',
  'попытка', 'an act of trying to do something', 'One try at doing something.',
  'attempt', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd8cdfa5f-877a-5e5c-b729-0003e8598577', 'd8cdfa5f-877a-5e5c-b729-05ec22598577', 'It worked on the third attempt.', 'It worked on the third ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd8cdfa5f-877a-5e5c-b729-0007d0598577', 'd8cdfa5f-877a-5e5c-b729-05ec22598577', 'make an attempt', 'make an ___', 'сделать попытку', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd8cdfa5f-877a-5e5c-b729-000bb8598577', 'd8cdfa5f-877a-5e5c-b729-05ec22598577', 'attempt', 'verb', 'пытаться', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '76b3cc59-1e61-587d-934d-eb10b7547836', 'responsibility', 'noun', 'B1',
  'ответственность', 'a duty to deal with something', 'Something it is your job to deal with.',
  'responsibility', '{}', '{"work","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '76b3cc59-1e61-587d-934d-0003e8547836', '76b3cc59-1e61-587d-934d-eb10b7547836', 'Who takes responsibility for this?', 'Who takes ___ for this?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '76b3cc59-1e61-587d-934d-0007d0547836', '76b3cc59-1e61-587d-934d-eb10b7547836', 'take responsibility', 'take ___', 'взять ответственность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '76b3cc59-1e61-587d-934d-000bb8547836', '76b3cc59-1e61-587d-934d-eb10b7547836', 'responsible', 'adjective', 'ответственный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '46cdfb54-89ce-5fa5-b886-268ce85770ec', 'achievement', 'noun', 'B1',
  'достижение', 'something done successfully after effort', 'Something you managed to do after real effort.',
  'achievement', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '46cdfb54-89ce-5fa5-b886-0003e85770ec', '46cdfb54-89ce-5fa5-b886-268ce85770ec', 'Finishing was an achievement in itself.', 'Finishing was an ___ in itself.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '46cdfb54-89ce-5fa5-b886-0007d05770ec', '46cdfb54-89ce-5fa5-b886-268ce85770ec', 'major achievement', 'major ___', 'крупное достижение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '46cdfb54-89ce-5fa5-b886-000bb85770ec', '46cdfb54-89ce-5fa5-b886-268ce85770ec', 'achieve', 'verb', 'достигать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7853396e-88f0-5882-943c-82c81859a010', 'awareness', 'noun', 'B2',
  'осведомлённость', 'knowledge that something exists or matters', 'Knowing that something exists and matters.',
  'awareness', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7853396e-88f0-5882-943c-0003e859a010', '7853396e-88f0-5882-943c-82c81859a010', 'The campaign raised awareness quickly.', 'The campaign raised ___ quickly.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7853396e-88f0-5882-943c-0007d059a010', '7853396e-88f0-5882-943c-82c81859a010', 'raise awareness', 'raise ___', 'повысить осведомлённость', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '7853396e-88f0-5882-943c-000bb859a010', '7853396e-88f0-5882-943c-82c81859a010', 'aware', 'adjective', 'осознающий', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '93dc5139-ee45-554c-85a1-ac569b180764', 'approach', 'noun', 'B2',
  'подход', 'a way of dealing with something', 'The way you go about dealing with something.',
  'approach', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '93dc5139-ee45-554c-85a1-0003e8180764', '93dc5139-ee45-554c-85a1-ac569b180764', 'We took a different approach.', 'We took a different ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '93dc5139-ee45-554c-85a1-0007d0180764', '93dc5139-ee45-554c-85a1-ac569b180764', 'a new approach', 'a new ___', 'новый подход', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '93e24050-db5c-5b46-ab57-849bfb9ce98d', 'demand', 'noun', 'B2',
  'спрос', 'the need or desire for something', 'How much people want something.',
  'demand', '{}', '{"work","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '93e24050-db5c-5b46-ab57-0003e89ce98d', '93e24050-db5c-5b46-ab57-849bfb9ce98d', 'There is huge demand for the new model.', 'There is huge ___ for the new model.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '93e24050-db5c-5b46-ab57-0007d09ce98d', '93e24050-db5c-5b46-ab57-849bfb9ce98d', 'meet demand', 'meet ___', 'удовлетворять спрос', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '93e24050-db5c-5b46-ab57-000bb89ce98d', '93e24050-db5c-5b46-ab57-849bfb9ce98d', 'demanding', 'adjective', 'требовательный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '29a5217b-f964-5af2-9e8b-1fd255298f11', 'risk', 'noun', 'B1',
  'риск', 'the possibility that something bad will happen', 'The chance that something bad happens.',
  'risk', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '29a5217b-f964-5af2-9e8b-0003e8298f11', '29a5217b-f964-5af2-9e8b-1fd255298f11', 'There is a small risk of delay.', 'There is a small ___ of delay.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '29a5217b-f964-5af2-9e8b-0007d0298f11', '29a5217b-f964-5af2-9e8b-1fd255298f11', 'take a risk', 'take a ___', 'рискнуть', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '29a5217b-f964-5af2-9e8b-000bb8298f11', '29a5217b-f964-5af2-9e8b-1fd255298f11', 'risky', 'adjective', 'рискованный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7cf5d6c6-5878-5f7c-8e2a-3ec08a962e2d', 'skill', 'noun', 'A2',
  'навык', 'the ability to do something well', 'Something you can do well because you practised.',
  'skill', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7cf5d6c6-5878-5f7c-8e2a-0003e8962e2d', '7cf5d6c6-5878-5f7c-8e2a-3ec08a962e2d', 'Listening is an underrated skill.', 'Listening is an underrated ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7cf5d6c6-5878-5f7c-8e2a-0007d0962e2d', '7cf5d6c6-5878-5f7c-8e2a-3ec08a962e2d', 'develop a skill', 'develop a ___', 'развивать навык', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '7cf5d6c6-5878-5f7c-8e2a-000bb8962e2d', '7cf5d6c6-5878-5f7c-8e2a-3ec08a962e2d', 'skilled', 'adjective', 'квалифицированный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bb25aced-d46c-59f2-8181-2a0beb9f37bd', 'habit', 'noun', 'B1',
  'привычка', 'something you do regularly without thinking', 'Something you do regularly without deciding to.',
  'habit', '{}', '{"everyday","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bb25aced-d46c-59f2-8181-0003e89f37bd', 'bb25aced-d46c-59f2-8181-2a0beb9f37bd', 'Checking my phone is a bad habit.', 'Checking my phone is a bad ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bb25aced-d46c-59f2-8181-0007d09f37bd', 'bb25aced-d46c-59f2-8181-2a0beb9f37bd', 'break a habit', 'break a ___', 'избавиться от привычки', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bf134d18-c7fb-5d72-b47c-4abca63b041c', 'pressure', 'noun', 'B2',
  'давление', 'the feeling of being pushed to do something', 'The feeling of being pushed to perform.',
  'pressure', '{}', '{"work","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bf134d18-c7fb-5d72-b47c-0003e83b041c', 'bf134d18-c7fb-5d72-b47c-4abca63b041c', 'She works well under pressure.', 'She works well under ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bf134d18-c7fb-5d72-b47c-0007d03b041c', 'bf134d18-c7fb-5d72-b47c-4abca63b041c', 'under pressure', 'under ___', 'под давлением', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '8552c4cc-b014-5cfe-b668-0edf58b0fd4f', 'income', 'noun', 'B2',
  'доход', 'the money you earn', 'The money that comes in.',
  'income', '{}', '{"work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '8552c4cc-b014-5cfe-b668-0003e8b0fd4f', '8552c4cc-b014-5cfe-b668-0edf58b0fd4f', 'Their income dropped last year.', 'Their ___ dropped last year.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '8552c4cc-b014-5cfe-b668-0007d0b0fd4f', '8552c4cc-b014-5cfe-b668-0edf58b0fd4f', 'monthly income', 'monthly ___', 'ежемесячный доход', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7eb0c812-aa15-5709-bcde-92ed318b7be4', 'deadline', 'noun', 'B1',
  'срок', 'the time by which something must be finished', 'The moment by which it must be finished.',
  'deadline', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7eb0c812-aa15-5709-bcde-0003e88b7be4', '7eb0c812-aa15-5709-bcde-92ed318b7be4', 'The deadline is Thursday morning.', 'The ___ is Thursday morning.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7eb0c812-aa15-5709-bcde-0007d08b7be4', '7eb0c812-aa15-5709-bcde-92ed318b7be4', 'meet a deadline', 'meet a ___', 'уложиться в срок', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '515fbf14-7d66-5691-a5d7-633b8a944144', 'budget', 'noun', 'B1',
  'бюджет', 'the money available for something', 'The money you have available.',
  'budget', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '515fbf14-7d66-5691-a5d7-0003e8944144', '515fbf14-7d66-5691-a5d7-633b8a944144', 'The trip was over budget.', 'The trip was over ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '515fbf14-7d66-5691-a5d7-0007d0944144', '515fbf14-7d66-5691-a5d7-633b8a944144', 'tight budget', 'tight ___', 'ограниченный бюджет', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '12edea5a-2da6-5b24-aba4-9c2bd90f7634', 'insight', 'noun', 'C1',
  'понимание', 'a clear and useful understanding of something', 'A clear, useful understanding of how something works.',
  'insight', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '12edea5a-2da6-5b24-aba4-0003e80f7634', '12edea5a-2da6-5b24-aba4-9c2bd90f7634', 'The report gives real insight into the market.', 'The report gives real ___ into the market.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '12edea5a-2da6-5b24-aba4-0007d00f7634', '12edea5a-2da6-5b24-aba4-9c2bd90f7634', 'valuable insight', 'valuable ___', 'ценное понимание', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '12edea5a-2da6-5b24-aba4-000bb80f7634', '12edea5a-2da6-5b24-aba4-9c2bd90f7634', 'insightful', 'adjective', 'проницательный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3d4cf0f6-babd-53cd-9c5d-8d69f7c21cb2', 'outcome', 'noun', 'B2',
  'результат', 'the final result of a process', 'What you are left with at the end.',
  'outcome', '{"result"}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3d4cf0f6-babd-53cd-9c5d-0003e8c21cb2', '3d4cf0f6-babd-53cd-9c5d-8d69f7c21cb2', 'Nobody expected that outcome.', 'Nobody expected that ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3d4cf0f6-babd-53cd-9c5d-0007d0c21cb2', '3d4cf0f6-babd-53cd-9c5d-8d69f7c21cb2', 'likely outcome', 'likely ___', 'вероятный результат', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'df1b2c7f-497a-5298-9dd7-8594df84e09d', 'assumption', 'noun', 'B2',
  'предположение', 'something you accept as true without proof', 'Something you take as true without checking.',
  'assumption', '{}', '{"work","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'df1b2c7f-497a-5298-9dd7-0003e884e09d', 'df1b2c7f-497a-5298-9dd7-8594df84e09d', 'That assumption turned out to be wrong.', 'That ___ turned out to be wrong.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'df1b2c7f-497a-5298-9dd7-0007d084e09d', 'df1b2c7f-497a-5298-9dd7-8594df84e09d', 'make an assumption', 'make an ___', 'сделать предположение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'df1b2c7f-497a-5298-9dd7-000bb884e09d', 'df1b2c7f-497a-5298-9dd7-8594df84e09d', 'assume', 'verb', 'предполагать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f7e08e85-99aa-5e7d-b7d4-8c2e4fd995f6', 'look forward to', 'phrasal_verb', 'B1',
  'с нетерпением ждать', 'to feel pleased about something that is going to happen', 'You feel pleased about something coming up.',
  'look forward to', '{}', '{"communication","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f7e08e85-99aa-5e7d-b7d4-0003e8d995f6', 'f7e08e85-99aa-5e7d-b7d4-8c2e4fd995f6', 'I am looking forward to the weekend.', 'I am ___ the weekend.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f7e08e85-99aa-5e7d-b7d4-0007d0d995f6', 'f7e08e85-99aa-5e7d-b7d4-8c2e4fd995f6', 'look forward to hearing', '___ hearing', 'с нетерпением ждать ответа', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e767e417-07bc-5639-89ce-f4ba6bc946ce', 'give up', 'phrasal_verb', 'B1',
  'сдаваться', 'to stop trying', 'You stop trying.',
  'give up', '{"quit"}', '{"emotions","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e767e417-07bc-5639-89ce-0003e8c946ce', 'e767e417-07bc-5639-89ce-f4ba6bc946ce', 'Do not give up this close to the end.', 'Do not ___ this close to the end.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e767e417-07bc-5639-89ce-0007d0c946ce', 'e767e417-07bc-5639-89ce-f4ba6bc946ce', 'give up smoking', '___ smoking', 'бросить курить', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '481e54da-2d45-5ab6-8fa4-7a33f90ad377', 'figure out', 'phrasal_verb', 'B2',
  'разобраться', 'to understand something after thinking about it', 'You work something out in your head.',
  'figure out', '{"work out"}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '481e54da-2d45-5ab6-8fa4-0003e80ad377', '481e54da-2d45-5ab6-8fa4-7a33f90ad377', 'I cannot figure out what went wrong.', 'I cannot ___ what went wrong.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '481e54da-2d45-5ab6-8fa4-0007d00ad377', '481e54da-2d45-5ab6-8fa4-7a33f90ad377', 'figure out a solution', '___ a solution', 'найти решение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6a8d298b-dc45-5f14-a19d-60386406d0e4', 'turn down', 'phrasal_verb', 'B2',
  'отклонять', 'to refuse an offer or a request', 'You say no to an offer.',
  'turn down', '{"reject","decline"}', '{"work","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6a8d298b-dc45-5f14-a19d-0003e806d0e4', '6a8d298b-dc45-5f14-a19d-60386406d0e4', 'She turned down the job.', 'She ___ the job.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6a8d298b-dc45-5f14-a19d-0007d006d0e4', '6a8d298b-dc45-5f14-a19d-60386406d0e4', 'turn down an offer', '___ an offer', 'отклонить предложение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4a17a415-370a-5f00-a3da-c7e58c89982d', 'come up with', 'phrasal_verb', 'B2',
  'придумать', 'to think of an idea or a plan', 'You produce an idea when one is needed.',
  'come up with', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4a17a415-370a-5f00-a3da-0003e889982d', '4a17a415-370a-5f00-a3da-c7e58c89982d', 'He came up with a better name.', 'He ___ a better name.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4a17a415-370a-5f00-a3da-0007d089982d', '4a17a415-370a-5f00-a3da-c7e58c89982d', 'come up with an idea', '___ an idea', 'придумать идею', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f2f79a31-8da1-5481-b3ba-bc7ba0dc9e92', 'put off', 'phrasal_verb', 'B1',
  'откладывать', 'to delay something until later', 'You move something to later.',
  'put off', '{"postpone","delay"}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f2f79a31-8da1-5481-b3ba-0003e8dc9e92', 'f2f79a31-8da1-5481-b3ba-bc7ba0dc9e92', 'Stop putting off the phone call.', 'Stop ___ the phone call.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f2f79a31-8da1-5481-b3ba-0007d0dc9e92', 'f2f79a31-8da1-5481-b3ba-bc7ba0dc9e92', 'put off a decision', '___ a decision', 'отложить решение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '84742fe0-c5c4-54e3-b607-da912eeaf33b', 'run out of', 'phrasal_verb', 'B1',
  'заканчиваться', 'to have no more of something left', 'You have none of it left.',
  'run out of', '{}', '{"everyday","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '84742fe0-c5c4-54e3-b607-0003e8eaf33b', '84742fe0-c5c4-54e3-b607-da912eeaf33b', 'We ran out of time.', 'We ___ time.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '84742fe0-c5c4-54e3-b607-0007d0eaf33b', '84742fe0-c5c4-54e3-b607-da912eeaf33b', 'run out of money', '___ money', 'остаться без денег', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4c153740-3b3c-511c-a24a-fa4ae6adf1ca', 'get on with', 'phrasal_verb', 'B2',
  'ладить с', 'to have a good relationship with someone', 'You have an easy relationship with someone.',
  'get on with', '{}', '{"relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4c153740-3b3c-511c-a24a-0003e8adf1ca', '4c153740-3b3c-511c-a24a-fa4ae6adf1ca', 'I get on with most of my colleagues.', 'I ___ most of my colleagues.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4c153740-3b3c-511c-a24a-0007d0adf1ca', '4c153740-3b3c-511c-a24a-fa4ae6adf1ca', 'get on with people', '___ people', 'ладить с людьми', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '00eff9a4-935f-517f-ab0b-8b54d0a4a6d7', 'work out', 'phrasal_verb', 'B2',
  'получаться', 'to develop in a successful way', 'Things develop the way you hoped.',
  'work out', '{}', '{"abstract","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '00eff9a4-935f-517f-ab0b-0003e8a4a6d7', '00eff9a4-935f-517f-ab0b-8b54d0a4a6d7', 'It all worked out in the end.', 'It all ___ in the end.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '00eff9a4-935f-517f-ab0b-0007d0a4a6d7', '00eff9a4-935f-517f-ab0b-8b54d0a4a6d7', 'work out well', '___ well', 'сложиться хорошо', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '5ed87d47-0b99-50ad-a424-d84d1ce0cb28', 'point out', 'phrasal_verb', 'B2',
  'указывать', 'to tell someone about a fact they had not noticed', 'You draw someone''s attention to a fact.',
  'point out', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '5ed87d47-0b99-50ad-a424-0003e8e0cb28', '5ed87d47-0b99-50ad-a424-d84d1ce0cb28', 'She pointed out the mistake politely.', 'She ___ the mistake politely.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '5ed87d47-0b99-50ad-a424-0007d0e0cb28', '5ed87d47-0b99-50ad-a424-d84d1ce0cb28', 'point out a problem', '___ a problem', 'указать на проблему', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '71238b96-6691-5fda-9281-7c3250a68eb0', 'bring up', 'phrasal_verb', 'B2',
  'поднимать тему', 'to start talking about a subject', 'You start talking about a subject.',
  'bring up', '{"raise"}', '{"communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '71238b96-6691-5fda-9281-0003e8a68eb0', '71238b96-6691-5fda-9281-7c3250a68eb0', 'Nobody wanted to bring up the money.', 'Nobody wanted to ___ the money.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '71238b96-6691-5fda-9281-0007d0a68eb0', '71238b96-6691-5fda-9281-7c3250a68eb0', 'bring up a topic', '___ a topic', 'поднять тему', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f86c6048-7c39-5a32-ae3b-da9218529325', 'carry on', 'phrasal_verb', 'B1',
  'продолжать', 'to continue doing something', 'You keep doing it.',
  'carry on', '{"continue"}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f86c6048-7c39-5a32-ae3b-0003e8529325', 'f86c6048-7c39-5a32-ae3b-da9218529325', 'Carry on without me.', '___ without me.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f86c6048-7c39-5a32-ae3b-0007d0529325', 'f86c6048-7c39-5a32-ae3b-da9218529325', 'carry on working', '___ working', 'продолжать работать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6dd85449-a4e2-5751-bd18-3e587d919c67', 'catch up', 'phrasal_verb', 'B1',
  'наверстать', 'to reach the same level as others after falling behind', 'You get back to where everyone else is.',
  'catch up', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6dd85449-a4e2-5751-bd18-0003e8919c67', '6dd85449-a4e2-5751-bd18-3e587d919c67', 'I need to catch up on my reading.', 'I need to ___ on my reading.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6dd85449-a4e2-5751-bd18-0007d0919c67', '6dd85449-a4e2-5751-bd18-3e587d919c67', 'catch up with', '___ with', 'догнать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ab4c6116-5efe-51ed-8aa7-c5c77ffee125', 'end up', 'phrasal_verb', 'B2',
  'в итоге оказаться', 'to be in a situation you did not plan', 'You land somewhere you did not plan.',
  'end up', '{}', '{"travel","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ab4c6116-5efe-51ed-8aa7-0003e8fee125', 'ab4c6116-5efe-51ed-8aa7-c5c77ffee125', 'We ended up walking home.', 'We ___ walking home.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ab4c6116-5efe-51ed-8aa7-0007d0fee125', 'ab4c6116-5efe-51ed-8aa7-c5c77ffee125', 'end up doing', '___ doing', 'в итоге сделать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '0d4d2efd-cc98-58d2-86db-f3e068352b3c', 'sort out', 'phrasal_verb', 'B2',
  'улаживать', 'to deal with a problem successfully', 'You deal with a mess and it is fixed.',
  'sort out', '{}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '0d4d2efd-cc98-58d2-86db-0003e8352b3c', '0d4d2efd-cc98-58d2-86db-f3e068352b3c', 'I will sort it out tomorrow.', 'I will ___ it tomorrow.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '0d4d2efd-cc98-58d2-86db-0007d0352b3c', '0d4d2efd-cc98-58d2-86db-f3e068352b3c', 'sort out a problem', '___ a problem', 'уладить проблему', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b1d90fa9-61fe-5916-b4a8-95cb06b5e302', 'make a decision', 'collocation', 'B1',
  'принять решение', 'to decide something', 'You finally decide.',
  'make a decision', '{}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b1d90fa9-61fe-5916-b4a8-0003e8b5e302', 'b1d90fa9-61fe-5916-b4a8-95cb06b5e302', 'We have to make a decision by Friday.', 'We have to ___ by Friday.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b1d90fa9-61fe-5916-b4a8-0007d0b5e302', 'b1d90fa9-61fe-5916-b4a8-95cb06b5e302', 'make a decision', 'make a ___', 'принять решение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7cea5531-f785-5f3e-a7e5-32a0b384ea76', 'take responsibility', 'collocation', 'B2',
  'взять ответственность', 'to accept that something is your duty', 'You accept that it is on you.',
  'take responsibility', '{}', '{"work","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7cea5531-f785-5f3e-a7e5-0003e884ea76', '7cea5531-f785-5f3e-a7e5-32a0b384ea76', 'Someone has to take responsibility for this.', 'Someone has to ___ for this.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7cea5531-f785-5f3e-a7e5-0007d084ea76', '7cea5531-f785-5f3e-a7e5-32a0b384ea76', 'take responsibility', '___ responsibility', 'взять ответственность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '90a2a6b1-eb2c-523b-b893-74eab50f0f34', 'raise awareness', 'collocation', 'B2',
  'повысить осведомлённость', 'to make more people know about something', 'You make more people know about something.',
  'raise awareness', '{}', '{"work","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '90a2a6b1-eb2c-523b-b893-0003e80f0f34', '90a2a6b1-eb2c-523b-b893-74eab50f0f34', 'The campaign raised awareness of the risks.', 'The campaign ___ of the risks.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '90a2a6b1-eb2c-523b-b893-0007d00f0f34', '90a2a6b1-eb2c-523b-b893-74eab50f0f34', 'raise awareness', 'raise ___', 'повысить осведомлённость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f4576b51-6d1b-5ce0-bc53-9be1127708c3', 'strongly recommend', 'collocation', 'B2',
  'настоятельно рекомендовать', 'to recommend something very firmly', 'You recommend something very firmly.',
  'strongly recommend', '{}', '{"communication","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f4576b51-6d1b-5ce0-bc53-0003e87708c3', 'f4576b51-6d1b-5ce0-bc53-9be1127708c3', 'I strongly recommend booking early.', 'I ___ booking early.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f4576b51-6d1b-5ce0-bc53-0007d07708c3', 'f4576b51-6d1b-5ce0-bc53-9be1127708c3', 'strongly recommend', '___ recommend', 'настоятельно рекомендовать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'db7969c5-fc1f-50ef-a2f3-47ab0dc4ca6f', 'deeply concerned', 'collocation', 'C1',
  'глубоко обеспокоенный', 'very worried about something serious', 'You are very worried about something serious.',
  'deeply concerned', '{}', '{"work","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'db7969c5-fc1f-50ef-a2f3-0003e8c4ca6f', 'db7969c5-fc1f-50ef-a2f3-47ab0dc4ca6f', 'We are deeply concerned about the delay.', 'We are ___ about the delay.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'db7969c5-fc1f-50ef-a2f3-0007d0c4ca6f', 'db7969c5-fc1f-50ef-a2f3-47ab0dc4ca6f', 'deeply concerned', 'deeply ___', 'глубоко обеспокоенный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7e064cf0-99af-532d-9b4b-7199bca13dea', 'pay attention', 'collocation', 'B1',
  'обращать внимание', 'to watch or listen carefully', 'You watch or listen carefully.',
  'pay attention', '{}', '{"study","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7e064cf0-99af-532d-9b4b-0003e8a13dea', '7e064cf0-99af-532d-9b4b-7199bca13dea', 'Pay attention to the small print.', '___ to the small print.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7e064cf0-99af-532d-9b4b-0007d0a13dea', '7e064cf0-99af-532d-9b4b-7199bca13dea', 'pay attention to', 'pay ___ to', 'обращать внимание на', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f5bfb59e-004c-5207-8284-b6a7b8d18e9f', 'keep in touch', 'collocation', 'B1',
  'поддерживать связь', 'to continue contacting someone', 'You keep contacting someone over time.',
  'keep in touch', '{"stay in touch"}', '{"relationships","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f5bfb59e-004c-5207-8284-0003e8d18e9f', 'f5bfb59e-004c-5207-8284-b6a7b8d18e9f', 'We still keep in touch after ten years.', 'We still ___ after ten years.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f5bfb59e-004c-5207-8284-0007d0d18e9f', 'f5bfb59e-004c-5207-8284-b6a7b8d18e9f', 'keep in touch', 'keep in ___', 'поддерживать связь', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c99d0384-fa5e-5b4b-8243-f75703cf52d1', 'take into account', 'collocation', 'B2',
  'принимать во внимание', 'to consider something when making a decision', 'You consider it when you decide.',
  'take into account', '{"consider"}', '{"work","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c99d0384-fa5e-5b4b-8243-0003e8cf52d1', 'c99d0384-fa5e-5b4b-8243-f75703cf52d1', 'You have to take the cost into account.', 'You have to ___ the cost ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c99d0384-fa5e-5b4b-8243-0007d0cf52d1', 'c99d0384-fa5e-5b4b-8243-f75703cf52d1', 'take into account', 'take into ___', 'учитывать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'fb644da8-c2ff-5378-8949-d4f6a76c26a1', 'meet a deadline', 'collocation', 'B1',
  'уложиться в срок', 'to finish something in time', 'You finish in time.',
  'meet a deadline', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'fb644da8-c2ff-5378-8949-0003e86c26a1', 'fb644da8-c2ff-5378-8949-d4f6a76c26a1', 'We met every deadline this quarter.', 'We ___ every ___ this quarter.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'fb644da8-c2ff-5378-8949-0007d06c26a1', 'fb644da8-c2ff-5378-8949-d4f6a76c26a1', 'meet a deadline', 'meet a ___', 'уложиться в срок', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a9e914aa-4df1-50f5-bd26-1997167be688', 'make progress', 'collocation', 'B1',
  'делать успехи', 'to move forward towards a goal', 'You move forward towards the goal.',
  'make progress', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a9e914aa-4df1-50f5-bd26-0003e87be688', 'a9e914aa-4df1-50f5-bd26-1997167be688', 'We are making steady progress.', 'We are ___ steady ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a9e914aa-4df1-50f5-bd26-0007d07be688', 'a9e914aa-4df1-50f5-bd26-1997167be688', 'make progress', 'make ___', 'делать успехи', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3ae0ce57-89f5-537e-b08a-28134d38f456', 'have an impact', 'collocation', 'B2',
  'оказывать влияние', 'to affect something noticeably', 'It noticeably affects something.',
  'have an impact', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3ae0ce57-89f5-537e-b08a-0003e838f456', '3ae0ce57-89f5-537e-b08a-28134d38f456', 'Small changes can have a big impact.', 'Small changes can ___ a big ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3ae0ce57-89f5-537e-b08a-0007d038f456', '3ae0ce57-89f5-537e-b08a-28134d38f456', 'have an impact on', 'have an ___ on', 'влиять на', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '17b8e80e-ba55-5f1e-8397-a72df0c806a2', 'take advantage of', 'collocation', 'B2',
  'воспользоваться', 'to make good use of an opportunity', 'You make good use of a chance.',
  'take advantage of', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '17b8e80e-ba55-5f1e-8397-0003e8c806a2', '17b8e80e-ba55-5f1e-8397-a72df0c806a2', 'Take advantage of the early booking.', '___ of the early booking.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '17b8e80e-ba55-5f1e-8397-0007d0c806a2', '17b8e80e-ba55-5f1e-8397-a72df0c806a2', 'take advantage of', 'take ___ of', 'воспользоваться', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '2700f31a-5b88-5fc3-8325-19778c3df2ee', 'break a habit', 'collocation', 'B2',
  'избавиться от привычки', 'to stop doing something you do regularly', 'You stop doing something automatic.',
  'break a habit', '{}', '{"everyday","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '2700f31a-5b88-5fc3-8325-0003e83df2ee', '2700f31a-5b88-5fc3-8325-19778c3df2ee', 'It took a year to break the habit.', 'It took a year to ___ the ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '2700f31a-5b88-5fc3-8325-0007d03df2ee', '2700f31a-5b88-5fc3-8325-19778c3df2ee', 'break a habit', 'break a ___', 'избавиться от привычки', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a2d74136-2080-5632-81d4-d623862756fa', 'draw a conclusion', 'collocation', 'C1',
  'сделать вывод', 'to decide something based on evidence', 'You decide something from the evidence.',
  'draw a conclusion', '{}', '{"study","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a2d74136-2080-5632-81d4-0003e82756fa', 'a2d74136-2080-5632-81d4-d623862756fa', 'It is too early to draw conclusions.', 'It is too early to ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a2d74136-2080-5632-81d4-0007d02756fa', 'a2d74136-2080-5632-81d4-d623862756fa', 'draw a conclusion', 'draw a ___', 'сделать вывод', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4891522d-1c9d-5757-a6c1-c0d6625a8621', 'set a goal', 'collocation', 'B1',
  'поставить цель', 'to decide what you want to achieve', 'You decide what you want to achieve.',
  'set a goal', '{}', '{"study","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4891522d-1c9d-5757-a6c1-0003e85a8621', '4891522d-1c9d-5757-a6c1-c0d6625a8621', 'Set a goal you can actually reach.', '___ you can actually reach.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4891522d-1c9d-5757-a6c1-0007d05a8621', '4891522d-1c9d-5757-a6c1-c0d6625a8621', 'set a goal', 'set a ___', 'поставить цель', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '71ef61aa-68c5-5f69-aa83-4b18a72877e6', 'barely', 'adverb', 'B2',
  'едва', 'almost not at all', 'Almost not at all.',
  'barely', '{"hardly"}', '{"abstract","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '71ef61aa-68c5-5f69-aa83-0003e82877e6', '71ef61aa-68c5-5f69-aa83-4b18a72877e6', 'I barely slept last night.', 'I ___ slept last night.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '71ef61aa-68c5-5f69-aa83-0007d02877e6', '71ef61aa-68c5-5f69-aa83-4b18a72877e6', 'barely enough', '___ enough', 'едва достаточно', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '999dc697-44cd-5c01-94dc-4ee6ac3f26ac', 'eventually', 'adverb', 'B1',
  'в конце концов', 'after a long time or a lot of effort', 'After a long time it finally happens.',
  'eventually', '{}', '{"abstract","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '999dc697-44cd-5c01-94dc-0003e83f26ac', '999dc697-44cd-5c01-94dc-4ee6ac3f26ac', 'Eventually the train arrived.', '___ the train arrived.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '999dc697-44cd-5c01-94dc-0007d03f26ac', '999dc697-44cd-5c01-94dc-4ee6ac3f26ac', 'eventually happen', '___ happen', 'в итоге произойти', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3caae672-a3c4-5ef9-bf0d-ed64fdcc5fb7', 'apparently', 'adverb', 'B2',
  'по-видимому', 'according to what you have heard', 'You heard it from somewhere but cannot confirm it.',
  'apparently', '{}', '{"communication","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3caae672-a3c4-5ef9-bf0d-0003e8cc5fb7', '3caae672-a3c4-5ef9-bf0d-ed64fdcc5fb7', 'Apparently they are moving abroad.', '___ they are moving abroad.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3caae672-a3c4-5ef9-bf0d-0007d0cc5fb7', '3caae672-a3c4-5ef9-bf0d-ed64fdcc5fb7', 'apparently not', '___ not', 'видимо нет', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '2d0554ab-2a2c-5457-bcfa-115fdcedb8f1', 'deliberately', 'adverb', 'B2',
  'намеренно', 'done on purpose', 'On purpose, not by accident.',
  'deliberately', '{"on purpose","intentionally"}', '{"abstract","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '2d0554ab-2a2c-5457-bcfa-0003e8edb8f1', '2d0554ab-2a2c-5457-bcfa-115fdcedb8f1', 'He deliberately left it out.', 'He ___ left it out.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '2d0554ab-2a2c-5457-bcfa-0007d0edb8f1', '2d0554ab-2a2c-5457-bcfa-115fdcedb8f1', 'deliberately vague', '___ vague', 'намеренно расплывчатый', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '2d0554ab-2a2c-5457-bcfa-000bb8edb8f1', '2d0554ab-2a2c-5457-bcfa-115fdcedb8f1', 'deliberate', 'adjective', 'намеренный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'cecb6f6a-5f54-5fbe-a090-9a7300d2c2b3', 'gradually', 'adverb', 'B2',
  'постепенно', 'slowly over a period of time', 'Slowly, a bit at a time.',
  'gradually', '{}', '{"abstract","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'cecb6f6a-5f54-5fbe-a090-0003e8d2c2b3', 'cecb6f6a-5f54-5fbe-a090-9a7300d2c2b3', 'The pain gradually went away.', 'The pain ___ went away.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'cecb6f6a-5f54-5fbe-a090-0007d0d2c2b3', 'cecb6f6a-5f54-5fbe-a090-9a7300d2c2b3', 'gradually improve', '___ improve', 'постепенно улучшаться', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'cecb6f6a-5f54-5fbe-a090-000bb8d2c2b3', 'cecb6f6a-5f54-5fbe-a090-9a7300d2c2b3', 'gradual', 'adjective', 'постепенный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '3fb6fbbc-8053-5fef-9309-1ac89a03073a', 'rarely', 'adverb', 'B1',
  'редко', 'not often', 'Not often at all.',
  'rarely', '{"seldom"}', '{"everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '3fb6fbbc-8053-5fef-9309-0003e803073a', '3fb6fbbc-8053-5fef-9309-1ac89a03073a', 'We rarely go out on weekdays.', 'We ___ go out on weekdays.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '3fb6fbbc-8053-5fef-9309-0007d003073a', '3fb6fbbc-8053-5fef-9309-1ac89a03073a', 'rarely happen', '___ happen', 'редко случаться', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c3262e76-5a63-51c5-a44c-cfcb5a1ca46c', 'roughly', 'adverb', 'B2',
  'приблизительно', 'not exactly but close', 'Not exact, but close enough.',
  'roughly', '{"approximately","about"}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c3262e76-5a63-51c5-a44c-0003e81ca46c', 'c3262e76-5a63-51c5-a44c-cfcb5a1ca46c', 'It takes roughly forty minutes.', 'It takes ___ forty minutes.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c3262e76-5a63-51c5-a44c-0007d01ca46c', 'c3262e76-5a63-51c5-a44c-cfcb5a1ca46c', 'roughly the same', '___ the same', 'примерно то же самое', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '906019dd-b6ae-572e-a4a4-98e7724a8683', 'therefore', 'adverb', 'B2',
  'следовательно', 'for that reason', 'For that reason, so.',
  'therefore', '{}', '{"writing","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '906019dd-b6ae-572e-a4a4-0003e84a8683', '906019dd-b6ae-572e-a4a4-98e7724a8683', 'The data was incomplete and therefore unusable.', 'The data was incomplete and ___ unusable.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '906019dd-b6ae-572e-a4a4-0007d04a8683', '906019dd-b6ae-572e-a4a4-98e7724a8683', 'therefore we', '___ we', 'следовательно мы', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '13ef655a-625d-580a-b34a-a9fd097e2e86', 'nevertheless', 'adverb', 'C1',
  'тем не менее', 'despite what has just been said', 'Despite everything just said, it is still true.',
  'nevertheless', '{"nonetheless"}', '{"writing","opinions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '13ef655a-625d-580a-b34a-0003e87e2e86', '13ef655a-625d-580a-b34a-a9fd097e2e86', 'It was expensive. Nevertheless, it was worth it.', 'It was expensive. ___, it was worth it.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '13ef655a-625d-580a-b34a-0007d07e2e86', '13ef655a-625d-580a-b34a-a9fd097e2e86', 'nevertheless remain', '___ remain', 'тем не менее остаться', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e03cb21b-352d-58b0-b763-7d20683f3990', 'otherwise', 'adverb', 'B2',
  'иначе', 'if not, or in a different way', 'If that does not happen, then this will.',
  'otherwise', '{}', '{"writing","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e03cb21b-352d-58b0-b763-0003e83f3990', 'e03cb21b-352d-58b0-b763-7d20683f3990', 'Leave now, otherwise you will miss it.', 'Leave now, ___ you will miss it.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e03cb21b-352d-58b0-b763-0007d03f3990', 'e03cb21b-352d-58b0-b763-7d20683f3990', 'otherwise engaged', '___ engaged', 'занят другим', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'f628d55e-9032-5c13-a5f2-234ad36000ca', 'acknowledge', 'verb', 'C1',
  'признавать', 'to accept or admit that something is true', 'You accept publicly that something is true.',
  'acknowledge', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'f628d55e-9032-5c13-a5f2-0003e86000ca', 'f628d55e-9032-5c13-a5f2-234ad36000ca', 'She acknowledged the mistake immediately.', 'She ___ the mistake immediately.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'f628d55e-9032-5c13-a5f2-0007d06000ca', 'f628d55e-9032-5c13-a5f2-234ad36000ca', 'acknowledge receipt', '___ receipt', 'подтвердить получение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'f628d55e-9032-5c13-a5f2-000bb86000ca', 'f628d55e-9032-5c13-a5f2-234ad36000ca', 'acknowledgement', 'noun', 'признание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ab2c33e6-16c1-586b-9407-54a04d865a97', 'anticipate', 'verb', 'C1',
  'предвидеть', 'to expect something and prepare for it', 'You expect it and get ready.',
  'anticipate', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ab2c33e6-16c1-586b-9407-0003e8865a97', 'ab2c33e6-16c1-586b-9407-54a04d865a97', 'We did not anticipate this much demand.', 'We did not ___ this much demand.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ab2c33e6-16c1-586b-9407-0007d0865a97', 'ab2c33e6-16c1-586b-9407-54a04d865a97', 'anticipate a problem', '___ a problem', 'предвидеть проблему', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ab2c33e6-16c1-586b-9407-000bb8865a97', 'ab2c33e6-16c1-586b-9407-54a04d865a97', 'anticipation', 'noun', 'ожидание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'cbef83ad-3e9c-5288-9c61-f1123211a4aa', 'clarify', 'verb', 'B2',
  'уточнять', 'to make something easier to understand', 'You make something clearer.',
  'clarify', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'cbef83ad-3e9c-5288-9c61-0003e811a4aa', 'cbef83ad-3e9c-5288-9c61-f1123211a4aa', 'Could you clarify what you meant?', 'Could you ___ what you meant?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'cbef83ad-3e9c-5288-9c61-0007d011a4aa', 'cbef83ad-3e9c-5288-9c61-f1123211a4aa', 'clarify a point', '___ a point', 'уточнить момент', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'cbef83ad-3e9c-5288-9c61-000bb811a4aa', 'cbef83ad-3e9c-5288-9c61-f1123211a4aa', 'clarification', 'noun', 'уточнение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c3cf865d-b13f-54d6-836d-5493f0b7fd48', 'compromise', 'verb', 'B2',
  'идти на компромисс', 'to accept less than you wanted so an agreement is possible', 'Both sides give something up to agree.',
  'compromise', '{}', '{"relationships","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c3cf865d-b13f-54d6-836d-0003e8b7fd48', 'c3cf865d-b13f-54d6-836d-5493f0b7fd48', 'Neither side was ready to compromise.', 'Neither side was ready to ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c3cf865d-b13f-54d6-836d-0007d0b7fd48', 'c3cf865d-b13f-54d6-836d-5493f0b7fd48', 'compromise on', '___ on', 'пойти на уступки в', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'c3cf865d-b13f-54d6-836d-000bb8b7fd48', 'c3cf865d-b13f-54d6-836d-5493f0b7fd48', 'compromise', 'noun', 'компромисс', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e020293c-8d68-5c72-aa0f-fe3c20609a76', 'contribute', 'verb', 'B2',
  'вносить вклад', 'to give something towards a shared result', 'You add something to a shared result.',
  'contribute', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e020293c-8d68-5c72-aa0f-0003e8609a76', 'e020293c-8d68-5c72-aa0f-fe3c20609a76', 'Everyone contributed something useful.', 'Everyone ___ something useful.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e020293c-8d68-5c72-aa0f-0007d0609a76', 'e020293c-8d68-5c72-aa0f-fe3c20609a76', 'contribute to', '___ to', 'способствовать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e020293c-8d68-5c72-aa0f-000bb8609a76', 'e020293c-8d68-5c72-aa0f-fe3c20609a76', 'contribution', 'noun', 'вклад', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ad4dfa77-abc5-5a7b-9ab5-1a60bda545be', 'distinguish', 'verb', 'C1',
  'различать', 'to see the difference between things', 'You can see the difference between two things.',
  'distinguish', '{}', '{"study","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ad4dfa77-abc5-5a7b-9ab5-0003e8a545be', 'ad4dfa77-abc5-5a7b-9ab5-1a60bda545be', 'It is hard to distinguish the two versions.', 'It is hard to ___ the two versions.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ad4dfa77-abc5-5a7b-9ab5-0007d0a545be', 'ad4dfa77-abc5-5a7b-9ab5-1a60bda545be', 'distinguish between', '___ between', 'различать между', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ad4dfa77-abc5-5a7b-9ab5-000bb8a545be', 'ad4dfa77-abc5-5a7b-9ab5-1a60bda545be', 'distinction', 'noun', 'различие', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '91f058bc-56fb-54ad-83de-6baef97c9a8b', 'emphasise', 'verb', 'B2',
  'подчёркивать', 'to give special importance to something', 'You give something special weight when you say it.',
  'emphasise', '{"emphasize","stress"}', '{"communication","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '91f058bc-56fb-54ad-83de-0003e87c9a8b', '91f058bc-56fb-54ad-83de-6baef97c9a8b', 'He emphasised the deadline twice.', 'He ___ the deadline twice.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '91f058bc-56fb-54ad-83de-0007d07c9a8b', '91f058bc-56fb-54ad-83de-6baef97c9a8b', 'emphasise the importance', '___ the importance', 'подчеркнуть важность', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '91f058bc-56fb-54ad-83de-000bb87c9a8b', '91f058bc-56fb-54ad-83de-6baef97c9a8b', 'emphasis', 'noun', 'акцент', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e19d27aa-deb4-5ee3-aa49-ac252cf77b68', 'estimate', 'verb', 'B2',
  'оценивать', 'to guess an amount using what you know', 'You guess an amount from what you know.',
  'estimate', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e19d27aa-deb4-5ee3-aa49-0003e8f77b68', 'e19d27aa-deb4-5ee3-aa49-ac252cf77b68', 'They estimate two weeks of work.', 'They ___ two weeks of work.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e19d27aa-deb4-5ee3-aa49-0007d0f77b68', 'e19d27aa-deb4-5ee3-aa49-ac252cf77b68', 'estimate the cost', '___ the cost', 'оценить стоимость', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e19d27aa-deb4-5ee3-aa49-000bb8f77b68', 'e19d27aa-deb4-5ee3-aa49-ac252cf77b68', 'estimate', 'noun', 'оценка', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '04013101-6022-54b2-9dad-61fbf74d0b09', 'illustrate', 'verb', 'B2',
  'иллюстрировать', 'to show what something means with an example', 'You show what you mean with an example.',
  'illustrate', '{}', '{"writing","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '04013101-6022-54b2-9dad-0003e84d0b09', '04013101-6022-54b2-9dad-61fbf74d0b09', 'The case illustrates the problem well.', 'The case ___ the problem well.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '04013101-6022-54b2-9dad-0007d04d0b09', '04013101-6022-54b2-9dad-61fbf74d0b09', 'illustrate a point', '___ a point', 'проиллюстрировать мысль', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '04013101-6022-54b2-9dad-000bb84d0b09', '04013101-6022-54b2-9dad-61fbf74d0b09', 'illustration', 'noun', 'иллюстрация', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'fd93722c-493f-52d8-85f9-52e7cb31d6fe', 'overcome', 'verb', 'B2',
  'преодолевать', 'to successfully deal with a difficulty', 'You get past a difficulty for good.',
  'overcome', '{}', '{"emotions","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'fd93722c-493f-52d8-85f9-0003e831d6fe', 'fd93722c-493f-52d8-85f9-52e7cb31d6fe', 'She overcame her fear of flying.', 'She ___ her fear of flying.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'fd93722c-493f-52d8-85f9-0007d031d6fe', 'fd93722c-493f-52d8-85f9-52e7cb31d6fe', 'overcome an obstacle', '___ an obstacle', 'преодолеть препятствие', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '93da88af-d929-57ad-a760-ebffc7c953bc', 'persuade', 'verb', 'B2',
  'убеждать', 'to make someone agree by giving reasons', 'You give reasons until someone agrees.',
  'persuade', '{"convince"}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '93da88af-d929-57ad-a760-0003e8c953bc', '93da88af-d929-57ad-a760-ebffc7c953bc', 'Nobody could persuade him to wait.', 'Nobody could ___ him to wait.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '93da88af-d929-57ad-a760-0007d0c953bc', '93da88af-d929-57ad-a760-ebffc7c953bc', 'persuade someone to', '___ someone to', 'убедить кого-то', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '93da88af-d929-57ad-a760-000bb8c953bc', '93da88af-d929-57ad-a760-ebffc7c953bc', 'persuasive', 'adjective', 'убедительный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6de28e89-f086-5fb0-8cd3-038c0d175ec2', 'pursue', 'verb', 'C1',
  'преследовать цель', 'to keep trying to achieve something over time', 'You keep going after something over a long time.',
  'pursue', '{}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6de28e89-f086-5fb0-8cd3-0003e8175ec2', '6de28e89-f086-5fb0-8cd3-038c0d175ec2', 'She decided to pursue a career in law.', 'She decided to ___ a career in law.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6de28e89-f086-5fb0-8cd3-0007d0175ec2', '6de28e89-f086-5fb0-8cd3-038c0d175ec2', 'pursue a goal', '___ a goal', 'преследовать цель', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6de28e89-f086-5fb0-8cd3-000bb8175ec2', '6de28e89-f086-5fb0-8cd3-038c0d175ec2', 'pursuit', 'noun', 'стремление', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b6737989-2d71-50ae-9390-254e77917277', 'reduce', 'verb', 'B1',
  'сокращать', 'to make something smaller in size or amount', 'You make it smaller or less.',
  'reduce', '{}', '{"work","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b6737989-2d71-50ae-9390-0003e8917277', 'b6737989-2d71-50ae-9390-254e77917277', 'We reduced the price by half.', 'We ___ the price by half.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b6737989-2d71-50ae-9390-0007d0917277', 'b6737989-2d71-50ae-9390-254e77917277', 'reduce costs', '___ costs', 'сократить расходы', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'b6737989-2d71-50ae-9390-000bb8917277', 'b6737989-2d71-50ae-9390-254e77917277', 'reduction', 'noun', 'сокращение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'df171c4b-fd9c-5fd8-b0fb-72dda6c5c13d', 'reveal', 'verb', 'B2',
  'раскрывать', 'to make something known that was hidden', 'You make known something that was hidden.',
  'reveal', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'df171c4b-fd9c-5fd8-b0fb-0003e8c5c13d', 'df171c4b-fd9c-5fd8-b0fb-72dda6c5c13d', 'The report revealed several errors.', 'The report ___ several errors.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'df171c4b-fd9c-5fd8-b0fb-0007d0c5c13d', 'df171c4b-fd9c-5fd8-b0fb-72dda6c5c13d', 'reveal the truth', '___ the truth', 'раскрыть правду', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'df171c4b-fd9c-5fd8-b0fb-000bb8c5c13d', 'df171c4b-fd9c-5fd8-b0fb-72dda6c5c13d', 'revelation', 'noun', 'откровение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '12c26a97-046c-586f-99e7-4ab98d7dec08', 'seek', 'verb', 'C1',
  'искать', 'to try to find or obtain something', 'You actively try to find or get something.',
  'seek', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '12c26a97-046c-586f-99e7-0003e87dec08', '12c26a97-046c-586f-99e7-4ab98d7dec08', 'They are seeking a new supplier.', 'They are ___ a new supplier.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '12c26a97-046c-586f-99e7-0007d07dec08', '12c26a97-046c-586f-99e7-4ab98d7dec08', 'seek advice', '___ advice', 'искать совета', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '0dd6a8fe-a86f-5c4e-93cb-88e2c167d272', 'undertake', 'verb', 'C1',
  'предпринимать', 'to start doing something difficult or formal', 'You take on something difficult or formal.',
  'undertake', '{}', '{"work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '0dd6a8fe-a86f-5c4e-93cb-0003e867d272', '0dd6a8fe-a86f-5c4e-93cb-88e2c167d272', 'The team undertook a full review.', 'The team ___ a full review.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '0dd6a8fe-a86f-5c4e-93cb-0007d067d272', '0dd6a8fe-a86f-5c4e-93cb-88e2c167d272', 'undertake a project', '___ a project', 'взяться за проект', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'cb1aabc5-e6b3-5ba1-8c80-9fb8f1bd81eb', 'withdraw', 'verb', 'C1',
  'отзывать', 'to take something back or leave a place or activity', 'You take something back or step out.',
  'withdraw', '{}', '{"work","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'cb1aabc5-e6b3-5ba1-8c80-0003e8bd81eb', 'cb1aabc5-e6b3-5ba1-8c80-9fb8f1bd81eb', 'He withdrew his application.', 'He ___ his application.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'cb1aabc5-e6b3-5ba1-8c80-0007d0bd81eb', 'cb1aabc5-e6b3-5ba1-8c80-9fb8f1bd81eb', 'withdraw money', '___ money', 'снять деньги', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'cb1aabc5-e6b3-5ba1-8c80-000bb8bd81eb', 'cb1aabc5-e6b3-5ba1-8c80-9fb8f1bd81eb', 'withdrawal', 'noun', 'снятие', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'dd2f5b01-52e8-5d17-9d79-9c6b6cfb8a9f', 'adapt', 'verb', 'B2',
  'приспосабливаться', 'to change to fit a new situation', 'You change so you fit the new situation.',
  'adapt', '{}', '{"travel","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'dd2f5b01-52e8-5d17-9d79-0003e8fb8a9f', 'dd2f5b01-52e8-5d17-9d79-9c6b6cfb8a9f', 'It took me months to adapt.', 'It took me months to ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'dd2f5b01-52e8-5d17-9d79-0007d0fb8a9f', 'dd2f5b01-52e8-5d17-9d79-9c6b6cfb8a9f', 'adapt to', '___ to', 'приспособиться к', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'dd2f5b01-52e8-5d17-9d79-000bb8fb8a9f', 'dd2f5b01-52e8-5d17-9d79-9c6b6cfb8a9f', 'adaptable', 'adjective', 'легко приспосабливающийся', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e7b95da7-8dc4-533a-a5fb-a86cdeff9f9b', 'allocate', 'verb', 'C1',
  'выделять', 'to give a share of something for a purpose', 'You set aside a share for a purpose.',
  'allocate', '{}', '{"work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e7b95da7-8dc4-533a-a5fb-0003e8ff9f9b', 'e7b95da7-8dc4-533a-a5fb-a86cdeff9f9b', 'We allocated two hours for questions.', 'We ___ two hours for questions.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e7b95da7-8dc4-533a-a5fb-0007d0ff9f9b', 'e7b95da7-8dc4-533a-a5fb-a86cdeff9f9b', 'allocate resources', '___ resources', 'распределять ресурсы', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e7b95da7-8dc4-533a-a5fb-000bb8ff9f9b', 'e7b95da7-8dc4-533a-a5fb-a86cdeff9f9b', 'allocation', 'noun', 'распределение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '152b4be8-e75e-5f73-8006-1a64ac1ff533', 'compensate', 'verb', 'C1',
  'компенсировать', 'to make up for something bad or missing', 'You make up for something missing.',
  'compensate', '{}', '{"work","abstract"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '152b4be8-e75e-5f73-8006-0003e81ff533', '152b4be8-e75e-5f73-8006-1a64ac1ff533', 'Extra sleep does not compensate for stress.', 'Extra sleep does not ___ for stress.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '152b4be8-e75e-5f73-8006-0007d01ff533', '152b4be8-e75e-5f73-8006-1a64ac1ff533', 'compensate for', '___ for', 'компенсировать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '152b4be8-e75e-5f73-8006-000bb81ff533', '152b4be8-e75e-5f73-8006-1a64ac1ff533', 'compensation', 'noun', 'компенсация', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '8954ecb1-a8df-5b3b-b888-809f4312f50c', 'book', 'verb', 'A2',
  'бронировать', 'to arrange to have something at a future time', 'You arrange something in advance.',
  'book', '{"reserve"}', '{"travel","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '8954ecb1-a8df-5b3b-b888-0003e812f50c', '8954ecb1-a8df-5b3b-b888-809f4312f50c', 'I booked the tickets last night.', 'I ___ the tickets last night.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '8954ecb1-a8df-5b3b-b888-0007d012f50c', '8954ecb1-a8df-5b3b-b888-809f4312f50c', 'book a table', '___ a table', 'забронировать столик', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '8954ecb1-a8df-5b3b-b888-000bb812f50c', '8954ecb1-a8df-5b3b-b888-809f4312f50c', 'booking', 'noun', 'бронирование', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd0793f4d-eb93-532d-8841-783b40bbf174', 'cancel', 'verb', 'A2',
  'отменять', 'to say that something planned will not happen', 'You call off something that was planned.',
  'cancel', '{}', '{"travel","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd0793f4d-eb93-532d-8841-0003e8bbf174', 'd0793f4d-eb93-532d-8841-783b40bbf174', 'They cancelled the flight without warning.', 'They ___ the flight without warning.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd0793f4d-eb93-532d-8841-0007d0bbf174', 'd0793f4d-eb93-532d-8841-783b40bbf174', 'cancel a booking', '___ a booking', 'отменить бронь', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd0793f4d-eb93-532d-8841-000bb8bbf174', 'd0793f4d-eb93-532d-8841-783b40bbf174', 'cancellation', 'noun', 'отмена', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd7f54551-b076-5d5b-87c2-4f752a65d44b', 'recommend', 'verb', 'B1',
  'рекомендовать', 'to say that something is good and worth trying', 'You tell someone something is worth trying.',
  'recommend', '{}', '{"communication","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd7f54551-b076-5d5b-87c2-0003e865d44b', 'd7f54551-b076-5d5b-87c2-4f752a65d44b', 'Can you recommend a place nearby?', 'Can you ___ a place nearby?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd7f54551-b076-5d5b-87c2-0007d065d44b', 'd7f54551-b076-5d5b-87c2-4f752a65d44b', 'highly recommend', 'highly ___', 'настоятельно рекомендовать', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd7f54551-b076-5d5b-87c2-000bb865d44b', 'd7f54551-b076-5d5b-87c2-4f752a65d44b', 'recommendation', 'noun', 'рекомендация', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a4bb4c3a-3b72-5177-9ba6-a716751cf91e', 'share', 'verb', 'A2',
  'делиться', 'to give part of something to others', 'You give part of it to someone else.',
  'share', '{}', '{"relationships","technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a4bb4c3a-3b72-5177-9ba6-0003e81cf91e', 'a4bb4c3a-3b72-5177-9ba6-a716751cf91e', 'She shared the file with the team.', 'She ___ the file with the team.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a4bb4c3a-3b72-5177-9ba6-0007d01cf91e', 'a4bb4c3a-3b72-5177-9ba6-a716751cf91e', 'share information', '___ information', 'делиться информацией', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'db36d14b-3451-5656-ba5a-9c73f2041c0b', 'upload', 'verb', 'B1',
  'загружать', 'to move a file to a server or website', 'You move a file up to a server.',
  'upload', '{}', '{"technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'db36d14b-3451-5656-ba5a-0003e8041c0b', 'db36d14b-3451-5656-ba5a-9c73f2041c0b', 'Upload the document before you leave.', '___ the document before you leave.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'db36d14b-3451-5656-ba5a-0007d0041c0b', 'db36d14b-3451-5656-ba5a-9c73f2041c0b', 'upload a file', '___ a file', 'загрузить файл', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7b967c40-eb61-5f23-a914-9904b3aad04d', 'download', 'verb', 'A2',
  'скачивать', 'to copy a file from the internet to your device', 'You copy a file from the internet.',
  'download', '{}', '{"technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7b967c40-eb61-5f23-a914-0003e8aad04d', '7b967c40-eb61-5f23-a914-9904b3aad04d', 'The app downloads updates overnight.', 'The app ___ updates overnight.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7b967c40-eb61-5f23-a914-0007d0aad04d', '7b967c40-eb61-5f23-a914-9904b3aad04d', 'download an app', '___ an app', 'скачать приложение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'da5ae077-7a1b-5265-a695-78b41ccb2154', 'install', 'verb', 'B1',
  'устанавливать', 'to put software or equipment in place so it works', 'You put software or equipment in place.',
  'install', '{}', '{"technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'da5ae077-7a1b-5265-a695-0003e8cb2154', 'da5ae077-7a1b-5265-a695-78b41ccb2154', 'I need to install the update.', 'I need to ___ the update.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'da5ae077-7a1b-5265-a695-0007d0cb2154', 'da5ae077-7a1b-5265-a695-78b41ccb2154', 'install software', '___ software', 'установить программу', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'da5ae077-7a1b-5265-a695-000bb8cb2154', 'da5ae077-7a1b-5265-a695-78b41ccb2154', 'installation', 'noun', 'установка', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '197384fa-f530-5b0f-badf-eed29b87a14a', 'crash', 'verb', 'B1',
  'зависать', 'to stop working suddenly', 'A program or device stops working suddenly.',
  'crash', '{}', '{"technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '197384fa-f530-5b0f-badf-0003e887a14a', '197384fa-f530-5b0f-badf-eed29b87a14a', 'The app crashes every time I open it.', 'The app ___ every time I open it.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '197384fa-f530-5b0f-badf-0007d087a14a', '197384fa-f530-5b0f-badf-eed29b87a14a', 'crash unexpectedly', '___ unexpectedly', 'неожиданно зависнуть', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '92f6be13-9cb5-5340-ab24-3d448202b3ac', 'sign up', 'phrasal_verb', 'B1',
  'зарегистрироваться', 'to put your name on a list to join something', 'You put your name down to join something.',
  'sign up', '{"register"}', '{"technology","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '92f6be13-9cb5-5340-ab24-0003e802b3ac', '92f6be13-9cb5-5340-ab24-3d448202b3ac', 'Thousands signed up in the first week.', 'Thousands ___ in the first week.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '92f6be13-9cb5-5340-ab24-0007d002b3ac', '92f6be13-9cb5-5340-ab24-3d448202b3ac', 'sign up for', '___ for', 'записаться на', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4303f60b-c323-5406-b449-52bd6d809bd8', 'log in', 'phrasal_verb', 'A2',
  'входить в систему', 'to enter a username and password to access a system', 'You enter your details to get into a system.',
  'log in', '{"sign in"}', '{"technology"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4303f60b-c323-5406-b449-0003e8809bd8', '4303f60b-c323-5406-b449-52bd6d809bd8', 'I cannot log in on my phone.', 'I cannot ___ on my phone.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4303f60b-c323-5406-b449-0007d0809bd8', '4303f60b-c323-5406-b449-52bd6d809bd8', 'log in to', '___ to', 'войти в', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'dba00c02-d84e-50ca-a711-d7aaf7f7cf82', 'commute', 'noun', 'B2',
  'поездка на работу', 'the regular journey between home and work', 'The journey you make to work and back.',
  'commute', '{}', '{"travel","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'dba00c02-d84e-50ca-a711-0003e8f7cf82', 'dba00c02-d84e-50ca-a711-d7aaf7f7cf82', 'My commute takes an hour each way.', 'My ___ takes an hour each way.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'dba00c02-d84e-50ca-a711-0007d0f7cf82', 'dba00c02-d84e-50ca-a711-d7aaf7f7cf82', 'daily commute', 'daily ___', 'ежедневная поездка', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'dba00c02-d84e-50ca-a711-000bb8f7cf82', 'dba00c02-d84e-50ca-a711-d7aaf7f7cf82', 'commute', 'verb', 'ездить на работу', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c06ed1a6-68e9-560d-9114-e8c226fbe620', 'delay', 'noun', 'B1',
  'задержка', 'the time you wait when something is late', 'The waiting when something is late.',
  'delay', '{}', '{"travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c06ed1a6-68e9-560d-9114-0003e8fbe620', 'c06ed1a6-68e9-560d-9114-e8c226fbe620', 'There was an hour delay at the border.', 'There was an hour ___ at the border.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c06ed1a6-68e9-560d-9114-0007d0fbe620', 'c06ed1a6-68e9-560d-9114-e8c226fbe620', 'long delay', 'long ___', 'долгая задержка', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1a570832-4dec-5599-a19d-c3b158f92a9c', 'luggage', 'noun', 'A2',
  'багаж', 'the bags you take when you travel', 'The bags you take when you travel.',
  'luggage', '{"baggage"}', '{"travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1a570832-4dec-5599-a19d-0003e8f92a9c', '1a570832-4dec-5599-a19d-c3b158f92a9c', 'My luggage did not arrive.', 'My ___ did not arrive.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1a570832-4dec-5599-a19d-0007d0f92a9c', '1a570832-4dec-5599-a19d-c3b158f92a9c', 'hand luggage', 'hand ___', 'ручная кладь', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '14718e4d-3b92-5168-ad08-4b7cb4571096', 'accommodation', 'noun', 'B1',
  'жильё', 'a place to stay', 'A place to stay when you travel.',
  'accommodation', '{}', '{"travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '14718e4d-3b92-5168-ad08-0003e8571096', '14718e4d-3b92-5168-ad08-4b7cb4571096', 'Accommodation is cheaper out of season.', '___ is cheaper out of season.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '14718e4d-3b92-5168-ad08-0007d0571096', '14718e4d-3b92-5168-ad08-4b7cb4571096', 'book accommodation', 'book ___', 'забронировать жильё', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6e8a7fbf-c6d0-5784-874d-0cde82430279', 'crowded', 'adjective', 'B1',
  'переполненный', 'full of people', 'Full of people with no space.',
  'crowded', '{}', '{"travel","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6e8a7fbf-c6d0-5784-874d-0003e8430279', '6e8a7fbf-c6d0-5784-874d-0cde82430279', 'The station was crowded at seven.', 'The station was ___ at seven.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6e8a7fbf-c6d0-5784-874d-0007d0430279', '6e8a7fbf-c6d0-5784-874d-0cde82430279', 'crowded train', '___ train', 'переполненный поезд', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6e8a7fbf-c6d0-5784-874d-000bb8430279', '6e8a7fbf-c6d0-5784-874d-0cde82430279', 'crowd', 'noun', 'толпа', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ecfc30cd-eaa2-5917-8ca3-25e42ab4b8df', 'convenient', 'adjective', 'B1',
  'удобный', 'easy to use or fitting your plans well', 'It fits your plans without effort.',
  'convenient', '{}', '{"travel","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ecfc30cd-eaa2-5917-8ca3-0003e8b4b8df', 'ecfc30cd-eaa2-5917-8ca3-25e42ab4b8df', 'Would Thursday be convenient?', 'Would Thursday be ___?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ecfc30cd-eaa2-5917-8ca3-0007d0b4b8df', 'ecfc30cd-eaa2-5917-8ca3-25e42ab4b8df', 'convenient time', '___ time', 'удобное время', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ecfc30cd-eaa2-5917-8ca3-000bb8b4b8df', 'ecfc30cd-eaa2-5917-8ca3-25e42ab4b8df', 'convenience', 'noun', 'удобство', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ecfc30cd-eaa2-5917-8ca3-000bb9b4b8df', 'ecfc30cd-eaa2-5917-8ca3-25e42ab4b8df', 'inconvenient', 'adjective', 'неудобный', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '21e7d0bc-67ae-5292-930b-1acfed21e205', 'straightforward', 'adjective', 'B2',
  'простой', 'easy to understand or do', 'Simple, with nothing tricky in it.',
  'straightforward', '{"simple"}', '{"work","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '21e7d0bc-67ae-5292-930b-0003e821e205', '21e7d0bc-67ae-5292-930b-1acfed21e205', 'The process is fairly straightforward.', 'The process is fairly ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '21e7d0bc-67ae-5292-930b-0007d021e205', '21e7d0bc-67ae-5292-930b-1acfed21e205', 'straightforward answer', '___ answer', 'прямой ответ', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd8e98f76-358a-51f5-b965-9c286074cdf9', 'mind', 'verb', 'B1',
  'возражать', 'to be annoyed or bothered by something', 'You are bothered by something.',
  'mind', '{}', '{"communication","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd8e98f76-358a-51f5-b965-0003e874cdf9', 'd8e98f76-358a-51f5-b965-9c286074cdf9', 'Would you mind closing the window?', 'Would you ___ closing the window?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd8e98f76-358a-51f5-b965-0007d074cdf9', 'd8e98f76-358a-51f5-b965-9c286074cdf9', 'not mind', 'not ___', 'не возражать', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'a0e7fbc4-f84d-5b82-b1a3-d3a03fac3bc8', 'owe', 'verb', 'B1',
  'быть должным', 'to have to pay or give something back to someone', 'You still have to pay someone back.',
  'owe', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'a0e7fbc4-f84d-5b82-b1a3-0003e8ac3bc8', 'a0e7fbc4-f84d-5b82-b1a3-d3a03fac3bc8', 'I owe you an explanation.', 'I ___ you an explanation.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'a0e7fbc4-f84d-5b82-b1a3-0007d0ac3bc8', 'a0e7fbc4-f84d-5b82-b1a3-d3a03fac3bc8', 'owe money', '___ money', 'быть должным денег', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1003cbf8-c1aa-5536-b997-4f0c9c3c9c82', 'lend', 'verb', 'B1',
  'одалживать', 'to give something to someone for a short time', 'You give something for a short time.',
  'lend', '{}', '{"everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1003cbf8-c1aa-5536-b997-0003e83c9c82', '1003cbf8-c1aa-5536-b997-4f0c9c3c9c82', 'He lent me his car for the weekend.', 'He ___ me his car for the weekend.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1003cbf8-c1aa-5536-b997-0007d03c9c82', '1003cbf8-c1aa-5536-b997-4f0c9c3c9c82', 'lend a hand', '___ a hand', 'помочь', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'ea7d4836-b2e3-543a-a772-852622238ac7', 'earn', 'verb', 'B1',
  'зарабатывать', 'to get money for work you do', 'You get money for the work you do.',
  'earn', '{}', '{"work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'ea7d4836-b2e3-543a-a772-0003e8238ac7', 'ea7d4836-b2e3-543a-a772-852622238ac7', 'She earns more than she expected.', 'She ___ more than she expected.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'ea7d4836-b2e3-543a-a772-0007d0238ac7', 'ea7d4836-b2e3-543a-a772-852622238ac7', 'earn a living', '___ a living', 'зарабатывать на жизнь', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'ea7d4836-b2e3-543a-a772-000bb8238ac7', 'ea7d4836-b2e3-543a-a772-852622238ac7', 'earnings', 'noun', 'заработок', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '4d8f49c5-476d-5eef-8bee-e9c9e8d78693', 'spend', 'verb', 'A2',
  'тратить', 'to use money or time on something', 'You use up money or time.',
  'spend', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '4d8f49c5-476d-5eef-8bee-0003e8d78693', '4d8f49c5-476d-5eef-8bee-e9c9e8d78693', 'We spent the whole morning on it.', 'We ___ the whole morning on it.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '4d8f49c5-476d-5eef-8bee-0007d0d78693', '4d8f49c5-476d-5eef-8bee-e9c9e8d78693', 'spend money', '___ money', 'тратить деньги', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '4d8f49c5-476d-5eef-8bee-000bb8d78693', '4d8f49c5-476d-5eef-8bee-e9c9e8d78693', 'spending', 'noun', 'расходы', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'b9e45ed4-83f8-57ce-b233-0b4ea1528360', 'waste', 'verb', 'B1',
  'тратить впустую', 'to use something badly so it brings no benefit', 'You use something up for nothing.',
  'waste', '{}', '{"everyday","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'b9e45ed4-83f8-57ce-b233-0003e8528360', 'b9e45ed4-83f8-57ce-b233-0b4ea1528360', 'Do not waste your energy on this.', 'Do not ___ your energy on this.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'b9e45ed4-83f8-57ce-b233-0007d0528360', 'b9e45ed4-83f8-57ce-b233-0b4ea1528360', 'waste time', '___ time', 'тратить время впустую', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'b9e45ed4-83f8-57ce-b233-000bb8528360', 'b9e45ed4-83f8-57ce-b233-0b4ea1528360', 'wasteful', 'adjective', 'расточительный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '0cdf0492-f4ca-517d-b2c8-cedfd69e6fd3', 'save', 'verb', 'A2',
  'экономить', 'to keep money or time for later instead of using it', 'You keep money or time for later.',
  'save', '{}', '{"everyday","travel"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '0cdf0492-f4ca-517d-b2c8-0003e89e6fd3', '0cdf0492-f4ca-517d-b2c8-cedfd69e6fd3', 'Booking early saves a lot of money.', 'Booking early ___ a lot of money.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '0cdf0492-f4ca-517d-b2c8-0007d09e6fd3', '0cdf0492-f4ca-517d-b2c8-cedfd69e6fd3', 'save time', '___ time', 'экономить время', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '0cdf0492-f4ca-517d-b2c8-000bb89e6fd3', '0cdf0492-f4ca-517d-b2c8-cedfd69e6fd3', 'savings', 'noun', 'сбережения', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '86a392f4-8929-5f8f-881d-5fe976ddf9e7', 'doubt', 'verb', 'B2',
  'сомневаться', 'to think that something is probably not true', 'You think it is probably not true.',
  'doubt', '{}', '{"opinions","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '86a392f4-8929-5f8f-881d-0003e8ddf9e7', '86a392f4-8929-5f8f-881d-5fe976ddf9e7', 'I doubt he will come.', 'I ___ he will come.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '86a392f4-8929-5f8f-881d-0007d0ddf9e7', '86a392f4-8929-5f8f-881d-5fe976ddf9e7', 'doubt whether', '___ whether', 'сомневаться', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '86a392f4-8929-5f8f-881d-000bb8ddf9e7', '86a392f4-8929-5f8f-881d-5fe976ddf9e7', 'doubtful', 'adjective', 'сомнительный', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '16d6d652-9cfb-569b-934d-33ca5632efc4', 'insist', 'verb', 'B2',
  'настаивать', 'to say something firmly and refuse to change', 'You say it firmly and will not back down.',
  'insist', '{}', '{"communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '16d6d652-9cfb-569b-934d-0003e832efc4', '16d6d652-9cfb-569b-934d-33ca5632efc4', 'He insisted on paying.', 'He ___ on paying.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '16d6d652-9cfb-569b-934d-0007d032efc4', '16d6d652-9cfb-569b-934d-33ca5632efc4', 'insist on', '___ on', 'настаивать на', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '16d6d652-9cfb-569b-934d-000bb832efc4', '16d6d652-9cfb-569b-934d-33ca5632efc4', 'insistence', 'noun', 'настойчивость', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c540f793-8ef0-5dbc-b798-efe536b87099', 'object', 'verb', 'B2',
  'возражать', 'to say that you disagree with something', 'You say clearly that you disagree.',
  'object', '{}', '{"communication","work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c540f793-8ef0-5dbc-b798-0003e8b87099', 'c540f793-8ef0-5dbc-b798-efe536b87099', 'Nobody objected to the change.', 'Nobody ___ to the change.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c540f793-8ef0-5dbc-b798-0007d0b87099', 'c540f793-8ef0-5dbc-b798-efe536b87099', 'object to', '___ to', 'возражать против', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'c540f793-8ef0-5dbc-b798-000bb8b87099', 'c540f793-8ef0-5dbc-b798-efe536b87099', 'objection', 'noun', 'возражение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '33175b65-fb2b-5fa5-b351-01e615d68cc9', 'apologise', 'verb', 'B1',
  'извиняться', 'to say you are sorry for something you did', 'You say sorry for something you did.',
  'apologise', '{"apologize"}', '{"communication","relationships"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '33175b65-fb2b-5fa5-b351-0003e8d68cc9', '33175b65-fb2b-5fa5-b351-01e615d68cc9', 'He apologised for the delay.', 'He ___ for the delay.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '33175b65-fb2b-5fa5-b351-0007d0d68cc9', '33175b65-fb2b-5fa5-b351-01e615d68cc9', 'apologise for', '___ for', 'извиниться за', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '33175b65-fb2b-5fa5-b351-000bb8d68cc9', '33175b65-fb2b-5fa5-b351-01e615d68cc9', 'apology', 'noun', 'извинение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e1c8724a-e3cd-5dd1-aa2d-99c3fd8f38e1', 'appreciate', 'verb', 'B2',
  'ценить', 'to recognise the value of something, or be grateful for it', 'You recognise the value of something and say so.',
  'appreciate', '{}', '{"relationships","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e1c8724a-e3cd-5dd1-aa2d-0003e88f38e1', 'e1c8724a-e3cd-5dd1-aa2d-99c3fd8f38e1', 'I really appreciate your help.', 'I really ___ your help.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e1c8724a-e3cd-5dd1-aa2d-0007d08f38e1', 'e1c8724a-e3cd-5dd1-aa2d-99c3fd8f38e1', 'appreciate the effort', '___ the effort', 'ценить усилия', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e1c8724a-e3cd-5dd1-aa2d-000bb88f38e1', 'e1c8724a-e3cd-5dd1-aa2d-99c3fd8f38e1', 'appreciation', 'noun', 'признательность', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '6e15a21e-9c57-5e97-aa04-0a308e16af63', 'confuse', 'verb', 'B1',
  'путать', 'to mix things up or make something unclear', 'You mix two things up or make something unclear.',
  'confuse', '{}', '{"study","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '6e15a21e-9c57-5e97-aa04-0003e816af63', '6e15a21e-9c57-5e97-aa04-0a308e16af63', 'I always confuse those two words.', 'I always ___ those two words.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '6e15a21e-9c57-5e97-aa04-0007d016af63', '6e15a21e-9c57-5e97-aa04-0a308e16af63', 'confuse with', '___ with', 'путать с', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6e15a21e-9c57-5e97-aa04-000bb816af63', '6e15a21e-9c57-5e97-aa04-0a308e16af63', 'confusing', 'adjective', 'сбивающий с толку', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '6e15a21e-9c57-5e97-aa04-000bb916af63', '6e15a21e-9c57-5e97-aa04-0a308e16af63', 'confusion', 'noun', 'путаница', 1
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'd0b82dcb-eecc-5419-8044-ae8ba5816541', 'describe', 'verb', 'A2',
  'описывать', 'to say what someone or something is like', 'You say what something is like.',
  'describe', '{}', '{"communication","writing"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'd0b82dcb-eecc-5419-8044-0003e8816541', 'd0b82dcb-eecc-5419-8044-ae8ba5816541', 'Describe it in your own words.', '___ it in your own words.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'd0b82dcb-eecc-5419-8044-0007d0816541', 'd0b82dcb-eecc-5419-8044-ae8ba5816541', 'describe in detail', '___ in detail', 'описать подробно', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'd0b82dcb-eecc-5419-8044-000bb8816541', 'd0b82dcb-eecc-5419-8044-ae8ba5816541', 'description', 'noun', 'описание', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'bad12c8b-ea4e-57eb-b2fa-37b4f3281d2f', 'explain', 'verb', 'A2',
  'объяснять', 'to make something clear by giving details', 'You make something clear with details.',
  'explain', '{}', '{"communication","study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'bad12c8b-ea4e-57eb-b2fa-0003e8281d2f', 'bad12c8b-ea4e-57eb-b2fa-37b4f3281d2f', 'Let me explain what happened.', 'Let me ___ what happened.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'bad12c8b-ea4e-57eb-b2fa-0007d0281d2f', 'bad12c8b-ea4e-57eb-b2fa-37b4f3281d2f', 'explain clearly', '___ clearly', 'объяснить ясно', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'bad12c8b-ea4e-57eb-b2fa-000bb8281d2f', 'bad12c8b-ea4e-57eb-b2fa-37b4f3281d2f', 'explanation', 'noun', 'объяснение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '68fde7bc-317e-5ca7-b1c5-3883824ae221', 'express', 'verb', 'B2',
  'выражать', 'to put a feeling or an idea into words', 'You put a feeling into words.',
  'express', '{}', '{"communication","emotions"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '68fde7bc-317e-5ca7-b1c5-0003e84ae221', '68fde7bc-317e-5ca7-b1c5-3883824ae221', 'She struggled to express what she felt.', 'She struggled to ___ what she felt.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '68fde7bc-317e-5ca7-b1c5-0007d04ae221', '68fde7bc-317e-5ca7-b1c5-3883824ae221', 'express an opinion', '___ an opinion', 'выразить мнение', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '68fde7bc-317e-5ca7-b1c5-000bb84ae221', '68fde7bc-317e-5ca7-b1c5-3883824ae221', 'expression', 'noun', 'выражение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '7aab3820-97e9-5019-bdc1-5ea778a86cf1', 'translate', 'verb', 'B1',
  'переводить', 'to change words from one language into another', 'You change words into another language.',
  'translate', '{}', '{"study","communication"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '7aab3820-97e9-5019-bdc1-0003e8a86cf1', '7aab3820-97e9-5019-bdc1-5ea778a86cf1', 'Some jokes do not translate.', 'Some jokes do not ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '7aab3820-97e9-5019-bdc1-0007d0a86cf1', '7aab3820-97e9-5019-bdc1-5ea778a86cf1', 'translate into', '___ into', 'перевести на', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '7aab3820-97e9-5019-bdc1-000bb8a86cf1', '7aab3820-97e9-5019-bdc1-5ea778a86cf1', 'translation', 'noun', 'перевод', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'c6a8d20d-a419-5278-914b-3cac1d60bd6e', 'memorise', 'verb', 'B2',
  'заучивать', 'to learn something so you can remember it exactly', 'You learn it so you can repeat it exactly.',
  'memorise', '{"memorize"}', '{"study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'c6a8d20d-a419-5278-914b-0003e860bd6e', 'c6a8d20d-a419-5278-914b-3cac1d60bd6e', 'Memorising lists rarely helps.', '___ lists rarely helps.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'c6a8d20d-a419-5278-914b-0007d060bd6e', 'c6a8d20d-a419-5278-914b-3cac1d60bd6e', 'memorise a text', '___ a text', 'заучить текст', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'c6a8d20d-a419-5278-914b-000bb860bd6e', 'c6a8d20d-a419-5278-914b-3cac1d60bd6e', 'memory', 'noun', 'память', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  'e65681b6-ff53-542b-b6ee-0b7138d16338', 'revise', 'verb', 'B2',
  'повторять материал', 'to study something again before a test', 'You go over material again before a test.',
  'revise', '{}', '{"study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  'e65681b6-ff53-542b-b6ee-0003e8d16338', 'e65681b6-ff53-542b-b6ee-0b7138d16338', 'I need to revise before Monday.', 'I need to ___ before Monday.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  'e65681b6-ff53-542b-b6ee-0007d0d16338', 'e65681b6-ff53-542b-b6ee-0b7138d16338', 'revise for an exam', '___ for an exam', 'готовиться к экзамену', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  'e65681b6-ff53-542b-b6ee-000bb8d16338', 'e65681b6-ff53-542b-b6ee-0b7138d16338', 'revision', 'noun', 'повторение', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '82d000c5-2a95-57b2-aa34-9e41e2547f87', 'graduate', 'verb', 'B1',
  'окончить учёбу', 'to finish a university course successfully', 'You finish your university course.',
  'graduate', '{}', '{"study"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '82d000c5-2a95-57b2-aa34-0003e8547f87', '82d000c5-2a95-57b2-aa34-9e41e2547f87', 'She graduated two years ago.', 'She ___ two years ago.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '82d000c5-2a95-57b2-aa34-0007d0547f87', '82d000c5-2a95-57b2-aa34-9e41e2547f87', 'graduate from', '___ from', 'окончить', 0
) on conflict (id) do nothing;
insert into public.word_family_members (id, word_id, form, part_of_speech, gloss, position) values (
  '82d000c5-2a95-57b2-aa34-000bb8547f87', '82d000c5-2a95-57b2-aa34-9e41e2547f87', 'graduation', 'noun', 'выпуск', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '54251f31-4f0e-5fb9-9e7d-2947944b9245', 'attend to', 'phrasal_verb', 'C1',
  'заниматься', 'to deal with something that needs your attention', 'You deal with something that needs you now.',
  'attend to', '{}', '{"work"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '54251f31-4f0e-5fb9-9e7d-0003e84b9245', '54251f31-4f0e-5fb9-9e7d-2947944b9245', 'I have a few things to attend to.', 'I have a few things to ___.', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '54251f31-4f0e-5fb9-9e7d-0007d04b9245', '54251f31-4f0e-5fb9-9e7d-2947944b9245', 'attend to a matter', '___ a matter', 'заняться вопросом', 0
) on conflict (id) do nothing;

insert into public.words (id, lemma, part_of_speech, cefr, russian, definition, context_hint, primary_answer, accepted_answers, tags, created_by)
values (
  '1593c288-9ae6-5ac3-be97-918a849c0fa9', 'look after', 'phrasal_verb', 'B1',
  'заботиться о', 'to take care of someone or something', 'You take care of someone or something.',
  'look after', '{"take care of"}', '{"relationships","everyday"}', null
) on conflict (id) do nothing;
insert into public.word_examples (id, word_id, sentence, cloze_sentence, position) values (
  '1593c288-9ae6-5ac3-be97-0003e89c0fa9', '1593c288-9ae6-5ac3-be97-918a849c0fa9', 'Who is looking after the dog?', 'Who is ___ the dog?', 0
) on conflict (id) do nothing;
insert into public.word_collocations (id, word_id, collocation, pattern, meaning_ru, position) values (
  '1593c288-9ae6-5ac3-be97-0007d09c0fa9', '1593c288-9ae6-5ac3-be97-918a849c0fa9', 'look after children', '___ children', 'присматривать за детьми', 0
) on conflict (id) do nothing;

