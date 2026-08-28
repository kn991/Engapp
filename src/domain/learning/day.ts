/**
 * Calendar-day helpers.
 *
 * Streaks and daily stats are keyed by the learner's local day, not UTC.
 * Someone training at 23:50 in Moscow must not have it counted as tomorrow.
 */

const DAY_MS = 24 * 60 * 60 * 1000

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date())
    return true
  } catch {
    return false
  }
}

export function safeTimeZone(timeZone: string | null | undefined): string {
  if (timeZone && isValidTimeZone(timeZone)) return timeZone
  return 'UTC'
}

/** `YYYY-MM-DD` for an instant, in a given IANA timezone. */
export function dayKey(date: Date, timeZone: string): string {
  const tz = safeTimeZone(timeZone)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  return parts
}

export function todayKey(timeZone: string, now: Date = new Date()): string {
  return dayKey(now, timeZone)
}

/** Whole days between two `YYYY-MM-DD` keys. Positive when `b` is later. */
export function daysBetween(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00Z`)
  const tb = Date.parse(`${b}T00:00:00Z`)
  if (Number.isNaN(ta) || Number.isNaN(tb)) return 0
  return Math.round((tb - ta) / DAY_MS)
}

export function addDays(day: string, amount: number): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return day
  return new Date(t + amount * DAY_MS).toISOString().slice(0, 10)
}

/** Inclusive list of day keys, oldest first. */
export function dayRange(endDay: string, length: number): string[] {
  const out: string[] = []
  for (let i = length - 1; i >= 0; i -= 1) out.push(addDays(endDay, -i))
  return out
}

export function formatDayLabel(day: string, locale = 'en-US'): string {
  const date = new Date(`${day}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return day
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
