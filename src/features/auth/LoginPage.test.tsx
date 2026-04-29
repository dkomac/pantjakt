import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../test/utils'
import { LoginPage } from './LoginPage'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('./authService', () => ({
  login: vi.fn(),
}))

import { login } from './authService'
const mockLogin = vi.mocked(login)

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email and password fields', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••/)).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByRole('button', { name: /logga in/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    renderWithProviders(<LoginPage />)
    await userEvent.click(screen.getByRole('button', { name: /logga in/i }))
    await waitFor(() => {
      expect(screen.getByText(/ogiltig e-postadress/i)).toBeInTheDocument()
    })
  })

  it('shows a password validation error for short passwords', async () => {
    renderWithProviders(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/••••/), '123')
    await userEvent.click(screen.getByRole('button', { name: /logga in/i }))
    await waitFor(() => {
      expect(screen.getByText(/minst 6 tecken/i)).toBeInTheDocument()
    })
  })

  it('calls login with correct credentials on valid submit', async () => {
    mockLogin.mockResolvedValue({} as never)
    renderWithProviders(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/••••/), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /logga in/i }))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
    })
  })

  it('navigates to /pickups on successful login', async () => {
    mockLogin.mockResolvedValue({} as never)
    renderWithProviders(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/••••/), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /logga in/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/pickups')
    })
  })

  it('shows an error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Ogiltiga inloggningsuppgifter'))
    renderWithProviders(<LoginPage />)
    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/••••/), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /logga in/i }))
    await waitFor(() => {
      expect(screen.getByText(/ogiltiga inloggningsuppgifter/i)).toBeInTheDocument()
    })
  })

  it('contains a link to the register page', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByRole('link', { name: /registrera/i })).toHaveAttribute('href', '/register')
  })
})
