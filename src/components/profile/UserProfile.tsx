import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Avatar from '../ui/Avatar'
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react'

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await updateProfile({
        username: formData.username,
        bio: formData.bio
      })

      if (error) {
        console.error('Error updating profile:', error)
        return
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="glass" className="backdrop-blur-xl">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar
                  src={user?.avatar_url}
                  alt={user?.username || 'User'}
                  size="xl"
                  status={user?.status || 'online'}
                />
                {isEditing && (
                  <motion.button
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-nuvolino-500 text-white rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              <h1 className="text-2xl font-bold text-nuvolino-700 mb-2 font-poppins">
                {user?.username}
              </h1>
              
              <div className="flex items-center justify-center space-x-2 text-cloud-600 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  user?.status === 'online' ? 'bg-green-400' :
                  user?.status === 'away' ? 'bg-yellow-400' :
                  user?.status === 'busy' ? 'bg-red-400' :
                  'bg-cloud-400'
                }`} />
                <span className="text-sm capitalize">{user?.status}</span>
              </div>

              {user?.bio && (
                <p className="text-cloud-700 mb-4">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center justify-center space-x-4 text-sm text-cloud-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Membro dal {user?.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="glass" className="backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-nuvolino-700 font-poppins">
                Informazioni Profilo
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-nuvolino-600 hover:text-nuvolino-700"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </Button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nome Utente"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                disabled={!isEditing}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="Email"
                value={formData.email}
                onChange={() => {}} // Email non modificabile
                disabled={true}
                icon={<Mail className="w-5 h-5" />}
              />

              <div>
                <label className="block text-sm font-medium text-cloud-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border-2 border-cloud-200 focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100 bg-white/50 backdrop-blur-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Raccontaci qualcosa di te..."
                />
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
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Salvando...' : 'Salva'}
                  </Button>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="glass" className="backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-nuvolino-700 mb-4 font-poppins">
              Statistiche
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/20 rounded-xl">
                <div className="text-2xl font-bold text-nuvolino-600">42</div>
                <div className="text-sm text-cloud-600">Messaggi inviati</div>
              </div>
              <div className="text-center p-4 bg-white/20 rounded-xl">
                <div className="text-2xl font-bold text-nuvolino-600">8</div>
                <div className="text-sm text-cloud-600">Amici</div>
              </div>
              <div className="text-center p-4 bg-white/20 rounded-xl">
                <div className="text-2xl font-bold text-nuvolino-600">3</div>
                <div className="text-sm text-cloud-600">Server</div>
              </div>
              <div className="text-center p-4 bg-white/20 rounded-xl">
                <div className="text-2xl font-bold text-nuvolino-600">15</div>
                <div className="text-sm text-cloud-600">Giorni attivi</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
