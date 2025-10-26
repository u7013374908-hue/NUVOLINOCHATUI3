import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock del context di autenticazione
jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }),
}))

// Mock di Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
    },
  },
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Nuvolino UI Chat')).toBeInTheDocument()
  })

  it('shows startup animation initially', () => {
    render(<App />)
    // L'animazione di startup dovrebbe essere visibile
    expect(screen.getByText('Nuvolino UI Chat')).toBeInTheDocument()
  })
})
