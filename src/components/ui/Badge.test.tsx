import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from './Badge'
import type { PickupStatus } from '../../lib/database.types'

const cases: Array<[PickupStatus, string]> = [
  ['available', 'Tillgänglig'],
  ['claimed',   'Bokad'],
  ['completed', 'Hämtad'],
  ['cancelled', 'Avbruten'],
]

describe('StatusBadge', () => {
  it.each(cases)('shows correct label for status "%s"', (status, label) => {
    render(<StatusBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it('applies a green colour for available status', () => {
    const { container } = render(<StatusBadge status="available" />)
    expect(container.firstChild).toHaveClass('text-emerald-700')
  })

  it('applies a red/gray colour for cancelled status', () => {
    const { container } = render(<StatusBadge status="cancelled" />)
    expect(container.firstChild).toHaveClass('text-gray-500')
  })
})
