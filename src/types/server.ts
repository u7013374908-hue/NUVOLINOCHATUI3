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
