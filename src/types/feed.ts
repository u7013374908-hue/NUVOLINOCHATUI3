export interface PublicPost {
  id: string
  author_id: string
  content: string
  media_urls: string[]
  likes_count: number
  comments_count: number
  shares_count: number
  is_pinned: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
  author?: {
    id: string
    username: string
    avatar_url?: string
    display_name?: string
    is_verified: boolean
    level: number
    badges: string[]
  }
  hashtags?: string[]
  mentions?: string[]
  is_liked?: boolean
  is_shared?: boolean
}

export interface PostComment {
  id: string
  post_id: string
  author_id: string
  content: string
  likes_count: number
  created_at: string
  updated_at: string
  author?: {
    id: string
    username: string
    avatar_url?: string
    display_name?: string
    is_verified: boolean
  }
  is_liked?: boolean
}

export interface PostLike {
  post_id: string
  user_id: string
  created_at: string
}

export interface PostShare {
  post_id: string
  user_id: string
  created_at: string
  comment?: string
}

export interface Hashtag {
  name: string
  posts_count: number
  trending_score: number
  created_at: string
}

export interface FeedFilter {
  type: 'all' | 'following' | 'trending' | 'verified'
  hashtag?: string
  user_id?: string
}

export interface ModerationResult {
  is_approved: boolean
  confidence: number
  categories: string[]
  reasons: string[]
  suggested_action: 'approve' | 'flag' | 'hide' | 'delete'
}

export interface AIModeration {
  post_id: string
  content_analysis: {
    toxicity: number
    spam: number
    inappropriate: number
    hate_speech: number
  }
  image_analysis?: {
    nsfw: number
    violence: number
    inappropriate: number
  }
  moderation_result: ModerationResult
  created_at: string
}
