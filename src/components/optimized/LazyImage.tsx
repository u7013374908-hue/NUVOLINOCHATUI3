import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createIntersectionObserver } from '../../utils/performance'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8vPjwvc3ZnPg==',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = createIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current && observer) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-nuvolino-100 to-nuvolino-200 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-8 h-8 border-2 border-nuvolino-300 border-t-nuvolino-500 rounded-full animate-spin" />
      </motion.div>

      {/* Image */}
      {isInView && (
        <motion.img
          src={hasError ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cloud-100 to-cloud-200 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-cloud-300 rounded-full flex items-center justify-center">
              <span className="text-2xl">📷</span>
            </div>
            <p className="text-cloud-600 text-sm">Immagine non disponibile</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default LazyImage
