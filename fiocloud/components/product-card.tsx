"use client"

import { useState } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductCardProps {
  product: Product
  whatsappNumber: string
}

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [selectedPriceId, setSelectedPriceId] = useState<string>(() => {
    const defaultOption = product.price_options?.find((option) => option.is_default)
    return defaultOption?.id || product.price_options?.[0]?.id || ""
  })

  const selectedPrice = product.price_options?.find((option) => option.id === selectedPriceId)

  const handleWhatsAppOrder = () => {
    if (!name) {
      alert("isi nama lo dulu ")
      return
    }

    if (!selectedPrice) {
      alert("pilih paket dulu")
      return
    }

    const message = `Halo, saya mau beli ${product.title} (${selectedPrice.name}) sebanyak ${quantity} dengan harga ${formatPrice(selectedPrice.price * Number.parseInt(quantity))}. Nama saya: ${name}`

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden fade-in hover:shadow-xl transition-all duration-500">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "https://placehold.co/400x400/cccccc/333333?text=Gambar+Tidak+Tersedia"
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-teal-600 transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{product.description}</p>

        {product.price_options && product.price_options.length > 0 ? (
          <div className="mb-4 space-y-2">
            <Label htmlFor={`price-${product.id}`}>Pilihan Harga</Label>
            <Select value={selectedPriceId} onValueChange={setSelectedPriceId}>
              <SelectTrigger id={`price-${product.id}`}>
                <SelectValue placeholder="Pilih opsi harga" />
              </SelectTrigger>
              <SelectContent>
                {product.price_options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name} - {formatPrice(option.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="font-bold text-lg mb-4">Harga tidak tersedia</p>
        )}

        <div className="space-y-3">
          <div>
            <Label htmlFor={`name-${product.id}`}>Nama Anda</Label>
            <Input
              id={`name-${product.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="mt-1 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            />
          </div>

          <div>
            <Label htmlFor={`quantity-${product.id}`}>Jumlah</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger id={`quantity-${product.id}`} className="mt-1">
                <SelectValue placeholder="Pilih jumlah" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 10, 20].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-500 hover:bg-green-600 button-animation transform hover:translate-y-[-2px] transition-all duration-300"
            disabled={!selectedPrice}
          >
            Pesan via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}
