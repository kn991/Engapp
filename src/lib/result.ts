/**
 * The shape every Server Action returns.
 *
 * Actions never throw across the network boundary: they return a discriminated
 * result so the client can render a real message instead of a stack trace, and
 * so technical details stay on the server.
 */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; field?: string }

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data }
}

export function fail(error: string, field?: string): ActionResult<never> {
  return { ok: false, error, field }
}

/** Human readable message for anything unexpected. */
export const GENERIC_ERROR = 'Something went wrong on our side. Please try again.'
