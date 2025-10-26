import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono')
      return false
    }
    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri')
      return false
    }
    if (formData.username.length < 3) {
      setError('Il nome utente deve essere di almeno 3 caratteri')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    const { error } = await signUp(formData.email, formData.password, formData.username)
    
    if (error) {
      setError(error.message || 'Errore durante la registrazione')
    }
    
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card variant="glass" className="backdrop-blur-xl">
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl">🐶</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-nuvolino-700 mb-2 font-poppins">
            Unisciti alla Nuvola!
          </h2>
          <p className="text-cloud-600 font-nunito">
            Crea il tuo account e incontra Nuvolino
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="username"
            placeholder="Nome utente"
            value={formData.username}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="La tua email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cloud-400 hover:text-cloud-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Conferma password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cloud-400 hover:text-cloud-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <motion.div
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creando account...' : 'Registrati'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-cloud-600">
            Hai già un account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-nuvolino-600 hover:text-nuvolino-700 font-medium transition-colors"
            >
              Accedi qui
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export default RegisterForm
