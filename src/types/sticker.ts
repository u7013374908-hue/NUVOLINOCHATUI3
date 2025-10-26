export interface Sticker {
  id: string
  url: string
  pack_name: string
  tags: string[]
  animated: boolean
  width?: number
  height?: number
}

export interface StickerPack {
  id: string
  name: string
  description: string
  thumbnail: string
  stickers: Sticker[]
  price: number
  is_premium: boolean
  is_owned: boolean
  created_at: string
}

export interface GifData {
  id: string
  url: string
  title: string
  width: number
  height: number
  preview_url: string
  source: 'giphy' | 'tenor' | 'custom'
}

export interface StickerUsage {
  sticker_id: string
  user_id: string
  used_count: number
  last_used: string
}

export interface RecentSticker {
  sticker: Sticker
  used_at: string
  count: number
}
