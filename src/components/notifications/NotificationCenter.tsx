import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../../hooks/useNotifications'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { Bell, X, Check, CheckCheck } from 'lucide-react'

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Ora'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m fa`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h fa`
    return date.toLocaleDateString('it-IT')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬'
      case 'call':
        return '📞'
      case 'friend_request':
        return '👋'
      case 'server_invite':
        return '🏠'
      default:
        return '🔔'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-12 w-80 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card variant="glass" className="backdrop-blur-xl p-0 max-h-96 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <h3 className="font-semibold text-nuvolino-700">
                  Notifiche
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Tutte
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
                      <Bell className="w-6 h-6 text-nuvolino-600" />
                    </div>
                    <p className="text-cloud-600 text-sm">
                      Nessuna notifica
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-nuvolino-50/30' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-cloud-800 text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-nuvolino-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-cloud-600 text-xs mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-cloud-400 text-xs mt-1">
                              {formatTime(notification.created_at)}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationCenter
