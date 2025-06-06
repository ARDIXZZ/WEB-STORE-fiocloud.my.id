"use client"

import type { Product, ProductFormData } from "@/types/product"
import { generateId } from "./utils"

// Local storage keys
const PRODUCTS_KEY = "fiocloud-products"
const PROFILE_KEY = "fiocloud-profile"
const AUDIO_KEY = "fiocloud-audio"

// Default profile data
const defaultProfile = {
  logoUrl: "https://placehold.co/400x400/22d3ee/ffffff?text=FioCloud",
  bannerAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
}

// Initialize local storage (client-side only)
export function initializeLocalStorage() {
  if (typeof window === "undefined") return

  // Initialize products if not exists
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    const defaultProducts: Product[] = [
      {
        id: generateId(),
        title: "Panel Pterodactyl Server Private",
        description: "Panel Server Private Mulai Dari Ram 8-unli",
        imageUrl: "https://placehold.co/400x400/f97316/ffffff?text=Panel+Server",
        price: 7000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        createdAt: new Date(),
      },
      {
        id: generateId(),
        title: "Reseller Panel Private",
        description: "Benefit: Bisa Jualan Panel Private, Bisa Membuat Server Untuk Sendiri.",
        imageUrl: "https://placehold.co/400x400/f97316/ffffff?text=Reseller+Panel",
        price: 15000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        createdAt: new Date(),
      },
      {
        id: generateId(),
        title: "Script Bugs Strarey V3.2",
        description: "Efek DelayMaker, Force Close No Click, DelayInvisible, Func New.",
        imageUrl: "https://placehold.co/400x400/ef4444/ffffff?text=Script+Bugs",
        price: 40000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        createdAt: new Date(),
      },
      {
        id: generateId(),
        title: "Jasa Install Panel",
        description: "Benefit: Free Req Hostname, Free Node 20+.",
        imageUrl: "https://placehold.co/400x400/3b82f6/ffffff?text=Install+Panel",
        price: 10000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        createdAt: new Date(),
      },
      {
        id: generateId(),
        title: "Jasa Rename Sc Sampai Akar",
        description: "Sc Biasa: Rp5.000, Sc Md: Rp8.000.",
        imageUrl: "https://placehold.co/400x400/ef4444/ffffff?text=Rename+Sc",
        price: 5000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        createdAt: new Date(),
      },
      {
        id: generateId(),
        title: "P.O JUSTIN V18",
        description:
          "PRICE JUSTIN V17 FASE 2 : 45K.PRICE PO SC : 50K.PRICE PO SC FREE UP 1X : 75K.PRICE PO SC FREE UP MANEN 100K, BENEFIT TANYA KE WA GW AJA",
        imageUrl: "https://placehold.co/400x400/8b5cf6/ffffff?text=JUSTIN+V18",
        price: 45000,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        createdAt: new Date(),
      },
    ]
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
  }

  // Initialize profile if not exists
  if (!localStorage.getItem(PROFILE_KEY)) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProfile))
  }
}

// Get all products
export function getProducts(): Product[] {
  if (typeof window === "undefined") return []

  const productsJson = localStorage.getItem(PRODUCTS_KEY)
  return productsJson ? JSON.parse(productsJson) : []
}

// Get a product by ID
export function getProductById(id: string): Product | null {
  const products = getProducts()
  return products.find((product) => product.id === id) || null
}

// Add a new product
export function addProduct(productData: ProductFormData): Product {
  const products = getProducts()

  const newProduct: Product = {
    id: generateId(),
    ...productData,
    createdAt: new Date(),
  }

  products.push(newProduct)
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))

  return newProduct
}

// Update a product
export function updateProduct(id: string, productData: ProductFormData): Product | null {
  const products = getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) return null

  const updatedProduct: Product = {
    ...products[index],
    ...productData,
  }

  products[index] = updatedProduct
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))

  return updatedProduct
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filteredProducts = products.filter((product) => product.id !== id)

  if (filteredProducts.length === products.length) return false

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts))
  return true
}

// Get profile data
export function getProfile() {
  if (typeof window === "undefined") return defaultProfile

  const profileJson = localStorage.getItem(PROFILE_KEY)
  return profileJson ? JSON.parse(profileJson) : defaultProfile
}

// Update profile data
export function updateProfile(data: { logoUrl?: string; bannerAudioUrl?: string }) {
  const currentProfile = getProfile()
  const updatedProfile = { ...currentProfile, ...data }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile))
  return updatedProfile
}

// Set current audio
export function setCurrentAudio(audioUrl: string | null) {
  if (typeof window === "undefined") return

  if (audioUrl) {
    localStorage.setItem(AUDIO_KEY, audioUrl)
  } else {
    localStorage.removeItem(AUDIO_KEY)
  }
}

// Get current audio
export function getCurrentAudio(): string | null {
  if (typeof window === "undefined") return null

  return localStorage.getItem(AUDIO_KEY)
}
