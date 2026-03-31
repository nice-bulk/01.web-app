export type TagCategory = '落ち込み' | '前向き' | 'モヤモヤ' | '穏やか' | 'テンション'

export type Tag = {
  id: string
  label: string
  category: TagCategory
}

export type Song = {
  id: string
  title: string
  artist: string
  reason: string
  spotifyUrl?: string
  youtubeUrl?: string
  tags: string[]
}
