import React from 'react'
import { motion } from 'framer-motion'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  icon
}) => {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-cloud-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cloud-400">
            {icon}
          </div>
        )}
        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
            bg-white/50 backdrop-blur-sm
            border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100
            placeholder-cloud-400 text-cloud-700
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}
          `}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
      </div>
      {error && (
        <motion.p
          className="text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

export default Input
