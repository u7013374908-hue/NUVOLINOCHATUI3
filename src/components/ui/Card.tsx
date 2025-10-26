import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated'
  hover?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false
}) => {
  const variants = {
    default: 'bg-white shadow-md border border-cloud-200',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg',
    elevated: 'bg-white shadow-xl border border-cloud-100'
  }

  return (
    <motion.div
      className={`
        rounded-2xl p-6 transition-all duration-300
        ${variants[variant]}
        ${hover ? 'hover:shadow-lg hover:scale-105' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={hover ? { scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  )
}

export default Card
