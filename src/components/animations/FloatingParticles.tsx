import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface FloatingParticlesProps {
  enabled?: boolean
  count?: number
  className?: string
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  enabled = true,
  count = 8,
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!enabled) return

    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 5
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 15000) // Rigenera ogni 15 secondi

    return () => clearInterval(interval)
  }, [enabled, count])

  if (!enabled) return null

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: ['100vh', '-100vh'],
            x: [0, Math.random() * 200 - 100],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

export default FloatingParticles
