import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MessageItem from '../../../components/chat/MessageItem'
import { Message, User } from '../../../lib/supabase'

const mockMessage: Message = {
  id: '1',
  channel_id: 'channel1',
  user_id: 'user1',
  content: 'Hello world!',
  type: 'text',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
}

const mockUser: User = {
  id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
  status: 'online',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
}

describe('MessageItem', () => {
  it('renders message content', () => {
    render(
      <MessageItem
        message={mockMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })

  it('renders user information when not consecutive', () => {
    render(
      <MessageItem
        message={mockMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('does not render user information when consecutive', () => {
    render(
      <MessageItem
        message={mockMessage}
        user={mockUser}
        isConsecutive={true}
      />
    )

    expect(screen.queryByText('testuser')).not.toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(
      <MessageItem
        message={mockMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('renders loading state when user is not provided', () => {
    render(
      <MessageItem
        message={mockMessage}
        user={undefined}
        isConsecutive={false}
      />
    )

    expect(screen.getByRole('generic')).toHaveClass('animate-pulse')
  })

  it('handles image message type', () => {
    const imageMessage: Message = {
      ...mockMessage,
      type: 'image',
      file_url: 'https://example.com/image.jpg',
      content: 'Check this out!',
    }

    render(
      <MessageItem
        message={imageMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByAltText('Immagine')).toBeInTheDocument()
    expect(screen.getByText('Check this out!')).toBeInTheDocument()
  })

  it('handles voice message type', () => {
    const voiceMessage: Message = {
      ...mockMessage,
      type: 'voice',
      file_url: 'https://example.com/voice.mp3',
    }

    render(
      <MessageItem
        message={voiceMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByText('Messaggio vocale')).toBeInTheDocument()
    expect(screen.getByText('0:15')).toBeInTheDocument()
  })

  it('handles file message type', () => {
    const fileMessage: Message = {
      ...mockMessage,
      type: 'file',
      file_url: 'https://example.com/document.pdf',
    }

    render(
      <MessageItem
        message={fileMessage}
        user={mockUser}
        isConsecutive={false}
      />
    )

    expect(screen.getByText('File allegato')).toBeInTheDocument()
    expect(screen.getByText('documento.pdf')).toBeInTheDocument()
  })
})
