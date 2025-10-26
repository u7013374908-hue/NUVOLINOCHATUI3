import React from 'react'
import { render, screen } from '@testing-library/react'
import Avatar from '../../../components/ui/Avatar'

describe('Avatar', () => {
  it('renders with image when src is provided', () => {
    render(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="Test User"
        size="md"
      />
    )

    const img = screen.getByAltText('Test User')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders with initial when src is not provided', () => {
    render(<Avatar alt="Test User" size="md" />)

    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('renders with correct size classes', () => {
    const { rerender } = render(<Avatar alt="Test User" size="sm" />)
    expect(screen.getByRole('generic')).toHaveClass('w-8', 'h-8')

    rerender(<Avatar alt="Test User" size="md" />)
    expect(screen.getByRole('generic')).toHaveClass('w-12', 'h-12')

    rerender(<Avatar alt="Test User" size="lg" />)
    expect(screen.getByRole('generic')).toHaveClass('w-16', 'h-16')

    rerender(<Avatar alt="Test User" size="xl" />)
    expect(screen.getByRole('generic')).toHaveClass('w-24', 'h-24')
  })

  it('renders status indicator when status is provided', () => {
    const { rerender } = render(
      <Avatar alt="Test User" size="md" status="online" />
    )
    expect(screen.getByRole('generic')).toHaveClass('bg-green-400')

    rerender(<Avatar alt="Test User" size="md" status="offline" />)
    expect(screen.getByRole('generic')).toHaveClass('bg-cloud-400')

    rerender(<Avatar alt="Test User" size="md" status="away" />)
    expect(screen.getByRole('generic')).toHaveClass('bg-yellow-400')

    rerender(<Avatar alt="Test User" size="md" status="busy" />)
    expect(screen.getByRole('generic')).toHaveClass('bg-red-400')
  })

  it('applies custom className', () => {
    render(
      <Avatar
        alt="Test User"
        size="md"
        className="custom-class"
      />
    )

    expect(screen.getByRole('generic')).toHaveClass('custom-class')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <Avatar
        alt="Test User"
        size="md"
        onClick={handleClick}
      />
    )

    fireEvent.click(screen.getByRole('generic'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
