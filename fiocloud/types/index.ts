export interface Product {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
  price_options?: PriceOption[]
}

export interface PriceOption {
  id: string
  product_id: string
  name: string
  price: number
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Settings {
  id: string
  site_name: string
  site_description: string
  whatsapp_number: string
  email: string
  logo_url: string
  music_url: string
  hero_badge_text: string
  hero_subtitle: string
  hero_description: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  title: string
  description: string
  image_url: string
  price_options: {
    name: string
    price: number
    is_default: boolean
  }[]
}

export interface SettingsFormData {
  site_name: string
  site_description: string
  whatsapp_number: string
  email: string
  logo_url: string
  music_url: string
  hero_badge_text: string
  hero_subtitle: string
  hero_description: string
}

export interface BackupData {
  products: Product[]
  price_options: PriceOption[]
  settings: Settings
  timestamp: string
  version: string
}
