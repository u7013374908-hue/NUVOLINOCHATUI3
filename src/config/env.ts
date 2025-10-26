// Configurazione delle variabili d'ambiente
export const config = {
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || 'https://uakkgovmkpnupgsamhzc.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2tnb3Zta3BucHVnc2FtaHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDM1MzksImV4cCI6MjA3Njc3OTUzOX0.VnvWEX5SRd7PZNyRrMWdT_Km2_Od1n09gSdGdssMKjU'
  },
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Nuvolino UI Chat',
    version: process.env.REACT_APP_APP_VERSION || '1.0.0',
    description: process.env.REACT_APP_APP_DESCRIPTION || 'Piattaforma sociale in tempo reale con tema Nuvolino'
  },
  features: {
    enableNotifications: true,
    enableWebRTC: true,
    enableFileUpload: true,
    enableVoiceMessages: true,
    enableReactions: true
  },
  performance: {
    messageLimit: 50,
    imageMaxSize: 5 * 1024 * 1024, // 5MB
    videoMaxSize: 50 * 1024 * 1024, // 50MB
    debounceDelay: 300,
    throttleDelay: 100
  }
}

export default config
