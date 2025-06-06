"use client"

import type { Settings } from "@/types"

interface FooterProps {
  settings: Settings | null
}

export function Footer({ settings }: FooterProps) {
  const siteName = settings?.site_name || "FioCloud"
  const whatsappNumber = settings?.whatsapp_number || "089603749671"
  const email = settings?.email || "av8rui@gmail.com"

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gradient">{siteName}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              hosting Pterodactyl dengan layanan berkualitas tinggi, dan harga yang
              Murah..
            </p>
            <div className="flex space-x-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              <a href={`mailto:${email}`} className="footer-link">
                Email
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById("beranda")?.scrollIntoView({ behavior: "smooth" })}
                  className="footer-link"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" })}
                  className="footer-link"
                >
                  Produk
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
                  className="footer-link"
                >
                  Kontak
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Panel Pterodactyl</li>
              <li>Server Private</li>
              <li>Reseller Panel</li>
              <li>Support 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
