import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Klicka här</Button>)
    expect(screen.getByRole('button', { name: 'Klicka här' })).toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    render(<Button loading>Laddar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Inaktiv</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows a spinner when loading', () => {
    const { container } = render(<Button loading>Laddar</Button>)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('does not show a spinner when not loading', () => {
    const { container } = render(<Button>Klicka</Button>)
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Klicka</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Inaktiv</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Ta bort</Button>)
    expect(screen.getByRole('button').className).toMatch(/red/)
  })
})
