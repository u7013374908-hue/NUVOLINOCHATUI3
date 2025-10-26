export interface UserLevel {
  user_id: string
  level: number
  xp: number
  xp_to_next_level: number
  total_xp: number
  prestige: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'social' | 'chat' | 'games' | 'server' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  condition: {
    type: 'xp' | 'messages' | 'friends' | 'servers' | 'games_won' | 'days_active' | 'custom'
    value: number
    description: string
  }
  reward: {
    coins: number
    badge?: string
    title?: string
    special_effect?: string
  }
  is_hidden: boolean
  created_at: string
}

export interface UserAchievement {
  user_id: string
  achievement_id: string
  unlocked_at: string
  progress: number
  is_completed: boolean
  achievement: Achievement
}

export interface DailyStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_login: string
  streak_bonus: number
}

export interface XPTransaction {
  id: string
  user_id: string
  amount: number
  source: 'message' | 'friend_added' | 'server_created' | 'game_won' | 'daily_login' | 'achievement' | 'bonus'
  description: string
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  color: string
  glow_effect: boolean
  animated: boolean
  requirements: {
    level?: number
    achievement_id?: string
    special_condition?: string
  }
}

export interface UserBadge {
  user_id: string
  badge_id: string
  earned_at: string
  is_equipped: boolean
  badge: Badge
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url?: string
  level: number
  xp: number
  rank: number
  badges_count: number
  achievements_count: number
}

export interface LevelReward {
  level: number
  rewards: {
    coins: number
    badge_id?: string
    title?: string
    special_perks?: string[]
  }
  description: string
}
