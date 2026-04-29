import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/utils'
import { PickupCard } from './PickupCard'
import type { Pickup } from '../../../lib/database.types'

const basePickup: Pickup = {
  id: 'abc-123',
  donor_id: 'user-1',
  title: 'Pant vid ingången',
  description: 'Två påsar med burkar',
  can_count: 30,
  estimated_value: 15,
  address: 'Storgatan 1, Stockholm',
  latitude: 59.3293,
  longitude: 18.0686,
  pickup_window_start: '2026-05-01T10:00:00Z',
  pickup_window_end: '2026-05-01T18:00:00Z',
  instructions: null,
  image_url: null,
  status: 'available',
  collector_id: null,
  created_at: '2026-04-28T08:00:00Z',
  updated_at: '2026-04-28T08:00:00Z',
}

describe('PickupCard', () => {
  it('renders the title', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.getByText('Pant vid ingången')).toBeInTheDocument()
  })

  it('renders the can count', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.getByText(/30/)).toBeInTheDocument()
  })

  it('renders the estimated value in SEK', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.getByText(/15/)).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.getByText('Tillgänglig')).toBeInTheDocument()
  })

  it('links to the correct pickup detail URL', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pickups/abc-123')
  })

  it('shows a placeholder when there is no image', () => {
    const { container } = renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
  })

  it('renders an image when image_url is set', () => {
    const pickup = { ...basePickup, image_url: 'https://example.com/img.jpg' }
    renderWithProviders(<PickupCard pickup={pickup} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('shows distance when provided', () => {
    renderWithProviders(<PickupCard pickup={basePickup} distanceKm={2.4} />)
    expect(screen.getByText(/2\.4/)).toBeInTheDocument()
  })

  it('does not show distance when not provided', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.queryByText(/km/)).not.toBeInTheDocument()
  })

  it('renders description when present', () => {
    renderWithProviders(<PickupCard pickup={basePickup} />)
    expect(screen.getByText('Två påsar med burkar')).toBeInTheDocument()
  })
})
