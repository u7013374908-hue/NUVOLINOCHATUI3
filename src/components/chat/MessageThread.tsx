import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Message } from '../../types/chat'
import MessageItem from './MessageItem'
import MessageInputAdvanced from './MessageInputAdvanced'
import { X, MessageCircle, Users } from 'lucide-react'
import Button from '../ui/Button'

interface MessageThreadProps {
  isOpen: boolean
  onClose: () => void
  parentMessage: Message
  threadMessages: Message[]
  onSendMessage: (content: string, parentId: string) => void
  onSendSticker: (sticker: any, parentId: string) => void
  onSendFile: (file: File, parentId: string) => void
}

const MessageThread: React.FC<MessageThreadProps> = ({
  isOpen,
  onClose,
  parentMessage,
  threadMessages,
  onSendMessage,
  onSendSticker,
  onSendFile
}) => {
  const [showStickerPanel, setShowStickerPanel] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threadMessages])

  const handleSendMessage = (content: string) => {
    onSendMessage(content, parentMessage.id)
  }

  const handleSendSticker = () => {
    setShowStickerPanel(true)
  }

  const handleSendFile = () => {
    // Trigger file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onSendFile(file, parentMessage.id)
      }
    }
    input.click()
  }

  const handleStickerSelect = (sticker: any) => {
    onSendSticker(sticker, parentMessage.id)
    setShowStickerPanel(false)
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cloud-200 bg-gradient-to-r from-nuvolino-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-nuvolino-700">
                  Thread di Risposta
                </h3>
                <p className="text-sm text-cloud-600">
                  {threadMessages.length} risposte
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messaggio originale */}
          <div className="bg-cloud-50 rounded-xl p-4 border-l-4 border-nuvolino-300">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center text-sm font-semibold text-nuvolino-700">
                {parentMessage.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-cloud-800">
                    {parentMessage.author?.username || 'Utente'}
                  </span>
                  <span className="text-xs text-cloud-500">
                    {new Date(parentMessage.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-cloud-700 text-sm">
                  {parentMessage.content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista messaggi del thread */}
        <div className="flex-1 overflow-y-auto max-h-96 p-6 space-y-4">
          {threadMessages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-cloud-300 mx-auto mb-4" />
              <p className="text-cloud-500">Nessuna risposta ancora</p>
              <p className="text-sm text-cloud-400">Sii il primo a rispondere!</p>
            </div>
          ) : (
            threadMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MessageItem
                  message={message}
                  showAvatar={true}
                  showTimestamp={true}
                  isThread={true}
                />
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input per rispondere */}
        <div className="border-t border-cloud-200">
          <MessageInputAdvanced
            onSendMessage={handleSendMessage}
            onSendSticker={handleSendSticker}
            onSendFile={handleSendFile}
            placeholder="Rispondi nel thread..."
            showFormatting={true}
          />
        </div>

        {/* Sticker Panel */}
        <AnimatePresence>
          {showStickerPanel && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStickerPanel(false)}
            >
              <motion.div
                className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticker content would go here */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-nuvolino-700 mb-4">
                    Scegli uno Sticker
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {/* Mock stickers */}
                    {['😊', '😂', '❤️', '👍', '🎉', '😢'].map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleStickerSelect({ id: index, emoji })}
                        className="aspect-square bg-cloud-100 rounded-xl flex items-center justify-center text-2xl hover:bg-cloud-200 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default MessageThread
