import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { Send, Smile, Paperclip, Mic } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'voice' | 'file') => void
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Qui implementeresti l'upload del file
      console.log('File selected:', file)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Qui implementeresti la registrazione vocale
    console.log('Starting voice recording...')
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Qui implementeresti la fine della registrazione
    console.log('Stopping voice recording...')
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex items-end space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* File Upload Input (hidden) */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,audio/*,.pdf,.doc,.docx"
      />

      {/* Message Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyPress={handleKeyPress}
          placeholder="Scrivi un messaggio..."
          className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100 bg-white/50 backdrop-blur-sm resize-none transition-all duration-300 min-h-[48px] max-h-[120px]"
          rows={1}
        />
        
        {/* Emoji Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
        >
          <Smile className="w-4 h-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* File Upload Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Voice Recording Button */}
        <Button
          type="button"
          variant={isRecording ? 'primary' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={stopRecording}
        >
          <Mic className="w-4 h-4" />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!message.trim()}
          className="w-10 h-10 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.form>
  )
}

export default MessageInput
