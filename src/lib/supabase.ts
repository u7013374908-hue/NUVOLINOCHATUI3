import { createClient } from '@supabase/supabase-js'
import config from '../config/env'

const supabaseUrl = config.supabase.url
const supabaseAnonKey = config.supabase.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Tipi per il database
export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  status: 'online' | 'offline' | 'away' | 'busy'
  created_at: string
  updated_at: string
}

export interface Friend {
  id: string
  user_id: string
  friend_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
}

export interface Server {
  id: string
  name: string
  description?: string
  icon_url?: string
  owner_id: string
  invite_code: string
  created_at: string
  updated_at: string
}

export interface Channel {
  id: string
  server_id: string
  name: string
  type: 'text' | 'voice'
  position: number
  created_at: string
}

export interface Message {
  id: string
  channel_id?: string
  user_id: string
  content: string
  type: 'text' | 'image' | 'voice' | 'file'
  file_url?: string
  created_at: string
  updated_at: string
}

export interface Call {
  id: string
  caller_id: string
  receiver_id: string
  type: 'audio' | 'video'
  status: 'calling' | 'active' | 'ended'
  started_at: string
  ended_at?: string
}
