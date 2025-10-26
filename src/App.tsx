import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import StartupAnimation from './components/StartupAnimation'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import MainApp from './components/MainApp'
import './index.css'

const AuthWrapper: React.FC = () => {
  const { user, loading } = useAuth()
  const [showStartup, setShowStartup] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartup(false)
    }, 7000)

    return () => clearTimeout(timer)
  }, [])

  if (showStartup) {
    return <StartupAnimation onComplete={() => setShowStartup(false)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nuvolino-50 via-white to-nuvolino-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-nuvolino-200 border-t-nuvolino-500 rounded-full"></div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nuvolino-50 via-white to-nuvolino-100 flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    )
  }

  return <MainApp />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/*" element={<AuthWrapper />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
