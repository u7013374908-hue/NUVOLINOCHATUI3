import React from 'react'
import { motion } from 'framer-motion'

interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
  onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className = '',
  onClick
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-cloud-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400'
  }

  return (
    <motion.div
      className={`relative ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 shadow-lg">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-nuvolino-600 font-semibold">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      {status && (
        <motion.div
          className={`
            absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
            ${statusColors[status]}
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
        />
      )}
    </motion.div>
  )
}

export default Avatar
