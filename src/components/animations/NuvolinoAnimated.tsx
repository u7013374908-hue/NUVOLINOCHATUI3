import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NuvolinoAnimatedProps {
  state?: 'idle' | 'happy' | 'sleeping' | 'excited' | 'sad'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onAnimationComplete?: () => void
}

const NuvolinoAnimated: React.FC<NuvolinoAnimatedProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onAnimationComplete
}) => {
  const [currentState, setCurrentState] = useState(state)
  const [isWagging, setIsWagging] = useState(false)

  useEffect(() => {
    setCurrentState(state)
  }, [state])

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const getAnimationClass = () => {
    switch (currentState) {
      case 'idle':
        return 'animate-nuvolino-breathe'
      case 'happy':
        return 'animate-nuvolino-wag'
      case 'sleeping':
        return 'animate-nuvolino-sleep'
      case 'excited':
        return 'animate-nuvolino-jump'
      case 'sad':
        return 'animate-pulse-soft'
      default:
        return 'animate-nuvolino-breathe'
    }
  }

  const getExpression = () => {
    switch (currentState) {
      case 'happy':
        return '😊'
      case 'sleeping':
        return '😴'
      case 'excited':
        return '🤩'
      case 'sad':
        return '😢'
      default:
        return '😊'
    }
  }

  const handleClick = () => {
    if (currentState === 'idle') {
      setCurrentState('excited')
      setIsWagging(true)
      setTimeout(() => {
        setCurrentState('idle')
        setIsWagging(false)
        onAnimationComplete?.()
      }, 1000)
    }
  }

  return (
    <motion.div
      className={`${sizes[size]} ${className} cursor-pointer relative`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Nuvola di sfondo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 rounded-full blur-sm"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Corpo principale */}
      <motion.div
        className={`relative w-full h-full bg-gradient-to-br from-white to-white/90 rounded-full shadow-lg flex items-center justify-center ${getAnimationClass()}`}
        animate={currentState === 'excited' ? { y: [-10, 10, -10] } : {}}
        transition={{ duration: 0.5, repeat: currentState === 'excited' ? 2 : 0 }}
      >
        {/* Orecchie */}
        <motion.div
          className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={isWagging ? { rotate: [-10, 10, -10] } : {}}
          transition={{ duration: 0.3, repeat: isWagging ? 3 : 0 }}
        />
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={isWagging ? { rotate: [10, -10, 10] } : {}}
          transition={{ duration: 0.3, repeat: isWagging ? 3 : 0 }}
        />

        {/* Occhi */}
        <motion.div
          className="absolute top-2 left-1 w-1.5 h-1.5 bg-black rounded-full"
          animate={currentState === 'sleeping' ? { scaleY: 0.3 } : { scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-2 right-1 w-1.5 h-1.5 bg-black rounded-full"
          animate={currentState === 'sleeping' ? { scaleY: 0.3 } : { scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Naso */}
        <motion.div
          className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"
          animate={currentState === 'excited' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.2, repeat: currentState === 'excited' ? 2 : 0 }}
        />

        {/* Bocca */}
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2"
          animate={currentState === 'sad' ? { y: 2 } : { y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentState === 'happy' || currentState === 'excited' ? (
            <div className="w-3 h-2 border-b-2 border-black rounded-full" />
          ) : currentState === 'sad' ? (
            <div className="w-3 h-2 border-t-2 border-black rounded-full" />
          ) : (
            <div className="w-2 h-1 border-b border-black rounded-full" />
          )}
        </motion.div>

        {/* Zampina che saluta */}
        <motion.div
          className="absolute -right-1 top-1 w-2 h-3 bg-white rounded-full shadow-sm"
          animate={isWagging ? { rotate: [0, 20, 0] } : {}}
          transition={{ duration: 0.3, repeat: isWagging ? 3 : 0 }}
        />

        {/* Espressione emoji */}
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getExpression()}
        </motion.div>
      </motion.div>

      {/* Particelle di gioia quando è eccitato */}
      <AnimatePresence>
        {currentState === 'excited' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: Math.cos(i * 60 * Math.PI / 180) * 30,
                  y: Math.sin(i * 60 * Math.PI / 180) * 30,
                  opacity: 0,
                  scale: 1
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default NuvolinoAnimated
