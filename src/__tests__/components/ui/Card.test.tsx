import React from 'react'
import { render, screen } from '@testing-library/react'
import Card from '../../../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(
      <Card>
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('bg-white', 'shadow-md', 'border', 'border-cloud-200')
  })

  it('applies glass variant classes', () => {
    render(
      <Card variant="glass">
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('bg-white/20', 'backdrop-blur-md', 'border', 'border-white/30')
  })

  it('applies elevated variant classes', () => {
    render(
      <Card variant="elevated">
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('bg-white', 'shadow-xl', 'border', 'border-cloud-100')
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('applies hover classes when hover prop is true', () => {
    render(
      <Card hover>
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).toHaveClass('hover:shadow-lg', 'hover:scale-105')
  })

  it('does not apply hover classes when hover prop is false', () => {
    render(
      <Card hover={false}>
        <div>Test content</div>
      </Card>
    )

    const card = screen.getByText('Test content').closest('div')
    expect(card).not.toHaveClass('hover:shadow-lg', 'hover:scale-105')
  })
})
