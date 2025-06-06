"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Server, Shield, Zap } from "lucide-react"
import type { Settings } from "@/types"

interface HeroSectionProps {
  settings: Settings | null
}

export function HeroSection({ settings }: HeroSectionProps) {
  const siteName = settings?.site_name || "FioCloud"
  const siteDescription = settings?.site_description || "Platform Hosting Pterodactyl Terpercaya"
  const logoUrl = settings?.logo_url || "https://placehold.co/400x400/3b82f6/ffffff?text=FC"
  const heroBadgeText = settings?.hero_badge_text || "Hosting Pterodactyl Terpercaya"
  const heroSubtitle = settings?.hero_subtitle || "Hosting Pterodactyl"
  const heroDescription =
    settings?.hero_description ||
    "Solusi hosting terbaik untuk kebutuhan server Anda dengan performa tinggi dan dukungan 24/7"

  const scrollToProducts = () => {
    const productsSection = document.getElementById("produk")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="beranda" className="hero-gradient text-white section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="slide-in-left">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4">
                {heroBadgeText}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {siteName}
                <span className="block text-blue-200 text-3xl md:text-4xl lg:text-5xl mt-2">{heroSubtitle}</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">{heroDescription}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                <Server className="h-6 w-6 text-blue-200" />
                <span className="text-sm font-medium">Server Cepat</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                <Shield className="h-6 w-6 text-blue-200" />
                <span className="text-sm font-medium">Keamanan Tinggi</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3">
                <Zap className="h-6 w-6 text-blue-200" />
                <span className="text-sm font-medium">Support 24/7</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="btn-primary button-hover text-lg px-8 py-4 rounded-xl"
              >
                Pesan Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="btn-secondary text-lg px-8 py-4 rounded-xl"
                onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
              >
                Konsultasi Gratis
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="slide-in-right">
            <div className="relative">
              {/* Main Logo */}
              <div className="relative w-80 h-80 mx-auto floating">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative w-full h-full bg-white/10 rounded-full p-8 glass-effect">
                  <Image
                    src={logoUrl || "/placeholder.svg"}
                    alt={siteName}
                    fill
                    className="object-contain p-8 drop-shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://placehold.co/400x400/3b82f6/ffffff?text=FC"
                    }}
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-white/10 rounded-lg glass-effect p-4 pulse-slow">
                <Server className="w-full h-full text-white" />
              </div>
              <div className="absolute bottom-10 -right-10 w-20 h-20 bg-white/10 rounded-lg glass-effect p-4 pulse-slow">
                <Shield className="w-full h-full text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
