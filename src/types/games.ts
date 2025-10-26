export interface Game {
  id: string
  name: string
  description: string
  icon: string
  maxPlayers: number
  minPlayers: number
  estimatedDuration: number // in seconds
  category: 'puzzle' | 'action' | 'trivia' | 'strategy' | 'casual'
  isMultiplayer: boolean
  rules: string[]
}

export interface GameSession {
  id: string
  game_id: string
  players: string[] // user_ids
  game_state: any
  status: 'waiting' | 'active' | 'finished' | 'cancelled'
  winner_id?: string
  score: Record<string, number>
  created_at: string
  started_at?: string
  ended_at?: string
}

export interface GameLeaderboard {
  game_id: string
  user_id: string
  username: string
  avatar_url?: string
  score: number
  rank: number
  games_played: number
  win_rate: number
  best_score: number
  last_played: string
}

export interface GameAchievement {
  id: string
  game_id: string
  name: string
  description: string
  icon: string
  condition: {
    type: 'score' | 'games_played' | 'win_streak' | 'time_played'
    value: number
  }
  reward: {
    type: 'coins' | 'badge' | 'title'
    amount?: number
    item_id?: string
  }
  is_unlocked: boolean
  unlocked_at?: string
}

export interface GameInvite {
  id: string
  game_id: string
  inviter_id: string
  inviter_username: string
  invited_user_id: string
  message?: string
  expires_at: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  created_at: string
}

export interface GameStats {
  user_id: string
  total_games_played: number
  total_wins: number
  total_score: number
  favorite_game: string
  average_score: number
  win_rate: number
  longest_win_streak: number
  current_win_streak: number
  time_played: number // in seconds
  achievements_unlocked: number
  total_achievements: number
}
