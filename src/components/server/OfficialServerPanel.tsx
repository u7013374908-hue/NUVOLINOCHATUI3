import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OfficialServer, OfficialChannel, OfficialRole } from '../../types/server'
import { getOfficialServerStats } from '../../services/officialServer'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Crown, Shield, Star, Users, MessageCircle, Gamepad2, Volume2, Calendar, Trophy, Heart, Zap } from 'lucide-react'

interface OfficialServerPanelProps {
  isOpen: boolean
  onClose: () => void
  onJoinChannel: (channelId: string) => void
}

const OfficialServerPanel: React.FC<OfficialServerPanelProps> = ({
  isOpen,
  onClose,
  onJoinChannel
}) => {
  const [stats, setStats] = useState({
    member_count: 0,
    online_count: 0,
    messages_today: 0,
    games_played: 0,
    voice_users: 0
  })
  const [loading, setLoading] = useState(true)

  // Mock data per il server ufficiale
  const officialServer: OfficialServer = {
    id: 'nuvolino-official-hq',
    name: '🐾 Nuvolino HQ',
    description: 'Il server ufficiale della community Nuvolino! Qui tutti si conoscono e si aiutano ☁️',
    icon_url: '/icons/nuvolino-official.png',
    owner_id: 'system',
    is_official: true,
    is_deletable: false,
    member_count: 1250,
    created_at: '2025-01-01T00:00:00Z'
  }

  const channels: OfficialChannel[] = [
    {
      id: 'annunci',
      server_id: 'nuvolino-official-hq',
      name: '📢 annunci',
      type: 'text',
      description: 'Aggiornamenti ufficiali e notizie importanti',
      position: 0,
      is_readonly: true,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'benvenuto',
      server_id: 'nuvolino-official-hq',
      name: '🌤️ benvenuto',
      type: 'text',
      description: 'Saluta i nuovi membri della community',
      position: 1,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'presentazioni',
      server_id: 'nuvolino-official-hq',
      name: '👋 presentazioni',
      type: 'text',
      description: 'Presentati alla community',
      position: 2,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'chat-generale',
      server_id: 'nuvolino-official-hq',
      name: '💬 chat-generale',
      type: 'text',
      description: 'Conversazioni aperte e chiacchiere',
      position: 3,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'supporto',
      server_id: 'nuvolino-official-hq',
      name: '❓ supporto',
      type: 'text',
      description: 'Aiuto tecnico e assistenza',
      position: 4,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'creatività',
      server_id: 'nuvolino-official-hq',
      name: '🎨 creatività',
      type: 'text',
      description: 'Condividi le tue creazioni',
      position: 5,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'sala-giochi',
      server_id: 'nuvolino-official-hq',
      name: '🎮 sala-giochi',
      type: 'text',
      description: 'Organizza partite e sfide',
      position: 6,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'sala-vocale',
      server_id: 'nuvolino-official-hq',
      name: '🔊 Sala Vocale Nuvola',
      type: 'voice',
      description: 'Sempre aperto per chiacchierare',
      position: 7,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'eventi-speciali',
      server_id: 'nuvolino-official-hq',
      name: '🎉 Eventi Speciali',
      type: 'stage',
      description: 'Eventi live e presentazioni',
      position: 8,
      is_readonly: false,
      is_private: false,
      created_at: '2025-01-01T00:00:00Z'
    }
  ]

  const roles: OfficialRole[] = [
    {
      id: 'fondatore',
      server_id: 'nuvolino-official-hq',
      name: '👑 Fondatore',
      color: '#FFD700',
      permissions: {
        manage_channels: true,
        manage_roles: true,
        kick_members: true,
        ban_members: true,
        delete_messages: true,
        mention_everyone: true,
        manage_webhooks: true,
        view_audit_log: true
      },
      position: 100,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'staff',
      server_id: 'nuvolino-official-hq',
      name: '🛡️ Staff Nuvolino',
      color: '#FF6B9D',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: true,
        ban_members: false,
        delete_messages: true,
        mention_everyone: true,
        manage_webhooks: false,
        view_audit_log: true
      },
      position: 90,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'premium',
      server_id: 'nuvolino-official-hq',
      name: '⭐ Premium',
      color: '#E6E6FA',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 50,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'veterano',
      server_id: 'nuvolino-official-hq',
      name: '🔥 Veterano',
      color: '#FF4500',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 40,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'artista',
      server_id: 'nuvolino-official-hq',
      name: '🎨 Artista',
      color: '#9370DB',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 30,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'gamer',
      server_id: 'nuvolino-official-hq',
      name: '🎮 Gamer',
      color: '#00CED1',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 20,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'supporter',
      server_id: 'nuvolino-official-hq',
      name: '💎 Supporter',
      color: '#32CD32',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 10,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'nuvolino-friend',
      server_id: 'nuvolino-official-hq',
      name: '☁️ Nuvolino Friend',
      color: '#87CEEB',
      permissions: {
        manage_channels: false,
        manage_roles: false,
        kick_members: false,
        ban_members: false,
        delete_messages: false,
        mention_everyone: false,
        manage_webhooks: false,
        view_audit_log: false
      },
      position: 0,
      created_at: '2025-01-01T00:00:00Z'
    }
  ]

  useEffect(() => {
    const loadStats = async () => {
      try {
        const serverStats = await getOfficialServerStats()
        setStats(serverStats)
      } catch (error) {
        console.error('Errore nel caricamento delle statistiche:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <MessageCircle className="w-4 h-4" />
      case 'voice':
        return <Volume2 className="w-4 h-4" />
      case 'stage':
        return <Calendar className="w-4 h-4" />
      case 'forum':
        return <MessageCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
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
              <div className="w-12 h-12 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-nuvolino-700">
                  {officialServer.name}
                </h2>
                <p className="text-cloud-600">
                  {officialServer.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Crown className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-nuvolino-700">
                {stats.member_count.toLocaleString()}
              </div>
              <div className="text-xs text-cloud-600">Membri</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-2">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-nuvolino-700">
                {stats.online_count}
              </div>
              <div className="text-xs text-cloud-600">Online</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full mx-auto mb-2">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-nuvolino-700">
                {stats.messages_today}
              </div>
              <div className="text-xs text-cloud-600">Messaggi oggi</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full mx-auto mb-2">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-nuvolino-700">
                {stats.games_played}
              </div>
              <div className="text-xs text-cloud-600">In gioco</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full mx-auto mb-2">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-lg font-bold text-nuvolino-700">
                {stats.voice_users}
              </div>
              <div className="text-xs text-cloud-600">In vocale</div>
            </div>
          </div>
        </div>

        <div className="flex h-96">
          {/* Canali */}
          <div className="w-80 bg-cloud-50 p-4 border-r border-cloud-200">
            <h3 className="font-semibold text-cloud-700 mb-4">Canali</h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <motion.button
                  key={channel.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-cloud-100 transition-colors group"
                  onClick={() => onJoinChannel(channel.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-cloud-500 group-hover:text-nuvolino-600 transition-colors">
                      {getChannelIcon(channel.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-cloud-800 group-hover:text-nuvolino-700">
                        {channel.name}
                      </div>
                      <div className="text-xs text-cloud-500">
                        {channel.description}
                      </div>
                    </div>
                    {channel.is_readonly && (
                      <div className="text-xs text-cloud-400">Solo lettura</div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contenuto principale */}
          <div className="flex-1 p-6">
            <div className="space-y-6">
              {/* Benvenuto */}
              <Card className="p-6 bg-gradient-to-r from-nuvolino-50 to-white border-l-4 border-nuvolino-300">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🐶</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-nuvolino-700 mb-2">
                      Benvenuto nella Nuvola!
                    </h3>
                    <p className="text-cloud-700 mb-4">
                      Ciao! Sono Nuvolino, il cagnolino ufficiale di questa community. 
                      Sono felice di averti qui con noi! 🌈
                    </p>
                    <div className="space-y-2 text-sm text-cloud-600">
                      <p>☁️ Incontra nuovi amici</p>
                      <p>💬 Chattare con la community</p>
                      <p>🎮 Giocare insieme</p>
                      <p>🎨 Condividere le tue creazioni</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Regole */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-nuvolino-700 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Regole della Nuvola
                </h3>
                <div className="space-y-2 text-sm text-cloud-700">
                  <p>1. ❤️ Sii gentile e rispettoso con tutti</p>
                  <p>2. 🚫 Zero tolleranza per spam, insulti o molestie</p>
                  <p>3. 🔞 Niente contenuti NSFW o inappropriati</p>
                  <p>4. 🗣️ Usa i canali giusti per ogni argomento</p>
                  <p>5. 🚨 Segnala comportamenti sospetti allo staff</p>
                  <p>6. 🎭 No impersonificazione o fake account</p>
                  <p>7. 🔗 Link esterni solo se autorizzati</p>
                  <p>8. 🤖 Bot personali vietati senza permesso</p>
                  <p>9. 📢 Rispetta gli annunci ufficiali</p>
                  <p>10. ☁️ Divertiti e fai amicizia!</p>
                </div>
              </Card>

              {/* Ruoli */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-nuvolino-700 mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Ruoli e Badge
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {roles.slice(0, 6).map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-cloud-50"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-sm font-medium text-cloud-800">
                        {role.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Eventi */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-nuvolino-700 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Eventi Settimanali
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl">🧠</div>
                    <div>
                      <div className="font-medium text-cloud-800">Quiz Night</div>
                      <div className="text-sm text-cloud-600">Lunedì 20:00</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl">🎬</div>
                    <div>
                      <div className="font-medium text-cloud-800">Movie Night</div>
                      <div className="text-sm text-cloud-600">Mercoledì 21:00</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl">🎮</div>
                    <div>
                      <div className="font-medium text-cloud-800">Game Tournament</div>
                      <div className="text-sm text-cloud-600">Venerdì 19:00</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OfficialServerPanel
