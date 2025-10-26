import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Channel } from '../../lib/supabase'
import Button from '../ui/Button'
import { Hash, Volume2, Users, Settings, Phone, Video } from 'lucide-react'

interface ChatHeaderProps {
  channelId: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ channelId }) => {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [memberCount, setMemberCount] = useState(0)

  useEffect(() => {
    fetchChannelInfo()
  }, [channelId])

  const fetchChannelInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select(`
          *,
          server:servers(*)
        `)
        .eq('id', channelId)
        .single()

      if (error) {
        console.error('Error fetching channel:', error)
        return
      }

      setChannel(data)

      // Simula il conteggio dei membri (in una vera app, questo verrebbe dal database)
      setMemberCount(Math.floor(Math.random() * 50) + 10)
    } catch (error) {
      console.error('Error fetching channel:', error)
    }
  }

  const handleCall = (type: 'audio' | 'video') => {
    // Qui implementeresti la logica per le chiamate
    console.log(`Starting ${type} call in channel ${channelId}`)
  }

  if (!channel) {
    return (
      <div className="h-16 bg-white/20 backdrop-blur-sm border-b border-white/20 flex items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-cloud-200 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-cloud-200 rounded w-32 animate-pulse"></div>
            <div className="h-3 bg-cloud-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="h-16 bg-white/20 backdrop-blur-sm border-b border-white/20 flex items-center justify-between px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        {/* Channel Icon */}
        <div className="w-8 h-8 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
          {channel.type === 'text' ? (
            <Hash className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Channel Info */}
        <div>
          <h2 className="font-semibold text-cloud-800">
            {channel.name}
          </h2>
          <p className="text-sm text-cloud-600">
            {channel.type === 'text' ? 'Canale testuale' : 'Canale vocale'} • {memberCount} membri
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Member Count */}
        <Button
          variant="ghost"
          size="sm"
          className="text-cloud-600 hover:text-cloud-800"
        >
          <Users className="w-4 h-4 mr-2" />
          {memberCount}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="text-cloud-600 hover:text-cloud-800"
        >
          <Settings className="w-4 h-4" />
        </Button>

        {/* Call Buttons */}
        <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-white/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCall('audio')}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCall('video')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatHeader
