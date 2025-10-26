import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StartupAnimationProps {
  onComplete: () => void
}

const StartupAnimation: React.FC<StartupAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'cloud' | 'nuvolino' | 'text' | 'complete'>('cloud')

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('nuvolino'), 2000)
    const timer2 = setTimeout(() => setPhase('text'), 4000)
    const timer3 = setTimeout(() => setPhase('complete'), 6000)
    const timer4 = setTimeout(() => onComplete(), 7000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-nuvolino-50 via-white to-nuvolino-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Nuvola animata */}
        <AnimatePresence>
          {phase !== 'complete' && (
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {/* Nuvola */}
              <motion.div
                className="relative w-32 h-20 mx-auto"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 rounded-full blur-sm"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-white to-white/80 rounded-full"></div>
                <div className="absolute -left-4 top-2 w-8 h-8 bg-white/80 rounded-full"></div>
                <div className="absolute -right-4 top-2 w-8 h-8 bg-white/80 rounded-full"></div>
                <div className="absolute left-2 -top-2 w-6 h-6 bg-white/80 rounded-full"></div>
                <div className="absolute right-2 -top-2 w-6 h-6 bg-white/80 rounded-full"></div>
              </motion.div>

              {/* Nuvolino */}
              <AnimatePresence>
                {phase === 'nuvolino' && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 200 }}
                  >
                    {/* Corpo del cagnolino */}
                    <div className="relative">
                      {/* Testa */}
                      <div className="w-8 h-8 bg-white rounded-full shadow-lg relative">
                        {/* Orecchie */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full transform -rotate-12"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full transform rotate-12"></div>
                        {/* Occhi */}
                        <div className="absolute top-2 left-1 w-1 h-1 bg-black rounded-full"></div>
                        <div className="absolute top-2 right-1 w-1 h-1 bg-black rounded-full"></div>
                        {/* Naso */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                        {/* Bocca */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-1 border-b-2 border-black rounded-full"></div>
                      </div>
                      {/* Zampina che saluta */}
                      <motion.div
                        className="absolute -right-2 top-1 w-2 h-3 bg-white rounded-full"
                        animate={{ rotate: [0, 20, 0] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testo */}
        <AnimatePresence>
          {phase === 'text' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl font-bold text-nuvolino-700 mb-2 font-poppins">
                Nuvolino UI Chat
              </h1>
              <p className="text-lg text-cloud-600 font-nunito">
                Benvenuto nella Nuvola! ☁️
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsante Inizia */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-nuvolino-400 to-nuvolino-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
              >
                Inizia
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StartupAnimation
