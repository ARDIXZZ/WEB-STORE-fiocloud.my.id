"use client"

import { MessageCircle, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Settings } from "@/types"

interface ContactSectionProps {
  settings: Settings | null
}

export function ContactSection({ settings }: ContactSectionProps) {
  const whatsappNumber = settings?.whatsapp_number || "089603749671"
  const email = settings?.email || "av8rui@gmail.com"

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat langsung dengan tim support",
      value: whatsappNumber,
      action: () =>
        window.open(
          `https://wa.me/${whatsappNumber}?text=Halo, saya mau mengetahui informasi lebih lanjut tentang layanan hosting FioCloud.`,
          "_blank",
        ),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Kirim pertanyaan",
      value: email,
      action: () => window.open(`mailto:${email}?subject=Inquiry tentang  FioCloud`, "_blank"),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      description: "Support 24/7",
      value: "Selalu Online",
      action: () => {},
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <section id="kontak" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-in">
          <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200">
            Hubungi Kami
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Siap Membantu <span className="text-gradient">Anda</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tim support kami siap membantu Anda. Jangan ragu untuk menghubungi kami kapan saja.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <Card
              key={method.title}
              className={`card-hover cursor-pointer fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onClick={method.action}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <method.icon className={`h-8 w-8 ${method.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className={`font-semibold ${method.color}`}>{method.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Mulai Hosting Anda Hari Ini</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Dapatkan konsultasi gratis dan penawaran terbaik untuk kebutuhan hosting Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/${whatsappNumber}?text=Halo, saya ingin konsultasi gratis tentang paket hosting yang sesuai untuk kebutuhan saya.`,
                  "_blank",
                )
              }
              className="btn-primary button-hover"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Konsultasi Gratis
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary"
              size="lg"
            >
              Lihat Paket
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
