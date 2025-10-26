import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Message, User } from '../../lib/supabase'
import Avatar from '../ui/Avatar'
import { Heart, Smile, MoreHorizontal, MessageCircle, Reply, Edit, Trash2 } from 'lucide-react'
import Button from '../ui/Button'

interface MessageItemProps {
  message: Message
  user?: User
  isConsecutive: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  isOwn?: boolean
  isThread?: boolean
  threadCount?: number
  onReply?: (message: Message) => void
  onEdit?: (message: Message) => void
  onDelete?: (message: Message) => void
  onOpenThread?: (message: Message) => void
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  user, 
  isConsecutive,
  showAvatar = true,
  showTimestamp = true,
  isOwn = false,
  isThread = false,
  threadCount = 0,
  onReply,
  onEdit,
  onDelete,
  onOpenThread
}) => {
  const [showReactions, setShowReactions] = useState(false)
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [showActions, setShowActions] = useState(false)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }))
    setShowReactions(false)
  }

  // Renderizza markdown semplice
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-cloud-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-nuvolino-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-nuvolino-300 pl-4 italic text-cloud-600">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
        <div className="w-8 h-8 bg-cloud-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-cloud-200 rounded animate-pulse"></div>
          <div className="h-3 bg-cloud-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`flex space-x-3 group hover:bg-white/5 transition-colors duration-200 ${
        isConsecutive ? 'ml-12' : ''
      }`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Avatar - solo se non è un messaggio consecutivo e showAvatar è true */}
      {!isConsecutive && showAvatar && (
        <div className="flex-shrink-0">
          <Avatar
            src={user.avatar_url}
            alt={user.username}
            size="sm"
            status={user.status}
          />
        </div>
      )}

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header - solo se non è un messaggio consecutivo */}
        {!isConsecutive && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-cloud-800 text-sm">
              {user.username}
            </span>
            {showTimestamp && (
              <span className="text-xs text-cloud-500">
                {formatTime(message.created_at)}
              </span>
            )}
            {isOwn && (
              <span className="text-xs text-nuvolino-600 bg-nuvolino-100 px-2 py-0.5 rounded-full">
                Tu
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="relative">
          <motion.div
            className="bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {message.type === 'text' && (
              <div 
                className="text-cloud-800 whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
              />
            )}
            
            {message.type === 'image' && (
              <div className="space-y-2">
                <img
                  src={message.file_url}
                  alt="Immagine"
                  className="max-w-xs rounded-lg shadow-sm"
                />
                {message.content && (
                  <p className="text-cloud-800 text-sm">
                    {message.content}
                  </p>
                )}
              </div>
            )}

            {message.type === 'voice' && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-nuvolino-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎵</span>
                </div>
                <div className="flex-1">
                  <p className="text-cloud-800 text-sm">Messaggio vocale</p>
                  <p className="text-xs text-cloud-500">0:15</p>
                </div>
              </div>
            )}

            {message.type === 'file' && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cloud-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📎</span>
                </div>
                <div className="flex-1">
                  <p className="text-cloud-800 text-sm">File allegato</p>
                  <p className="text-xs text-cloud-500">documento.pdf</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Reactions */}
          {Object.keys(reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(reactions).map(([emoji, count]) => (
                <motion.button
                  key={emoji}
                  className="flex items-center space-x-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{emoji}</span>
                  <span className="text-cloud-600">{count}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Thread indicator */}
          {threadCount > 0 && (
            <motion.button
              className="flex items-center space-x-1 mt-2 text-xs text-nuvolino-600 hover:text-nuvolino-700 hover:bg-nuvolino-50 px-2 py-1 rounded-full transition-colors"
              onClick={() => onOpenThread?.(message)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-3 h-3" />
              <span>{threadCount} risposte</span>
            </motion.button>
          )}

          {/* Action Buttons */}
          <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
                className="w-8 h-8 p-0"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction('❤️')}
                className="w-8 h-8 p-0"
              >
                <Heart className="w-4 h-4" />
              </Button>
              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(message)}
                  className="w-8 h-8 p-0"
                >
                  <Reply className="w-4 h-4" />
                </Button>
              )}
              {isOwn && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(message)}
                  className="w-8 h-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {isOwn && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(message)}
                  className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
                className="w-8 h-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MessageItem
