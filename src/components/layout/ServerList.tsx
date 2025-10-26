import React from 'react'
import { motion } from 'framer-motion'
import { Server } from '../../lib/supabase'
import Button from '../ui/Button'
import { Hash, Volume2 } from 'lucide-react'

interface ServerListProps {
  servers: Server[]
  selectedServer: string | null
  onServerSelect: (serverId: string) => void
}

const ServerList: React.FC<ServerListProps> = ({
  servers,
  selectedServer,
  onServerSelect
}) => {
  return (
    <div className="space-y-2">
      {servers.map((server) => (
        <motion.div
          key={server.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant={selectedServer === server.id ? 'primary' : 'ghost'}
            onClick={() => onServerSelect(server.id)}
            className="w-full justify-start text-left p-3 h-auto"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {server.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{server.name}</p>
                {server.description && (
                  <p className="text-xs text-cloud-500 truncate">
                    {server.description}
                  </p>
                )}
              </div>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

export default ServerList
