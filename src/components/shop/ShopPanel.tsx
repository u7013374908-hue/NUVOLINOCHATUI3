import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShopItem, ShopCategory, UserInventory } from '../../types/shop'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { ShoppingBag, Star, Gift, Coins, X, Search, Filter } from 'lucide-react'

interface ShopPanelProps {
  isOpen: boolean
  onClose: () => void
  userCoins: number
  onPurchase: (item: ShopItem) => void
  onGift: (item: ShopItem, receiverId: string) => void
}

const ShopPanel: React.FC<ShopPanelProps> = ({
  isOpen,
  onClose,
  userCoins,
  onPurchase,
  onGift
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'newest'>('newest')
  const [showGiftModal, setShowGiftModal] = useState<ShopItem | null>(null)
  const [giftReceiver, setGiftReceiver] = useState('')

  const categories: ShopCategory[] = [
    { id: 'all', name: 'Tutto', description: 'Tutti gli articoli', icon: '🛍️', color: '#87CEEB', item_count: 0 },
    { id: 'stickers', name: 'Sticker', description: 'Pack di sticker', icon: '😊', color: '#FFB6C1', item_count: 0 },
    { id: 'themes', name: 'Temi', description: 'Temi personalizzati', icon: '🎨', color: '#B0E0B5', item_count: 0 },
    { id: 'badges', name: 'Badge', description: 'Badge esclusivi', icon: '🏆', color: '#FFF9C4', item_count: 0 },
    { id: 'emojis', name: 'Emoji', description: 'Emoji personalizzate', icon: '😀', color: '#E6E6FA', item_count: 0 },
    { id: 'frames', name: 'Cornici', description: 'Cornici avatar', icon: '🖼️', color: '#FFD700', item_count: 0 },
    { id: 'sounds', name: 'Suoni', description: 'Effetti sonori', icon: '🔊', color: '#FF6B9D', item_count: 0 }
  ]

  // Mock data per gli articoli del shop
  const shopItems: ShopItem[] = [
    {
      id: 'nuvolino-sticker-pack',
      name: 'Pack Nuvolino Completo',
      description: '20 sticker animati di Nuvolino per esprimere ogni emozione',
      price: 100,
      type: 'sticker_pack',
      preview_url: '/shop/nuvolino-pack-preview.png',
      is_premium: false,
      category: 'stickers',
      tags: ['nuvolino', 'cute', 'animated'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'premium-theme-dark',
      name: 'Tema Scuro Premium',
      description: 'Tema scuro elegante con accenti azzurro neon',
      price: 200,
      type: 'theme',
      preview_url: '/shop/dark-theme-preview.png',
      is_premium: true,
      category: 'themes',
      tags: ['dark', 'premium', 'elegant'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'founder-badge',
      name: 'Badge Fondatore',
      description: 'Badge esclusivo per i primi 100 membri',
      price: 0,
      type: 'badge',
      preview_url: '/shop/founder-badge.png',
      is_premium: false,
      category: 'badges',
      tags: ['exclusive', 'founder', 'rare'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'rainbow-avatar-frame',
      name: 'Cornice Arcobaleno',
      description: 'Cornice animata arcobaleno per il tuo avatar',
      price: 150,
      type: 'avatar_frame',
      preview_url: '/shop/rainbow-frame.gif',
      is_premium: false,
      category: 'frames',
      tags: ['rainbow', 'animated', 'colorful'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'notification-sound-woof',
      name: 'Suono "Woof"',
      description: 'Notifica personalizzata con il verso di Nuvolino',
      price: 80,
      type: 'sound_effect',
      preview_url: '/shop/woof-sound.png',
      is_premium: false,
      category: 'sounds',
      tags: ['nuvolino', 'woof', 'notification'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const [inventory, setInventory] = useState<UserInventory[]>([])
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>(shopItems)

  useEffect(() => {
    // Filtra articoli per categoria e ricerca
    let filtered = shopItems

    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Ordina
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [activeCategory, searchQuery, sortBy])

  const handlePurchase = (item: ShopItem) => {
    if (userCoins >= item.price) {
      onPurchase(item)
      setInventory(prev => [...prev, {
        user_id: 'current-user',
        item_id: item.id,
        purchased_at: new Date().toISOString(),
        item
      }])
    }
  }

  const handleGift = () => {
    if (showGiftModal && giftReceiver) {
      onGift(showGiftModal, giftReceiver)
      setShowGiftModal(null)
      setGiftReceiver('')
    }
  }

  const isOwned = (itemId: string) => {
    return inventory.some(inv => inv.item_id === itemId)
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-6xl mx-4 bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cloud-200 bg-gradient-to-r from-nuvolino-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-nuvolino-700">
                  Nuvolino Shop
                </h2>
                <p className="text-cloud-600">
                  Personalizza la tua esperienza con articoli esclusivi
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Coins */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full">
              <Coins className="w-5 h-5" />
              <span className="font-semibold">{userCoins.toLocaleString()}</span>
              <span className="text-sm">NuvoCoins</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-nuvolino-600"
            >
              <Gift className="w-4 h-4 mr-2" />
              Acquista Coins
            </Button>
          </div>
        </div>

        <div className="flex h-96">
          {/* Sidebar Categories */}
          <div className="w-64 bg-cloud-50 p-4 border-r border-cloud-200">
            <h3 className="font-semibold text-cloud-700 mb-4">Categorie</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-nuvolino-100 text-nuvolino-700 border-2 border-nuvolino-300'
                      : 'hover:bg-cloud-100 text-cloud-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-cloud-500">{category.item_count} articoli</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cloud-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cerca articoli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-cloud-200 rounded-xl focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-cloud-200 rounded-xl focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
              >
                <option value="newest">Più recenti</option>
                <option value="price">Prezzo</option>
                <option value="name">Nome</option>
              </select>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-200">
                    <div className="aspect-square bg-cloud-100 rounded-xl mb-3 overflow-hidden">
                      <img
                        src={item.preview_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-cloud-800">{item.name}</h4>
                        {item.is_premium && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <p className="text-sm text-cloud-600 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Coins className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-cloud-800">
                            {item.price === 0 ? 'Gratis' : item.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {isOwned(item.id) ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                              Posseduto
                            </span>
                          ) : (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handlePurchase(item)}
                                disabled={userCoins < item.price}
                              >
                                Acquista
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowGiftModal(item)}
                              >
                                <Gift className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Gift Modal */}
        <AnimatePresence>
          {showGiftModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold text-nuvolino-700 mb-4">
                  Regala "{showGiftModal.name}"
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cloud-700 mb-2">
                      Username del destinatario
                    </label>
                    <input
                      type="text"
                      value={giftReceiver}
                      onChange={(e) => setGiftReceiver(e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-2 border border-cloud-200 rounded-xl focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setShowGiftModal(null)}
                      className="flex-1"
                    >
                      Annulla
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleGift}
                      disabled={!giftReceiver.trim()}
                      className="flex-1"
                    >
                      Regala
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default ShopPanel
