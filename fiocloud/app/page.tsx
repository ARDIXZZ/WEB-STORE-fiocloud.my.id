import { getProducts, getSettings } from "@/lib/actions";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { AudioPlayer } from "@/components/audio-player";

export default async function Home() {
  const { settings } = await getSettings();
  const { products = [] } = await getProducts();

  return (
    <main className="min-h-screen">
      <Header settings={settings} />
      <HeroSection settings={settings} />
      <ProductSection
        products={products}
        whatsappNumber={settings?.whatsapp_number || "089603749671"}
      />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
      <AudioPlayer settings={settings} />
    </main>
  );
}
