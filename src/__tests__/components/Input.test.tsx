import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../../components/ui/Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" value="" onChange={() => {}} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Test placeholder" value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })

  it('calls onChange when input value changes', () => {
    const handleChange = jest.fn()
    render(<Input value="" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('shows error message when error prop is provided', () => {
    render(<Input value="" onChange={() => {}} error="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input value="" onChange={() => {}} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders with icon when provided', () => {
    const TestIcon = () => <div data-testid="test-icon">Icon</div>
    render(<Input value="" onChange={() => {}} icon={<TestIcon />} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applies correct input type', () => {
    const { rerender } = render(<Input type="email" value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')
  })
})
