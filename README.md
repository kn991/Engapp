# Verba

**Know it. Say it. In time.**

Verba is a mobile-first web app that turns the English you *recognise* into
English you can *produce*. It measures how many milliseconds a word takes to
surface and schedules practice on that number.

---

## Project overview

Most learners past A2 have a large passive vocabulary and a small active one.
They understand `postpone` instantly when reading it, but in conversation they
say "make it later" because `postpone` takes four seconds to arrive and the
sentence has already moved on.

Verba trains that gap. Every session runs meaning → English, times the
retrieval, and treats a nine-second correct answer as what it is: not yet
usable.

## Core learning idea

Four things separate this from a flashcard app.

**Recall latency is the metric.** Every attempt stores `latency_ms` raw.
Answers are graded into bands, and the bands drive everything downstream:

| Band     | Time          | What it means                          |
| -------- | ------------- | -------------------------------------- |
| Instant  | under 2.5 s   | Usable in speech                       |
| Good     | 2.5 – 5 s     | Usable in writing                      |
| Slow     | 5 – 10 s      | Known, not available                   |
| Fragile  | over 10 s     | Barely there                           |
| Missed   | wrong, or a letter hint was taken | Not retrieved   |

**Scaffolding is removed as a word gets faster.** The exercise ladder walks a
word from a Russian cue, through an English situation and an English
definition, to a gap in a sentence and a collocation. Russian disappears as the
word becomes available.

**Active status has to be earned.** A word reaches Active only after several
fast, hint-free recalls **on separate days**. One lucky answer never counts.

**Scheduling follows speed, not just correctness.** A correct-but-slow answer
comes back tomorrow; an instant one jumps two rungs up the interval ladder.

## Tech stack

| Layer      | Choice                            | Why                                                                    |
| ---------- | --------------------------------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)| Server Components keep the client bundle small; Server Actions keep mutations on the server |
| Language   | TypeScript 6, strict              | `noUncheckedIndexedAccess` on, `any` is a lint error                    |
| UI         | Tailwind CSS v4 + CSS variables   | One token set, light and dark, no component-library look               |
| Backend    | Supabase (Postgres + Auth)        | Row level security means the database itself enforces access           |
| Validation | Zod                               | Every Server Action input is parsed before it is trusted               |
| Forms      | React Hook Form                   | Used where a form has real validation state                            |
| Tests      | Vitest, Testing Library, Playwright, pgTAP | Pure domain logic, components, full journeys, and the security policies |
| Package    | pnpm                              |                                                                         |

There are **no icon or animation libraries and no AI APIs**. Icons are a small
hand-written SVG set; charts are inline SVG; the whole product works with only
a Supabase project.

## Architecture

```
src/
  domain/learning/       The learning engine. Pure functions, no framework.
    config.ts            Every tunable number lives here.
    latency.ts           Timing to recall bands.
    answer-evaluator.ts  Normalisation, accepted answers, spelling tolerance.
    mastery.ts           Mastery movement and the activation rules.
    scheduler.ts         Spaced repetition tuned for production.
    session-builder.ts   Queue composition and interleaving.
    exercise.ts          The exercise ladder and prompt construction.
    xp.ts achievements.ts challenges.ts streak.ts diagnostic.ts
  server/
    queries/             Read paths for Server Components.
    actions/             Server Actions: the only writers.
  lib/
    supabase/            Browser, server and proxy clients; auth helpers.
    offline/queue.ts     IndexedDB outbox for review events.
  components/            UI, Server Components by default.
  config/app.ts          Product name and branding in one file.
supabase/
  migrations/            The complete schema, in order.
  tests/rls.test.sql     pgTAP tests for the security policies.
data/vocabulary.txt      209 curated entries, one per line.
```

The domain layer never imports React or Supabase, which is what lets the client
grade an answer instantly and the server reach exactly the same conclusion when
it re-grades the same attempt.

---

## Local setup

Requirements: Node 20.9+, pnpm, and Docker if you want a local Supabase.

```bash
pnpm install
cp .env.example .env.local
```

### Option A — local Supabase (recommended)

```bash
pnpm supabase:start     # boots Postgres, Auth and Studio in Docker
```

The command prints an `API_URL` and a `PUBLISHABLE_KEY`. Put them in
`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Migrations, including the curated vocabulary, are applied automatically on
start. Confirmation emails are caught locally at <http://localhost:54324>.

```bash
pnpm dev                # http://localhost:3000
```

### Option B — a hosted Supabase project

Follow **Supabase setup** below, then `pnpm dev`.

---

## Supabase setup

1. **Create a project** at <https://supabase.com/dashboard>. Choose a region
   near your users and save the database password.

2. **Copy the environment values.** Project Settings → Data API gives you the
   project URL; Project Settings → API Keys gives you the publishable key (the
   browser-safe one, `sb_publishable_...`; older projects call it the anon
   key). Put both in `.env.local`.

3. **Run the migrations.** From the repository root:

   ```bash
   pnpm dlx supabase login
   pnpm dlx supabase link --project-ref <your-project-ref>
   pnpm db:push
   ```

   This creates every table, index, trigger, function, RLS policy **and the
   209-word starter vocabulary**, which ships as a migration. There is no
   separate seed step.

   No CLI? Open the SQL editor and run the files in `supabase/migrations/` in
   filename order.

4. **Configure the auth URLs.** Authentication → URL Configuration:

   - Site URL: `https://your-domain.com`
   - Redirect URLs:
     `https://your-domain.com/auth/confirm`,
     `https://your-domain.com/auth/callback`

   Leave "Confirm email" enabled for production. The app handles the
   confirmation link, expired links and resend flow.

5. **Run the app.**

   ```bash
   pnpm dev
   ```

### Optional: Google sign-in

Enable the Google provider under Authentication → Providers, add
`https://<project-ref>.supabase.co/auth/v1/callback` as an authorised redirect
URI in Google Cloud, then set:

```
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

The button appears only when that flag is set, so there is never a Google
button that leads nowhere.

## Environment variables

| Variable                               | Required | Purpose                                             |
| -------------------------------------- | -------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | yes      | Project URL                                         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes\*    | Browser-safe key                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | yes\*    | The older name for the same key; set either one     |
| `NEXT_PUBLIC_SITE_URL`                 | strongly recommended | Canonical origin for email links, OpenGraph and the sitemap |
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH`       | no       | `true` shows the Google button                      |

**There is no service role key.** The application never uses one. Every query
runs as the signed-in user and row level security does the enforcement.

## Database migrations

Migrations are the single source of truth and live in `supabase/migrations/`.

```bash
pnpm db:push                # apply to the linked project
pnpm supabase:reset         # rebuild the local database from scratch
pnpm db:types               # regenerate src/types/database.ts from the local db
```

Never edit a migration that has been applied; add a new one.

## Seed data

The curated vocabulary is generated from `data/vocabulary.txt`, a
pipe-separated list that is easy to read in a diff:

```
lemma|pos|cefr|russian|definition|context|tags|examples|collocations|family|accepted
```

After editing it:

```bash
pnpm db:generate-seed
```

That rewrites `supabase/migrations/20260101000600_seed_vocabulary.sql`. Word
ids are derived from the lemma and every insert uses `on conflict do nothing`,
so regenerating and re-running is safe.

The starter set is 209 entries weighted towards B1–B2: the words people read
without effort and never say.

## Development

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm start            # serve the production build
pnpm lint             # ESLint (next lint was removed in Next 16)
pnpm typecheck        # next typegen && tsc --noEmit
pnpm test             # unit and component tests
pnpm test:e2e         # Playwright
pnpm smoke            # browser-driven checks against a running app
pnpm screenshots      # visual check at 390, 430 and 1440 px
pnpm icons            # regenerate the PWA icons from scripts/generate-icons.mjs
pnpm supabase:start   # local Supabase stack
pnpm supabase:reset   # rebuild the local database
```

## Testing

**Unit and component tests** (`pnpm test`, 197 tests) cover the parts where a
mistake silently corrupts someone's learning:

- answer evaluation, including spelling tolerance and the cases it must *not*
  forgive (`affect` is not a misspelling of `effect`)
- latency classification and averaging
- mastery movement and the activation rules
- the scheduler, its interval ladder, hint penalties and fuzz
- session composition and interleaving
- XP, levels, combos, achievements, daily challenges, streaks and freezes
- calendar-day handling across timezones
- CSV parsing and validation-schema behaviour
- the answer input's mobile behaviour and the feedback panel

**Row level security tests** (`supabase test db`, pgTAP, 24 assertions) prove
the guarantees the app depends on: a learner reaches only their own rows,
cannot write into anyone else's, cannot make themselves an administrator, and
cannot edit the shared vocabulary.

**End-to-end tests** (`pnpm test:e2e`) run at an iPhone viewport:

- `public.spec.ts` needs no database. Landing page, the recall demo, no
  horizontal scroll, legal pages, the manifest and service worker, and that
  anonymous visitors cannot reach the app or the admin area.
- `journey.spec.ts` needs a Supabase project and is skipped without one:
  register, onboarding, the diagnostic, a session with a right and a wrong
  answer, the summary, progress surviving a reload, progress surviving a sign
  out and back in, adding a word, and settings persisting.

**Smoke checks** (`pnpm smoke`) drive a real browser against a running app and
the local Supabase stack. They cover the flows that are awkward to assert from
the outside:

- vocabulary search and filters, adding a word, duplicate rejection, CSV
  import with its error report, data export, the offline banner
- paging through a long word list, and a filter change starting again from the
  first page
- the admin panel: list, filters, create, edit, archive, and a CSV import that
  previews before it writes
- password reset all the way through the real email in Mailpit, and account
  deletion including that the account can no longer sign in
- answers given with the network cut: stored in IndexedDB, absent from the
  server, synced on reconnect, and never counted twice
- the service worker: registration, the precached shell, and a navigation with
  no network falling back to the offline page

Each script creates a throwaway account, so they are safe to run repeatedly.

For the journey tests, point them at a throwaway project with **email
confirmation turned off** (the local stack is already configured that way).

## Production build

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Deploy to production

### Vercel

1. Push the repository to GitHub and import it at
   <https://vercel.com/new>. Framework preset: Next.js. Build command and
   output directory are detected.

2. Add the environment variables under Settings → Environment Variables, for
   Production and Preview:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   NEXT_PUBLIC_SITE_URL          https://your-domain.com
   ```

3. Deploy, then add your domain under Settings → Domains.

4. **Go back to Supabase** and set Authentication → URL Configuration:
   Site URL `https://your-domain.com`, redirect URLs
   `https://your-domain.com/auth/confirm` and
   `https://your-domain.com/auth/callback`. Confirmation and reset links break
   if you skip this.

5. Open the site on a phone and add it to the home screen.

Nothing in the app is Vercel-specific: any host that runs a Node.js Next.js
server works. The learning engine and data layer make no assumptions about the
platform.

## PWA

- `public/manifest.webmanifest`: standalone display, portrait, maskable icons,
  and a shortcut straight to a training session.
- `public/sw.js`: a small hand-written service worker. It precaches the shell,
  serves `/offline` when a navigation fails, and caches static assets. It never
  touches auth or API traffic.
- iOS metadata, `viewport-fit=cover` and safe-area padding throughout.
- Install: Android and desktop Chrome get a real install button once the
  browser fires `beforeinstallprompt`; iOS gets the Share → Add to Home Screen
  instruction. There is no button that does nothing.

**Offline behaviour.** Answers are written to an IndexedDB outbox the instant
they are given and flushed to the server in small batches. If the network drops
mid-session, training continues on the queue already in memory and the answers
sync when it returns. Each attempt carries a client-generated id that the
database treats as an idempotency key, so a replay cannot double count.

*Documented limitation:* a session cannot be **started** offline, because the
queue is built on the server. Finishing one offline is fine.

## Admin access

`/admin` manages the shared vocabulary: search and filter by level, part of
speech and tag; create, edit and archive entries; and import a CSV with a
validation preview that shows exactly which rows are new, duplicate or invalid
before anything is written.

To appoint an administrator, run this in the Supabase SQL editor:

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

Authorisation is checked on the server on every admin request, and the database
enforces it independently: a `BEFORE UPDATE` trigger silently discards any
client attempt to change `is_admin`, and RLS plus a second trigger reject
curated writes from non-administrators. There is no hidden button standing in
for a permission check.

## Security notes

- **Row level security on every user table**, with the minimum grants. Anonymous
  visitors have no access at all; the shared vocabulary is readable by
  authenticated users only. Proven by `supabase/tests/rls.test.sql`.
- **Identity comes from the verified session.** No Server Action accepts a user
  id, and every database function derives the user from `auth.uid()`.
- **Every action input is parsed with Zod** before it is used, with bounds on
  lengths, counts and numeric ranges.
- **The server re-grades every answer.** The client grades locally so feedback
  is instant, but what gets stored is the server's own evaluation against the
  stored word.
- **No service role key**, and therefore none to leak to the browser.
- **Passwords are never handled by this app.** Supabase Auth hashes and stores
  them; there is no custom crypto anywhere.
- **Open redirects are blocked**: `next` parameters on the auth routes must be
  same-origin paths.
- **Logs never contain credentials** — only an operation name, an error string
  and small non-identifying context.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`) are set in `next.config.ts`.

*Known limitation, stated plainly:* aggregates are recomputed from
`review_events`, so a determined user could inflate their own XP by calling the
API directly. That affects only their own numbers, never anyone else's data,
and is the accepted trade for an app that must work offline.

## Troubleshooting

**"Supabase is not configured"** — `.env.local` is missing or the dev server
was started before it existed. Restart after setting the variables.

**Confirmation links land on the login page with an error** — the Supabase
redirect URLs do not include `/auth/confirm` for the origin you are using, or
the link has already been used. Both are fixed under Authentication → URL
Configuration.

**Sign-up succeeds but nothing arrives** — check Mailpit at
<http://localhost:54324> locally. In production, Supabase's built-in email has
a low rate limit; configure SMTP for real use.

**A session refreshed halfway looks unfinished** — the answers are saved; only
the summary is skipped, and the session row stays open. The next session builds
a fresh queue from the current schedule.

**`/train` says there is nothing to train** — every word is scheduled for
later. Add words of your own, or come back when something is due.

**The journey e2e tests are skipped** — no Supabase environment variables were
found. They read `.env.local` the same way Next.js does.

**`supabase test db` cannot find pgTAP** — the test file creates the extension
itself; make sure the local stack is running (`pnpm supabase:start`).

**Playwright cannot find a browser** — run `pnpm exec playwright install
chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH` to an existing binary.

---

## Deliberately not in this version

- Push notifications. The reminder setting stores a time and says plainly that
  notifications are not sent yet, rather than pretending.
- Pronunciation assessment. Speak mode transcribes what you said and grades the
  words; it does not judge your accent and never claims to.
- A Russian interface. The UI is English-first. What is already in place for a
  second language: every Russian cue, definition and example lives in the
  database rather than in a component, so no learning content would be
  translated or moved; the recurring vocabulary of the interface (word
  statuses, exercise instructions, recall bands, achievements, challenges)
  sits in a handful of maps under `src/domain/learning`; and every element
  that renders a language carries a `lang` attribute. What is still to do:
  page-level copy is inline English and would need extracting into a
  catalogue.
