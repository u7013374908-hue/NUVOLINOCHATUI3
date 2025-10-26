import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Message, User } from '../../lib/supabase'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../ui/Card'

interface ChatAreaProps {
  channelId: string | null
  onChannelSelect: (channelId: string) => void
}

const ChatArea: React.FC<ChatAreaProps> = ({ channelId, onChannelSelect }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (channelId) {
      fetchMessages(channelId)
      subscribeToMessages(channelId)
    }

    return () => {
      // Unsubscribe from realtime updates
      supabase.removeAllChannels()
    }
  }, [channelId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async (channelId: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:users(*)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      const messagesData = data || []
      setMessages(messagesData)

      // Store user data
      const usersData: Record<string, User> = {}
      messagesData.forEach((message: any) => {
        if (message.user) {
          usersData[message.user.id] = message.user
        }
      })
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = (channelId: string) => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const newMessage = payload.new as Message
          
          // Fetch user data for the new message
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', newMessage.user_id)
            .single()

          if (userData) {
            setUsers(prev => ({ ...prev, [userData.id]: userData }))
          }

          setMessages(prev => [...prev, newMessage])
        }
      )
      .subscribe()

    return channel
  }

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'voice' | 'file' = 'text') => {
    if (!channelId || !user || !content.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          user_id: user.id,
          content: content.trim(),
          type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error sending message:', error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!channelId) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
            <span className="text-4xl">☁️</span>
          </div>
          <h3 className="text-xl font-semibold text-nuvolino-700 mb-2 font-poppins">
            Benvenuto in Nuvolino UI Chat!
          </h3>
          <p className="text-cloud-600 mb-6">
            Seleziona un canale per iniziare a chattare
          </p>
          <div className="text-sm text-cloud-500">
            <p>🐶 Nuvolino ti aspetta nella Nuvola!</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/10 backdrop-blur-sm">
      {/* Chat Header */}
      <ChatHeader channelId={channelId} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="w-8 h-8 border-4 border-nuvolino-200 border-t-nuvolino-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <>
            <MessageList messages={messages} users={users} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/20">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default ChatArea
