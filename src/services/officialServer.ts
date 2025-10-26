// Servizio per la gestione del server ufficiale Nuvolino HQ
import { supabase } from '../lib/supabase'

export interface OfficialServer {
  id: string
  name: string
  description: string
  icon_url: string
  owner_id: string
  is_official: boolean
  is_deletable: boolean
  member_count: number
  created_at: string
}

export interface OfficialChannel {
  id: string
  server_id: string
  name: string
  type: 'text' | 'voice' | 'stage' | 'forum'
  description?: string
  position: number
  is_readonly: boolean
  is_private: boolean
  required_level?: number
  created_at: string
}

export interface OfficialRole {
  id: string
  server_id: string
  name: string
  color: string
  permissions: {
    manage_channels: boolean
    manage_roles: boolean
    kick_members: boolean
    ban_members: boolean
    delete_messages: boolean
    mention_everyone: boolean
    manage_webhooks: boolean
    view_audit_log: boolean
  }
  position: number
  created_at: string
}

// Crea il server ufficiale Nuvolino HQ
export const createOfficialServer = async (): Promise<OfficialServer> => {
  const officialServer = {
    id: 'nuvolino-official-hq',
    name: '🐾 Nuvolino HQ',
    description: 'Il server ufficiale della community Nuvolino! Qui tutti si conoscono e si aiutano ☁️',
    icon_url: '/icons/nuvolino-official.png',
    owner_id: 'system',
    is_official: true,
    is_deletable: false,
    member_count: 0,
    created_at: new Date().toISOString()
  }

  try {
    const { data, error } = await supabase
      .from('servers')
      .upsert(officialServer)
      .select()
      .single()

    if (error) {
      console.error('Errore nella creazione del server ufficiale:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Errore nella creazione del server ufficiale:', error)
    throw error
  }
}

// Crea i canali predefiniti del server ufficiale
export const createOfficialChannels = async (serverId: string): Promise<OfficialChannel[]> => {
  const channels: Omit<OfficialChannel, 'id' | 'created_at'>[] = [
    {
      server_id: serverId,
      name: 'annunci',
      type: 'text',
      description: 'Aggiornamenti ufficiali e notizie importanti',
      position: 0,
      is_readonly: true,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'benvenuto',
      type: 'text',
      description: 'Saluta i nuovi membri della community',
      position: 1,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'presentazioni',
      type: 'text',
      description: 'Presentati alla community',
      position: 2,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'chat-generale',
      type: 'text',
      description: 'Conversazioni aperte e chiacchiere',
      position: 3,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'supporto',
      type: 'text',
      description: 'Aiuto tecnico e assistenza',
      position: 4,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'creatività',
      type: 'text',
      description: 'Condividi le tue creazioni',
      position: 5,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'sala-giochi',
      type: 'text',
      description: 'Organizza partite e sfide',
      position: 6,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'Sala Vocale Nuvola',
      type: 'voice',
      description: 'Sempre aperto per chiacchierare',
      position: 7,
      is_readonly: false,
      is_private: false
    },
    {
      server_id: serverId,
      name: 'Eventi Speciali',
      type: 'stage',
      description: 'Eventi live e presentazioni',
      position: 8,
      is_readonly: false,
      is_private: false
    }
  ]

  try {
    const { data, error } = await supabase
      .from('channels')
      .insert(channels)
      .select()

    if (error) {
      console.error('Errore nella creazione dei canali ufficiali:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Errore nella creazione dei canali ufficiali:', error)
    throw error
  }
}

// Crea i ruoli predefiniti del server ufficiale
export const createOfficialRoles = async (serverId: string): Promise<OfficialRole[]> => {
  const roles: Omit<OfficialRole, 'id' | 'created_at'>[] = [
    {
      server_id: serverId,
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
      position: 100
    },
    {
      server_id: serverId,
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
      position: 90
    },
    {
      server_id: serverId,
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
      position: 50
    },
    {
      server_id: serverId,
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
      position: 40
    },
    {
      server_id: serverId,
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
      position: 30
    },
    {
      server_id: serverId,
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
      position: 20
    },
    {
      server_id: serverId,
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
      position: 10
    },
    {
      server_id: serverId,
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
      position: 0
    }
  ]

  try {
    const { data, error } = await supabase
      .from('roles')
      .insert(roles)
      .select()

    if (error) {
      console.error('Errore nella creazione dei ruoli ufficiali:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Errore nella creazione dei ruoli ufficiali:', error)
    throw error
  }
}

// Aggiungi utente al server ufficiale
export const addUserToOfficialServer = async (userId: string): Promise<void> => {
  try {
    // Aggiungi l'utente al server
    const { error: memberError } = await supabase
      .from('server_members')
      .insert({
        server_id: 'nuvolino-official-hq',
        user_id: userId,
        joined_at: new Date().toISOString()
      })

    if (memberError) {
      console.error('Errore nell\'aggiunta dell\'utente al server:', memberError)
      throw memberError
    }

    // Assegna il ruolo base
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: 'nuvolino-friend-role', // ID del ruolo base
        assigned_at: new Date().toISOString()
      })

    if (roleError) {
      console.error('Errore nell\'assegnazione del ruolo:', roleError)
      throw roleError
    }
  } catch (error) {
    console.error('Errore nell\'aggiunta dell\'utente al server ufficiale:', error)
    throw error
  }
}

// Inizializza il server ufficiale completo
export const initializeOfficialServer = async (): Promise<{
  server: OfficialServer
  channels: OfficialChannel[]
  roles: OfficialRole[]
}> => {
  try {
    // Crea il server
    const server = await createOfficialServer()
    
    // Crea i canali
    const channels = await createOfficialChannels(server.id)
    
    // Crea i ruoli
    const roles = await createOfficialRoles(server.id)

    return { server, channels, roles }
  } catch (error) {
    console.error('Errore nell\'inizializzazione del server ufficiale:', error)
    throw error
  }
}

// Ottieni statistiche del server ufficiale
export const getOfficialServerStats = async (): Promise<{
  member_count: number
  online_count: number
  messages_today: number
  games_played: number
  voice_users: number
}> => {
  try {
    // Mock data per le statistiche
    return {
      member_count: 1250,
      online_count: 45,
      messages_today: 342,
      games_played: 28,
      voice_users: 12
    }
  } catch (error) {
    console.error('Errore nel recupero delle statistiche:', error)
    throw error
  }
}
