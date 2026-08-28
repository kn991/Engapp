import { describe, expect, it } from 'vitest'
import { addDays, dayKey, dayRange, daysBetween, isValidTimeZone, safeTimeZone } from '@/domain/learning/day'

describe('dayKey', () => {
  it('uses the learner local day, not UTC', () => {
    // 23:50 in Moscow on 1 March is 20:50 UTC on the same day.
    const late = new Date('2026-03-01T20:50:00.000Z')
    expect(dayKey(late, 'Europe/Moscow')).toBe('2026-03-01')

    // 00:30 in Moscow on 2 March is still 1 March in UTC.
    const justAfterMidnight = new Date('2026-03-01T21:30:00.000Z')
    expect(dayKey(justAfterMidnight, 'Europe/Moscow')).toBe('2026-03-02')
    expect(dayKey(justAfterMidnight, 'UTC')).toBe('2026-03-01')
  })

  it('falls back to UTC for an unknown zone rather than throwing', () => {
    expect(dayKey(new Date('2026-03-01T12:00:00.000Z'), 'Not/AZone')).toBe('2026-03-01')
  })
})

describe('safeTimeZone', () => {
  it('accepts a real zone and rejects anything else', () => {
    expect(safeTimeZone('Europe/Berlin')).toBe('Europe/Berlin')
    expect(safeTimeZone('nonsense')).toBe('UTC')
    expect(safeTimeZone(null)).toBe('UTC')
  })
})

describe('isValidTimeZone', () => {
  it('recognises IANA identifiers', () => {
    expect(isValidTimeZone('America/New_York')).toBe(true)
    expect(isValidTimeZone('Mars/Olympus')).toBe(false)
  })
})

describe('daysBetween', () => {
  it('counts whole days forwards and backwards', () => {
    expect(daysBetween('2026-03-01', '2026-03-04')).toBe(3)
    expect(daysBetween('2026-03-04', '2026-03-01')).toBe(-3)
    expect(daysBetween('2026-03-01', '2026-03-01')).toBe(0)
  })

  it('crosses a month and a leap day correctly', () => {
    expect(daysBetween('2026-02-27', '2026-03-01')).toBe(2)
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2)
  })
})

describe('addDays and dayRange', () => {
  it('moves across month boundaries', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('returns an inclusive range ending on the given day', () => {
    expect(dayRange('2026-03-03', 3)).toEqual(['2026-03-01', '2026-03-02', '2026-03-03'])
  })
})
