import React from 'react'
import { motion } from 'framer-motion'
import { Channel } from '../../lib/supabase'
import Button from '../ui/Button'
import { Hash, Volume2, Lock } from 'lucide-react'

interface ChannelListProps {
  channels: Channel[]
  selectedChannel: string | null
  onChannelSelect: (channelId: string) => void
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannel,
  onChannelSelect
}) => {
  const textChannels = channels.filter(channel => channel.type === 'text')
  const voiceChannels = channels.filter(channel => channel.type === 'voice')

  return (
    <div className="space-y-4">
      {/* Canali Testuali */}
      {textChannels.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-cloud-500 uppercase tracking-wider mb-2">
            Canali Testuali
          </h4>
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button
                  variant={selectedChannel === channel.id ? 'primary' : 'ghost'}
                  onClick={() => onChannelSelect(channel.id)}
                  className="w-full justify-start text-left p-2 h-auto text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Canali Vocali */}
      {voiceChannels.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-cloud-500 uppercase tracking-wider mb-2">
            Canali Vocali
          </h4>
          <div className="space-y-1">
            {voiceChannels.map((channel) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant={selectedChannel === channel.id ? 'primary' : 'ghost'}
                  onClick={() => onChannelSelect(channel.id)}
                  className="w-full justify-start text-left p-2 h-auto text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="truncate">{channel.name}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Messaggio se non ci sono canali */}
      {channels.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
            <Hash className="w-8 h-8 text-nuvolino-600" />
          </div>
          <p className="text-cloud-500 text-sm">
            Nessun canale disponibile
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default ChannelList
