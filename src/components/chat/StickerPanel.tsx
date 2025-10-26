import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sticker, StickerPack, GifData } from '../../types/sticker'
import { searchGifs, getTrendingGifs } from '../../services/giphy'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Search, Heart, Star, Clock, X } from 'lucide-react'

interface StickerPanelProps {
  isOpen: boolean
  onClose: () => void
  onSelectSticker: (sticker: Sticker) => void
  onSelectGif: (gif: GifData) => void
}

const StickerPanel: React.FC<StickerPanelProps> = ({
  isOpen,
  onClose,
  onSelectSticker,
  onSelectGif
}) => {
  const [activeTab, setActiveTab] = useState<'stickers' | 'gifs'>('stickers')
  const [searchQuery, setSearchQuery] = useState('')
  const [gifs, setGifs] = useState<GifData[]>([])
  const [recentStickers, setRecentStickers] = useState<Sticker[]>([])
  const [favoriteStickers, setFavoriteStickers] = useState<Sticker[]>([])
  const [loading, setLoading] = useState(false)

  // Sticker packs predefiniti
  const defaultStickerPacks: StickerPack[] = [
    {
      id: 'nuvolino-basic',
      name: 'Nuvolino Base',
      description: 'Sticker gratuiti di Nuvolino',
      thumbnail: '/stickers/nuvolino-pack-thumb.png',
      price: 0,
      is_premium: false,
      is_owned: true,
      created_at: new Date().toISOString(),
      stickers: [
        {
          id: 'nuvolino-happy',
          url: '/stickers/nuvolino-happy.png',
          pack_name: 'Nuvolino Base',
          tags: ['happy', 'nuvolino', 'cute'],
          animated: false
        },
        {
          id: 'nuvolino-sad',
          url: '/stickers/nuvolino-sad.png',
          pack_name: 'Nuvolino Base',
          tags: ['sad', 'nuvolino', 'cute'],
          animated: false
        },
        {
          id: 'nuvolino-excited',
          url: '/stickers/nuvolino-excited.gif',
          pack_name: 'Nuvolino Base',
          tags: ['excited', 'nuvolino', 'cute'],
          animated: true
        }
      ]
    },
    {
      id: 'emotions',
      name: 'Emozioni',
      description: 'Sticker per esprimere le tue emozioni',
      thumbnail: '/stickers/emotions-pack-thumb.png',
      price: 50,
      is_premium: false,
      is_owned: false,
      created_at: new Date().toISOString(),
      stickers: [
        {
          id: 'love',
          url: '/stickers/love.png',
          pack_name: 'Emozioni',
          tags: ['love', 'heart', 'emotion'],
          animated: false
        },
        {
          id: 'laugh',
          url: '/stickers/laugh.gif',
          pack_name: 'Emozioni',
          tags: ['laugh', 'funny', 'emotion'],
          animated: true
        }
      ]
    }
  ]

  useEffect(() => {
    if (activeTab === 'gifs' && gifs.length === 0) {
      loadTrendingGifs()
    }
  }, [activeTab])

  const loadTrendingGifs = async () => {
    setLoading(true)
    try {
      const trendingGifs = await getTrendingGifs(20)
      setGifs(trendingGifs)
    } catch (error) {
      console.error('Error loading trending GIFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchGifsHandler = async (query: string) => {
    if (!query.trim()) {
      loadTrendingGifs()
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchGifs({ query, limit: 20 })
      setGifs(searchResults)
    } catch (error) {
      console.error('Error searching GIFs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStickerSelect = (sticker: Sticker) => {
    onSelectSticker(sticker)
    // Aggiungi ai recenti
    setRecentStickers(prev => {
      const filtered = prev.filter(s => s.id !== sticker.id)
      return [sticker, ...filtered].slice(0, 20)
    })
  }

  const handleGifSelect = (gif: GifData) => {
    onSelectGif(gif)
  }

  const toggleFavorite = (sticker: Sticker) => {
    setFavoriteStickers(prev => {
      const isFavorite = prev.some(s => s.id === sticker.id)
      if (isFavorite) {
        return prev.filter(s => s.id !== sticker.id)
      } else {
        return [...prev, sticker]
      }
    })
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-cloud-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-nuvolino-700">
              Sticker e GIF
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'stickers' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('stickers')}
            >
              Sticker
            </Button>
            <Button
              variant={activeTab === 'gifs' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('gifs')}
            >
              GIF
            </Button>
          </div>

          {/* Search */}
          {activeTab === 'gifs' && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cloud-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cerca GIF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchGifsHandler(searchQuery)}
                  className="w-full pl-10 pr-4 py-2 border border-cloud-200 rounded-xl focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'stickers' ? (
            <div className="space-y-6">
              {/* Recent Stickers */}
              {recentStickers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-cloud-700 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recenti
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {recentStickers.map((sticker) => (
                      <motion.div
                        key={sticker.id}
                        className="aspect-square bg-cloud-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cloud-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStickerSelect(sticker)}
                      >
                        <img
                          src={sticker.url}
                          alt={sticker.id}
                          className="w-8 h-8 object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorite Stickers */}
              {favoriteStickers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-cloud-700 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Preferiti
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {favoriteStickers.map((sticker) => (
                      <motion.div
                        key={sticker.id}
                        className="aspect-square bg-cloud-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cloud-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStickerSelect(sticker)}
                      >
                        <img
                          src={sticker.url}
                          alt={sticker.id}
                          className="w-8 h-8 object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticker Packs */}
              {defaultStickerPacks.map((pack) => (
                <div key={pack.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-cloud-700">
                      {pack.name}
                    </h4>
                    {!pack.is_owned && (
                      <span className="text-xs text-nuvolino-600 font-medium">
                        {pack.price} NuvoCoins
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {pack.stickers.map((sticker) => (
                      <motion.div
                        key={sticker.id}
                        className="aspect-square bg-cloud-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cloud-200 transition-colors relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStickerSelect(sticker)}
                      >
                        <img
                          src={sticker.url}
                          alt={sticker.id}
                          className="w-8 h-8 object-contain"
                        />
                        <button
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(sticker)
                          }}
                        >
                          <Heart className={`w-3 h-3 ${
                            favoriteStickers.some(s => s.id === sticker.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-cloud-400'
                          }`} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-nuvolino-200 border-t-nuvolino-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {gifs.map((gif) => (
                    <motion.div
                      key={gif.id}
                      className="aspect-square bg-cloud-100 rounded-xl overflow-hidden cursor-pointer hover:bg-cloud-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGifSelect(gif)}
                    >
                      <img
                        src={gif.preview_url}
                        alt={gif.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default StickerPanel
