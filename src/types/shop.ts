export interface ShopItem {
  id: string
  name: string
  description: string
  price: number // in NuvoCoins
  type: 'sticker_pack' | 'theme' | 'badge' | 'emoji' | 'avatar_frame' | 'sound_effect'
  preview_url: string
  is_premium: boolean
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UserInventory {
  user_id: string
  item_id: string
  purchased_at: string
  item: ShopItem
}

export interface NuvoCoinsTransaction {
  id: string
  user_id: string
  amount: number
  type: 'earned' | 'spent' | 'gift' | 'refund'
  description: string
  created_at: string
}

export interface PremiumSubscription {
  id: string
  user_id: string
  plan: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  end_date: string
  auto_renew: boolean
  created_at: string
}

export interface ShopCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  item_count: number
}

export interface PurchaseHistory {
  id: string
  user_id: string
  item_id: string
  item_name: string
  price_paid: number
  purchase_date: string
  refunded: boolean
}

export interface GiftTransaction {
  id: string
  sender_id: string
  receiver_id: string
  item_id: string
  message: string
  sent_at: string
  received_at?: string
}
