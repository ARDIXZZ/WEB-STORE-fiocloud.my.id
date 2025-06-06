"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Star } from "lucide-react"

interface ProductSectionProps {
  products: Product[]
  whatsappNumber: string
}

export function ProductSection({ products, whatsappNumber }: ProductSectionProps) {
  // Track page views
  useEffect(() => {
    const currentViews = Number.parseInt(localStorage.getItem("fiocloud_total_views") || "0")
    localStorage.setItem("fiocloud_total_views", (currentViews + 1).toString())
  }, [])

  return (
    <section id="produk" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
          Pterodactyl
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Paket Hosting <span className="text-gradient">Pterodactyl</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih paket hosting Pterodactyl yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Produk Segera Hadir</h3>
            <p className="text-gray-600 mb-6">Kami sedang mempersiapkan paket hosting terbaik untuk Anda.</p>
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/${whatsappNumber}?text=Halo, saya ingin mengetahui informasi lebih lanjut tentang paket hosting yang tersedia.`,
                  "_blank",
                )
              }
              className="btn-primary"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Hubungi Kami
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ProductCardProps {
  product: Product
  whatsappNumber: string
  index: number
}

function ProductCard({ product, whatsappNumber, index }: ProductCardProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [selectedPriceId, setSelectedPriceId] = useState<string>(() => {
    const defaultOption = product.price_options?.find((option) => option.is_default)
    return defaultOption?.id || product.price_options?.[0]?.id || ""
  })

  const selectedPrice = product.price_options?.find((option) => option.id === selectedPriceId)

  // Track product views
  useEffect(() => {
    const viewKey = `product_views_${product.id}`
    const currentViews = Number.parseInt(localStorage.getItem(viewKey) || "0")
    localStorage.setItem(viewKey, (currentViews + 1).toString())
  }, [product.id])

  const handleWhatsAppOrder = () => {
    if (!name) {
      alert("Masukin nama lo")
      return
    }

    if (!selectedPrice) {
      alert("Pilih Harga nya dulu")
      return
    }

    // Track click
    const clickKey = `product_clicks_${product.id}`
    const totalClickKey = "fiocloud_total_clicks"

    const currentProductClicks = Number.parseInt(localStorage.getItem(clickKey) || "0")
    const currentTotalClicks = Number.parseInt(localStorage.getItem(totalClickKey) || "0")

    localStorage.setItem(clickKey, (currentProductClicks + 1).toString())
    localStorage.setItem(totalClickKey, (currentTotalClicks + 1).toString())

    const message = `Halo, saya mau pesan ${product.title} (${selectedPrice.name}) sebanyak ${quantity} dengan total harga ${formatPrice(selectedPrice.price * Number.parseInt(quantity))}. Nama saya: ${name}`

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  const isPopular = index === 1 // Make middle card popular

  return (
    <Card className={`product-card card-hover relative ${isPopular ? "ring-2 ring-blue-500 scale-105" : ""}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Terpopuler
          </Badge>
        </div>
      )}

      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "https://placehold.co/400x400/3b82f6/ffffff?text=Hosting"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">{product.title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Options */}
        {product.price_options && product.price_options.length > 0 ? (
          <div className="space-y-3">
            <Label htmlFor={`price-${product.id}`} className="text-sm font-medium text-gray-700">
              Pilihan Paket
            </Label>
            <Select value={selectedPriceId} onValueChange={setSelectedPriceId}>
              <SelectTrigger id={`price-${product.id}`} className="focus-ring">
                <SelectValue placeholder="Pilih paket" />
              </SelectTrigger>
              <SelectContent>
                {product.price_options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.name}</span>
                      <span className="font-semibold text-blue-600 ml-4">{formatPrice(option.price)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Harga akan segera diumumkan</p>
          </div>
        )}

        {/* Order Form */}
        <div className="space-y-3">
          <div>
            <Label htmlFor={`name-${product.id}`} className="text-sm font-medium text-gray-700">
              Nama Lengkap
            </Label>
            <Input
              id={`name-${product.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="mt-1 focus-ring"
            />
          </div>

          <div>
            <Label htmlFor={`quantity-${product.id}`} className="text-sm font-medium text-gray-700">
              Jumlah
            </Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger id={`quantity-${product.id}`} className="mt-1 focus-ring">
                <SelectValue placeholder="Pilih jumlah" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 10, 20].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Unit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Total Price */}
        {selectedPrice && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Harga:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(selectedPrice.price * Number.parseInt(quantity))}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={handleWhatsAppOrder} className="w-full btn-primary button-hover" disabled={!selectedPrice}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Pesan via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  )
}
