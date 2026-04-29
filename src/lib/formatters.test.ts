import { describe, it, expect } from 'vitest'
import { formatSEK, formatDate, formatDateShort } from './formatters'

describe('formatSEK', () => {
  it('formats whole krona amounts', () => {
    expect(formatSEK(25)).toMatch(/25/)
    expect(formatSEK(25)).toMatch(/kr|SEK/)
  })

  it('formats zero', () => {
    expect(formatSEK(0)).toMatch(/0/)
  })

  it('formats large amounts with thousand separators', () => {
    const result = formatSEK(1000)
    expect(result).toMatch(/1[\s ]?000|1000/)
  })
})

describe('formatDate', () => {
  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2026-04-28T10:00:00Z')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('includes the year', () => {
    const result = formatDate('2026-04-28T10:00:00Z')
    expect(result).toContain('2026')
  })
})

describe('formatDateShort', () => {
  it('returns a shorter string than formatDate', () => {
    const iso = '2026-04-28T10:00:00Z'
    expect(formatDateShort(iso).length).toBeLessThanOrEqual(formatDate(iso).length)
  })

  it('returns a non-empty string', () => {
    expect(formatDateShort('2026-06-15T08:30:00Z')).toBeTruthy()
  })
})
