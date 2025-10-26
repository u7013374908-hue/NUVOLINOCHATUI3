import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './layout/Sidebar'
import ChatArea from './chat/ChatArea'
import UserProfile from './profile/UserProfile'
import ServerSettings from './server/ServerSettings'
import StickerPanel from './chat/StickerPanel'
import ShopPanel from './shop/ShopPanel'
import GamePanel from './games/GamePanel'
import PublicFeed from './feed/PublicFeed'
import OfficialServerPanel from './server/OfficialServerPanel'
import LevelProgress from './gamification/LevelProgress'
import FloatingParticles from './animations/FloatingParticles'
import { Settings, LogOut, Maximize2, ShoppingBag, Gamepad2, Sticker, Coins, Hash, Crown } from 'lucide-react'
import Button from './ui/Button'
import Avatar from './ui/Avatar'
import NotificationCenter from './notifications/NotificationCenter'

const MainApp: React.FC = () => {
  const { user, signOut } = useAuth()
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'settings'>('chat')
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showStickerPanel, setShowStickerPanel] = useState(false)
  const [showShopPanel, setShowShopPanel] = useState(false)
  const [showGamePanel, setShowGamePanel] = useState(false)
  const [showPublicFeed, setShowPublicFeed] = useState(false)
  const [showOfficialServer, setShowOfficialServer] = useState(false)
  const [userCoins, setUserCoins] = useState(0)
  const [userLevel, setUserLevel] = useState({ level: 1, xp: 0, xp_to_next_level: 100, total_xp: 0 })

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const handleStickerSelect = (sticker: any) => {
    // Logica per inviare sticker
    console.log('Sticker selezionato:', sticker)
    setShowStickerPanel(false)
  }

  const handleGifSelect = (gif: any) => {
    // Logica per inviare GIF
    console.log('GIF selezionata:', gif)
    setShowStickerPanel(false)
  }

  const handlePurchase = (item: any) => {
    // Logica per acquistare articolo
    console.log('Articolo acquistato:', item)
    setUserCoins(prev => prev - item.price)
  }

  const handleGift = (item: any, receiverId: string) => {
    // Logica per regalare articolo
    console.log('Articolo regalato:', item, 'a:', receiverId)
  }

  const handleStartGame = (gameId: string) => {
    // Logica per avviare gioco
    console.log('Gioco avviato:', gameId)
    setShowGamePanel(false)
  }

  const handleJoinGame = (sessionId: string) => {
    // Logica per unirsi a partita
    console.log('Unito a partita:', sessionId)
  }

  const handleJoinChannel = (channelId: string) => {
    // Logica per unirsi a canale
    console.log('Unito a canale:', channelId)
    setShowOfficialServer(false)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-nuvolino-50 via-white to-nuvolino-100 flex overflow-hidden relative">
      {/* Floating Particles */}
      <FloatingParticles enabled={true} count={6} />
      
      {/* Sidebar */}
      <Sidebar
        onChannelSelect={setSelectedChannel}
        selectedChannel={selectedChannel}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          className="bg-white/30 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-nuvolino-700 font-poppins">
              {currentView === 'chat' && selectedChannel ? 'Chat' : 
               currentView === 'profile' ? 'Profilo' : 
               currentView === 'settings' ? 'Impostazioni' : 'Nuvolino UI Chat'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* User Level */}
            <LevelProgress userLevel={userLevel} className="hidden lg:block" />

            {/* User Coins */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-semibold">{userCoins.toLocaleString()}</span>
            </div>

            {/* Sticker Panel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStickerPanel(true)}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <Sticker className="w-5 h-5" />
            </Button>

            {/* Shop Panel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShopPanel(true)}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>

            {/* Game Panel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGamePanel(true)}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <Gamepad2 className="w-5 h-5" />
            </Button>

            {/* Public Feed */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPublicFeed(true)}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <Hash className="w-5 h-5" />
            </Button>

            {/* Official Server */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOfficialServer(true)}
              className="text-nuvolino-600 hover:bg-nuvolino-100"
            >
              <Crown className="w-5 h-5" />
            </Button>

            {/* Notifiche */}
            <NotificationCenter />

            {/* Impostazioni */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView('settings')}
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>

            {/* Profilo utente */}
            <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
              <Avatar
                src={user?.avatar_url}
                alt={user?.username || 'User'}
                size="sm"
                status={user?.status || 'online'}
                onClick={() => setCurrentView('profile')}
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-cloud-700">{user?.username}</p>
                <p className="text-xs text-cloud-500 capitalize">{user?.status}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-red-500 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ChatArea
                  channelId={selectedChannel}
                  onChannelSelect={setSelectedChannel}
                />
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <UserProfile />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <ServerSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <StickerPanel
        isOpen={showStickerPanel}
        onClose={() => setShowStickerPanel(false)}
        onSelectSticker={handleStickerSelect}
        onSelectGif={handleGifSelect}
      />

      <ShopPanel
        isOpen={showShopPanel}
        onClose={() => setShowShopPanel(false)}
        userCoins={userCoins}
        onPurchase={handlePurchase}
        onGift={handleGift}
      />

      <GamePanel
        isOpen={showGamePanel}
        onClose={() => setShowGamePanel(false)}
        onStartGame={handleStartGame}
        onJoinGame={handleJoinGame}
      />

      <PublicFeed
        isOpen={showPublicFeed}
        onClose={() => setShowPublicFeed(false)}
        currentUser={user}
      />

      <OfficialServerPanel
        isOpen={showOfficialServer}
        onClose={() => setShowOfficialServer(false)}
        onJoinChannel={handleJoinChannel}
      />
    </div>
  )
}

export default MainApp
