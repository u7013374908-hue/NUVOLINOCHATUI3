import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message, User } from '../../lib/supabase'
import MessageItem from './MessageItem'

interface MessageListProps {
  messages: Message[]
  users: Record<string, User>
}

const MessageList: React.FC<MessageListProps> = ({ messages, users }) => {
  if (messages.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-lg font-semibold text-nuvolino-700 mb-2 font-poppins">
          Nessun messaggio ancora
        </h3>
        <p className="text-cloud-600">
          Inizia la conversazione inviando il primo messaggio!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => {
          const user = users[message.user_id]
          const prevMessage = index > 0 ? messages[index - 1] : null
          const isConsecutive = prevMessage && prevMessage.user_id === message.user_id
          
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
            >
              <MessageItem
                message={message}
                user={user}
                isConsecutive={isConsecutive}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default MessageList
