export interface Product {
  id: string
  title: string
  description: string
  imageUrl: string
  price: number
  audioUrl?: string
  createdAt: Date
}

export interface ProductFormData {
  title: string
  description: string
  imageUrl: string
  price: number
  audioUrl?: string
}
