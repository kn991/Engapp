# Working on Verba

Rules for anyone, human or agent, changing this codebase.

## What the product is

Verba trains **productive recall speed**. The learner already recognises the
words; the problem is that the word takes four seconds to arrive when they are
speaking. Every design decision follows from that:

- The direction of practice is **meaning → English**, not English → Russian.
- A correct answer is not automatically a success. Nine seconds is a *fragile*
  recall and is scheduled as such.
- `latency_ms` is the product's core signal. It is stored raw on every attempt
  and drives mastery, scheduling and every number on the progress screen.

If a change makes the app work like a flashcard deck, it is the wrong change.

## Architecture

```
src/
  domain/learning/     Pure, framework-free learning engine. No React, no
                       Supabase, no window. Everything here is unit tested.
  server/
    queries/           Read paths for Server Components ('server-only').
    actions/           Server Actions: the only place that mutates data.
    mappers.ts         Database rows <-> domain types.
  lib/
    supabase/          Browser, server and proxy clients plus auth helpers.
    offline/           IndexedDB outbox for review events.
    validation.ts      Zod schemas for every action input.
  components/          UI. Server Components by default, 'use client' only
                       where interaction requires it.
  config/app.ts        Product name and branding, in one file.
supabase/
  migrations/          The whole schema, in order. Never edit an applied one.
  tests/               pgTAP row level security tests.
data/vocabulary.txt    The curated word list, one entry per line.
```

### Rules that matter

1. **Domain logic goes in `src/domain/learning`.** It must stay pure and
   deterministic: same inputs, same outputs, no clock or randomness that is not
   passed in. That is what makes the client's instant feedback and the server's
   authoritative record agree exactly.
2. **Identity comes from the session, never from the request.** Server Actions
   call `requireUser()`; no action accepts a user id. Row level security is the
   real boundary, and it is tested in `supabase/tests/rls.test.sql`.
3. **Aggregates are recomputed, not incremented.** `daily_stats` and
   `user_progress` are derived from `review_events` by `refresh_day_stats` and
   `refresh_user_totals`, so a retried batch can never inflate a learner's
   numbers. Keep it that way.
4. **Every review write is idempotent.** `review_events` is unique on
   `(user_id, client_event_id)`. The client generates the id before sending.
5. **Tunable numbers live in `src/domain/learning/config.ts`.** Latency
   thresholds, mastery deltas, interval ladder, session mix, XP. Do not
   scatter magic numbers through the UI.
6. **No required AI API.** The product must work with only a Supabase project.
   Anything added later must degrade to the current behaviour without a key.
7. **No fake affordances.** If a control is on screen it must work. Buttons
   that depend on a browser capability (microphone, speech, install prompt) are
   rendered only after the capability is detected.

## Conventions

- TypeScript strict, `noUncheckedIndexedAccess` on. `any` is a lint error.
- Server Components by default. Add `'use client'` only for interaction.
- Never call `setState` from an effect: the React Compiler lint rules are
  enabled and will reject it. Adjust state during render or use
  `useSyncExternalStore` (see `src/lib/use-client-value.ts`).
- Styling is Tailwind v4 with CSS variables from `src/app/globals.css`. Use the
  tokens (`var(--accent)`, `var(--surface)`, …), not raw hex.
- Touch targets are at least 44px. Colour alone never carries meaning.
- UI copy is short, plain English. No "unlock your potential", no emoji as
  interface, no invented neuroscience.

## Changing the database

1. Add a new file in `supabase/migrations/`. Never edit one that has shipped.
2. Enable RLS on any new user table and add policies; grant the minimum.
3. Update `src/types/database.ts`, or regenerate it with `pnpm db:types`
   against a running local stack.
4. Add or extend the pgTAP tests, then `supabase test db`.

## Changing the vocabulary

Edit `data/vocabulary.txt`, then `pnpm db:generate-seed`. That rewrites
`supabase/migrations/20260101000600_seed_vocabulary.sql` deterministically:
word ids are derived from the lemma, so regenerating is safe and re-running the
migrations changes nothing.

## Before you open a pull request

```
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If the change touches the schema or a policy, also run `supabase test db`. If
it touches a screen, run `pnpm screenshots` and look at the result at 390px.
