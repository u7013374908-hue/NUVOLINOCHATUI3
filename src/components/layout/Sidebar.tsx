import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, Server, Channel } from '../../lib/supabase'
import ServerList from './ServerList'
import ChannelList from './ChannelList'
import { Plus, Hash, Volume2 } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface SidebarProps {
  onChannelSelect: (channelId: string) => void
  selectedChannel: string | null
  onViewChange: (view: 'chat' | 'profile' | 'settings') => void
  currentView: 'chat' | 'profile' | 'settings'
}

const Sidebar: React.FC<SidebarProps> = ({
  onChannelSelect,
  selectedChannel,
  onViewChange,
  currentView
}) => {
  const [servers, setServers] = useState<Server[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [showCreateServer, setShowCreateServer] = useState(false)

  useEffect(() => {
    fetchServers()
  }, [])

  useEffect(() => {
    if (selectedServer) {
      fetchChannels(selectedServer)
    }
  }, [selectedServer])

  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching servers:', error)
        return
      }

      setServers(data || [])
      
      // Seleziona il primo server di default
      if (data && data.length > 0) {
        setSelectedServer(data[0].id)
      }
    } catch (error) {
      console.error('Error fetching servers:', error)
    }
  }

  const fetchChannels = async (serverId: string) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('position', { ascending: true })

      if (error) {
        console.error('Error fetching channels:', error)
        return
      }

      setChannels(data || [])
    } catch (error) {
      console.error('Error fetching channels:', error)
    }
  }

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId)
    onViewChange('chat')
  }

  const handleChannelSelect = (channelId: string) => {
    onChannelSelect(channelId)
    onViewChange('chat')
  }

  return (
    <div className="w-80 bg-white/20 backdrop-blur-md border-r border-white/20 flex flex-col">
      {/* Server List */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-nuvolino-700 font-poppins">
            Server
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreateServer(true)}
            className="text-nuvolino-600 hover:text-nuvolino-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <ServerList
          servers={servers}
          selectedServer={selectedServer}
          onServerSelect={handleServerSelect}
        />
      </div>

      {/* Channel List */}
      {selectedServer && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-cloud-700">
              Canali
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-cloud-600 hover:text-cloud-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ChannelList
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelSelect={handleChannelSelect}
          />
        </div>
      )}

      {/* Create Server Modal */}
      <AnimatePresence>
        {showCreateServer && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateServer(false)}
          >
            <motion.div
              className="w-full max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CreateServerForm onClose={() => setShowCreateServer(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente per creare un nuovo server
const CreateServerForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('servers')
        .insert({
          name: formData.name,
          description: formData.description,
          owner_id: user.id,
          invite_code: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating server:', error)
        return
      }

      // Crea il canale di benvenuto
      await supabase
        .from('channels')
        .insert({
          server_id: data.id,
          name: 'benvenuto',
          type: 'text',
          position: 0,
          created_at: new Date().toISOString()
        })

      onClose()
    } catch (error) {
      console.error('Error creating server:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card variant="glass" className="backdrop-blur-xl">
      <h3 className="text-xl font-bold text-nuvolino-700 mb-4 font-poppins">
        Crea Server
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cloud-700 mb-2">
            Nome Server
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100 bg-white/50 backdrop-blur-sm"
            placeholder="Nome del tuo server"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cloud-700 mb-2">
            Descrizione
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border-2 border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100 bg-white/50 backdrop-blur-sm resize-none"
            placeholder="Descrizione del server"
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creando...' : 'Crea'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Sidebar
