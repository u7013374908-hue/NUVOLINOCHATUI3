import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, Server } from '../../lib/supabase'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Settings, Users, Hash, Volume2, Plus, Trash2, Edit3 } from 'lucide-react'

const ServerSettings: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([])
  const [selectedServer, setSelectedServer] = useState<Server | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServers()
  }, [])

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
      if (data && data.length > 0) {
        setSelectedServer(data[0])
      }
    } catch (error) {
      console.error('Error fetching servers:', error)
    }
  }

  const handleServerSelect = (server: Server) => {
    setSelectedServer(server)
  }

  const handleDeleteServer = async (serverId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo server?')) return

    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId)

      if (error) {
        console.error('Error deleting server:', error)
        return
      }

      setServers(prev => prev.filter(s => s.id !== serverId))
      if (selectedServer?.id === serverId) {
        setSelectedServer(servers.length > 1 ? servers[0] : null)
      }
    } catch (error) {
      console.error('Error deleting server:', error)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-nuvolino-700 font-poppins">
                Impostazioni Server
              </h1>
              <p className="text-cloud-600">
                Gestisci i tuoi server e canali
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="glass" className="backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-nuvolino-700 font-poppins">
                  I Tuoi Server
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-nuvolino-600 hover:text-nuvolino-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {servers.map((server) => (
                  <motion.div
                    key={server.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant={selectedServer?.id === server.id ? 'primary' : 'ghost'}
                      onClick={() => handleServerSelect(server)}
                      className="w-full justify-start text-left p-3 h-auto"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {server.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{server.name}</p>
                          <p className="text-xs text-cloud-500 truncate">
                            {server.description || 'Nessuna descrizione'}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Server Details */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedServer ? (
              <ServerDetails
                server={selectedServer}
                onDelete={handleDeleteServer}
              />
            ) : (
              <Card variant="glass" className="backdrop-blur-xl">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-nuvolino-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-nuvolino-700 mb-2 font-poppins">
                    Seleziona un Server
                  </h3>
                  <p className="text-cloud-600">
                    Scegli un server dalla lista per visualizzare le impostazioni
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Componente per i dettagli del server
const ServerDetails: React.FC<{
  server: Server
  onDelete: (serverId: string) => void
}> = ({ server, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: server.name,
    description: server.description || ''
  })

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('servers')
        .update({
          name: formData.name,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', server.id)

      if (error) {
        console.error('Error updating server:', error)
        return
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating server:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: server.name,
      description: server.description || ''
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Server Info */}
      <Card variant="glass" className="backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-nuvolino-700 font-poppins">
            Informazioni Server
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-nuvolino-600 hover:text-nuvolino-700"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(server.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Nome Server"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
          />

          <div>
            <label className="block text-sm font-medium text-cloud-700 mb-2">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl border-2 border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100 bg-white/50 backdrop-blur-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
              placeholder="Descrizione del server..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-cloud-600">
            <div>
              <span className="font-medium">Codice Invito:</span>
              <p className="font-mono bg-cloud-100 px-2 py-1 rounded mt-1">
                {server.invite_code}
              </p>
            </div>
            <div>
              <span className="font-medium">Creato il:</span>
              <p className="mt-1">
                {new Date(server.created_at).toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>

          {isEditing && (
            <motion.div
              className="flex space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1"
              >
                Salva
              </Button>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Server Stats */}
      <Card variant="glass" className="backdrop-blur-xl">
        <h4 className="text-lg font-semibold text-nuvolino-700 mb-4 font-poppins">
          Statistiche Server
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold text-nuvolino-600">12</div>
            <div className="text-sm text-cloud-600">Membri</div>
          </div>
          <div className="text-center p-4 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold text-nuvolino-600">5</div>
            <div className="text-sm text-cloud-600">Canali</div>
          </div>
          <div className="text-center p-4 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold text-nuvolino-600">156</div>
            <div className="text-sm text-cloud-600">Messaggi</div>
          </div>
          <div className="text-center p-4 bg-white/20 rounded-xl">
            <div className="text-2xl font-bold text-nuvolino-600">7</div>
            <div className="text-sm text-cloud-600">Giorni attivi</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ServerSettings
