import { describe, it, expect } from 'vitest'
import { createPickupSchema } from './pickupSchemas'

const valid = {
  title: 'Pant utanför dörren',
  can_count: 20,
  estimated_value: 10,
  address: 'Drottninggatan 1, Stockholm',
  latitude: 59.3293,
  longitude: 18.0686,
  pickup_window_start: '2026-05-01T10:00',
  pickup_window_end: '2026-05-01T18:00',
}

describe('createPickupSchema', () => {
  it('accepts a valid pickup', () => {
    expect(createPickupSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a title shorter than 3 characters', () => {
    const result = createPickupSchema.safeParse({ ...valid, title: 'ab' })
    expect(result.success).toBe(false)
  })

  it('rejects can_count of 0', () => {
    const result = createPickupSchema.safeParse({ ...valid, can_count: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative estimated_value', () => {
    const result = createPickupSchema.safeParse({ ...valid, estimated_value: -5 })
    expect(result.success).toBe(false)
  })

  it('rejects an address shorter than 5 characters', () => {
    const result = createPickupSchema.safeParse({ ...valid, address: 'AB' })
    expect(result.success).toBe(false)
  })

  it('rejects when end time is before start time', () => {
    const result = createPickupSchema.safeParse({
      ...valid,
      pickup_window_start: '2026-05-01T18:00',
      pickup_window_end: '2026-05-01T10:00',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'))
      expect(paths).toContain('pickup_window_end')
    }
  })

  it('rejects equal start and end times', () => {
    const result = createPickupSchema.safeParse({
      ...valid,
      pickup_window_start: '2026-05-01T10:00',
      pickup_window_end: '2026-05-01T10:00',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional fields as undefined', () => {
    const { description, instructions, ...rest } = { ...valid, description: undefined, instructions: undefined }
    expect(createPickupSchema.safeParse(rest).success).toBe(true)
  })
})
