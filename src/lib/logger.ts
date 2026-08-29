import 'server-only'

/**
 * Minimal structured server logging.
 *
 * Never pass request bodies, tokens or passwords: only an operation name, an
 * error and small, non-identifying context values.
 */

type Context = Record<string, string | number | boolean | null | undefined>

function serialiseError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`
  if (typeof error === 'string') return error
  // Supabase returns plain objects rather than Error instances.
  if (error && typeof error === 'object') {
    const candidate = error as { message?: unknown; code?: unknown; details?: unknown }
    const parts = [candidate.code, candidate.message, candidate.details]
      .filter((part): part is string | number => typeof part === 'string' || typeof part === 'number')
      .map(String)
    if (parts.length > 0) return parts.join(': ')
  }
  return 'unknown error'
}

export function logError(operation: string, error: unknown, context: Context = {}): void {
  console.error(
    JSON.stringify({
      level: 'error',
      operation,
      error: serialiseError(error),
      ...context,
      at: new Date().toISOString(),
    })
  )
}

export function logWarning(operation: string, message: string, context: Context = {}): void {
  console.warn(
    JSON.stringify({
      level: 'warn',
      operation,
      message,
      ...context,
      at: new Date().toISOString(),
    })
  )
}
