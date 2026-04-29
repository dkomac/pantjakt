import { describe, it, expect } from 'vitest'
import { haversineKm } from './geo'

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(59.3293, 18.0686, 59.3293, 18.0686)).toBe(0)
  })

  it('returns a positive distance for different coordinates', () => {
    // Stockholm to Gothenburg straight-line is ~400 km
    const d = haversineKm(59.3293, 18.0686, 57.7089, 11.9746)
    expect(d).toBeGreaterThan(350)
    expect(d).toBeLessThan(500)
  })

  it('is symmetric', () => {
    const a = haversineKm(59.3293, 18.0686, 57.7089, 11.9746)
    const b = haversineKm(57.7089, 11.9746, 59.3293, 18.0686)
    expect(a).toBeCloseTo(b, 5)
  })

  it('returns a small distance for nearby points', () => {
    // ~1 km apart
    const d = haversineKm(59.3293, 18.0686, 59.3383, 18.0686)
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(2)
  })
})
