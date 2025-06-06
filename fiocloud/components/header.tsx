"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Settings } from "@/types"

interface HeaderProps {
  settings: Settings | null
}

export function Header({ settings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const siteName = settings?.site_name || "FioCloud"
  const logoUrl = settings?.logo_url || "https://placehold.co/400x400/3b82f6/ffffff?text=FC"

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 smooth-hover">
            <div className="relative w-10 h-10">
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt={siteName}
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://placehold.co/400x400/3b82f6/ffffff?text=FC"
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-gradient">{siteName}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("beranda")} className="nav-link">
              Beranda
            </button>
            <button onClick={() => scrollToSection("produk")} className="nav-link">
              Produk
            </button>
            <button onClick={() => scrollToSection("kontak")} className="nav-link">
              Kontak
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden smooth-hover"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 mobile-menu">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection("beranda")} className="nav-link-mobile">
                Beranda
              </button>
              <button onClick={() => scrollToSection("produk")} className="nav-link-mobile">
                Produk
              </button>
              <button onClick={() => scrollToSection("kontak")} className="nav-link-mobile">
                Kontak
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
