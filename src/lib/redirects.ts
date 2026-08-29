import { NextResponse } from 'next/server'

/**
 * A same-origin redirect that keeps the browser on the host it arrived at.
 *
 * `NextResponse.redirect` needs an absolute URL, and the URL Next reconstructs
 * for a request is not always the host the browser used (127.0.0.1 against
 * localhost, or a proxy host against the internal one). Redirecting to the
 * wrong host silently drops the session cookie that was just set, which breaks
 * email confirmation and password resets. HTTP allows a relative `Location`,
 * and the browser resolves it against the current URL, so this is always
 * correct.
 */
export function redirectTo(path: string): NextResponse {
  return new NextResponse(null, {
    status: 303,
    headers: { Location: path, 'Cache-Control': 'no-store' },
  })
}

/** Rejects anything that is not a same-origin path, so links cannot redirect off-site. */
export function safeNextPath(value: string | null, fallback = '/home'): string {
  if (!value) return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
