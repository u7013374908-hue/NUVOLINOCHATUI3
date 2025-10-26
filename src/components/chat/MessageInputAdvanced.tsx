import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile, Paperclip, Mic, X, Bold, Italic, Code, Link, List, Quote } from 'lucide-react'
import Button from '../ui/Button'

interface MessageInputAdvancedProps {
  onSendMessage: (content: string, type: 'text' | 'voice' | 'file') => void
  onSendSticker: () => void
  onSendFile: () => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  showFormatting?: boolean
}

const MessageInputAdvanced: React.FC<MessageInputAdvancedProps> = ({
  onSendMessage,
  onSendSticker,
  onSendFile,
  placeholder = "Scrivi un messaggio...",
  disabled = false,
  maxLength = 2000,
  showFormatting = true
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Gestione del cursore per le menzioni
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    setCursorPosition(e.target.selectionStart)
  }

  // Gestione delle menzioni (@username)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      // Mostra suggerimenti per menzioni
      console.log('Mostra suggerimenti menzioni')
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // Shortcut per formattazione
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          insertFormatting('**', '**')
          break
        case 'i':
          e.preventDefault()
          insertFormatting('*', '*')
          break
        case 'k':
          e.preventDefault()
          insertFormatting('[', '](url)')
          break
        case '`':
          e.preventDefault()
          insertFormatting('`', '`')
          break
      }
    }
  }

  // Inserisci formattazione markdown
  const insertFormatting = (before: string, after: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = message.substring(start, end)
    
    const newText = message.substring(0, start) + before + selectedText + after + message.substring(end)
    setMessage(newText)
    
    // Riposiziona il cursore
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  // Inserisci emoji
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newText = message.substring(0, start) + emoji + message.substring(start)
    setMessage(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + emoji.length, start + emoji.length)
    }, 0)
  }

  // Invia messaggio
  const handleSendMessage = () => {
    if (!message.trim() || disabled) return

    onSendMessage(message.trim(), 'text')
    setMessage('')
  }

  // Avvia registrazione vocale
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        // Qui dovresti caricare l'audio su Supabase Storage
        console.log('Audio registrato:', audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Errore nell\'accesso al microfono:', error)
    }
  }

  // Ferma registrazione vocale
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Emoji comuni
  const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '🎉', '😢', '😮', '😡', '🤔', '👏', '🔥']

  return (
    <div className="bg-white/50 backdrop-blur-sm border-t border-white/20 p-4">
      {/* Toolbar di formattazione */}
      <AnimatePresence>
        {showFormattingToolbar && showFormatting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/30"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-cloud-700">Formattazione:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('**', '**')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('*', '*')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('`', '`')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('[', '](url)')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('> ', '')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <Quote className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting('- ', '')}
                className="text-cloud-600 hover:bg-cloud-100"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-cloud-700">Emoji:</span>
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-lg hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input principale */}
      <div className="flex items-end space-x-3">
        {/* Pulsanti azione */}
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSendSticker}
            className="text-nuvolino-600 hover:bg-nuvolino-100"
          >
            <Smile className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSendFile}
            className="text-nuvolino-600 hover:bg-nuvolino-100"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={showFormatting ? () => setShowFormattingToolbar(!showFormattingToolbar) : undefined}
            className="text-nuvolino-600 hover:bg-nuvolino-100"
          >
            <Bold className="w-5 h-5" />
          </Button>
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="w-full min-h-[44px] max-h-32 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-nuvolino-400 focus:border-transparent placeholder-cloud-400 text-cloud-800"
            style={{ minHeight: '44px' }}
          />
          
          {/* Contatore caratteri */}
          <div className="absolute bottom-2 right-2 text-xs text-cloud-400">
            {message.length}/{maxLength}
          </div>
        </div>

        {/* Pulsante registrazione/invio */}
        <div className="flex space-x-2">
          {isRecording ? (
            <Button
              variant="primary"
              size="sm"
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 animate-pulse"
            >
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled}
            className="bg-gradient-to-r from-nuvolino-400 to-nuvolino-500 hover:from-nuvolino-500 hover:to-nuvolino-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Suggerimenti markdown */}
      <div className="mt-2 text-xs text-cloud-500">
        <span>Usa **grassetto**, *corsivo*, `codice`, [link](url), > citazione, - lista</span>
        <span className="ml-4">Ctrl+B, Ctrl+I, Ctrl+K per formattazione rapida</span>
      </div>
    </div>
  )
}

export default MessageInputAdvanced
