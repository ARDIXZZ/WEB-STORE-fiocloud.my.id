"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabaseServer } from "./supabase"
import type { ProductFormData, SettingsFormData, BackupData } from "@/types"

// Autentikasi
export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { error: "Username dan password harus diisi" }
  }

  // Simple hardcoded authentication
  if (username === "ardi" && password === "ardi") {
    // Set cookie untuk sesi admin
    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: "/",
    })

    return { success: true }
  }

  return { error: "Username atau password salah" }
}

export async function logout() {
  cookies().delete("admin_session")
  redirect("/admin/login")
}

export async function checkAuth() {
  const session = cookies().get("admin_session")?.value
  return { authenticated: session === "authenticated" }
}

// Produk
export async function getProducts() {
  try {
    // Check if the products table exists
    const { error: tableCheckError } = await supabaseServer.from("products").select("count").limit(1).single()

    // If table doesn't exist, return empty array
    if (
      tableCheckError &&
      (tableCheckError.code === "PGRST116" || tableCheckError?.message?.includes("does not exist"))
    ) {
      return { products: [] }
    }

    const { data: products, error } = await supabaseServer
      .from("products")
      .select("*, price_options(*)")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { products }
  } catch (error) {
    console.error("Get products error:", error)
    return { products: [], error: "Gagal mengambil data produk" }
  }
}

export async function getProduct(id: string) {
  try {
    const { data: product, error } = await supabaseServer
      .from("products")
      .select("*, price_options(*)")
      .eq("id", id)
      .single()

    if (error) throw error

    return { product }
  } catch (error) {
    console.error("Get product error:", error)
    return { error: "Gagal mengambil data produk" }
  }
}

export async function createProduct(formData: ProductFormData) {
  try {
    // Insert produk
    const { data: product, error: productError } = await supabaseServer
      .from("products")
      .insert({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
      })
      .select()
      .single()

    if (productError) throw productError

    // Insert opsi harga
    if (formData.price_options.length > 0) {
      const priceOptionsToInsert = formData.price_options.map((option) => ({
        product_id: product.id,
        name: option.name,
        price: option.price,
        is_default: option.is_default,
      }))

      const { error: priceError } = await supabaseServer.from("price_options").insert(priceOptionsToInsert)

      if (priceError) throw priceError
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true, product }
  } catch (error) {
    console.error("Create product error:", error)
    return { error: "Gagal membuat produk baru" }
  }
}

export async function updateProduct(id: string, formData: ProductFormData) {
  try {
    // Update produk
    const { error: productError } = await supabaseServer
      .from("products")
      .update({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (productError) throw productError

    // Hapus semua opsi harga yang ada
    const { error: deleteError } = await supabaseServer.from("price_options").delete().eq("product_id", id)

    if (deleteError) throw deleteError

    // Insert opsi harga baru
    if (formData.price_options.length > 0) {
      const priceOptionsToInsert = formData.price_options.map((option) => ({
        product_id: id,
        name: option.name,
        price: option.price,
        is_default: option.is_default,
      }))

      const { error: priceError } = await supabaseServer.from("price_options").insert(priceOptionsToInsert)

      if (priceError) throw priceError
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Update product error:", error)
    return { error: "Gagal memperbarui produk" }
  }
}

export async function deleteProduct(id: string) {
  try {
    // Hapus produk (opsi harga akan dihapus secara otomatis karena ON DELETE CASCADE)
    const { error } = await supabaseServer.from("products").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Delete product error:", error)
    return { error: "Gagal menghapus produk" }
  }
}

// Pengaturan
export async function getSettings() {
  try {
    // Try to get settings from the database
    const { data, error } = await supabaseServer.from("settings").select("*").single()

    if (error) {
      // If table doesn't exist or no data found, return default settings
      if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
        console.log("Settings table doesn't exist or no data found. Using default settings.")
        return {
          settings: {
            id: "default",
            site_name: "FioCloud",
            site_description: "Belanja Kebutuhan Hosting Murah",
            whatsapp_number: "089603749671",
            email: "av8rui@gmail.com",
            logo_url: "https://placehold.co/400x400/22d3ee/ffffff?text=FioCloud",
            music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            hero_badge_text: "Hosting Pterodactyl Terpercaya",
            hero_subtitle: "Hosting Pterodactyl",
            hero_description:
              "Solusi hosting terbaik untuk kebutuhan server Anda dengan performa tinggi dan dukungan 24/7",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        }
      }
      throw error
    }

    // Add default hero fields if they don't exist in the database
    const settingsWithDefaults = {
      ...data,
      hero_badge_text: data.hero_badge_text || "Hosting Pterodactyl Terpercaya",
      hero_subtitle: data.hero_subtitle || "Hosting Pterodactyl",
      hero_description:
        data.hero_description ||
        "Solusi hosting terbaik untuk server Anda dengan performa tinggi",
    }

    return { settings: settingsWithDefaults }
  } catch (error) {
    console.error("Get settings error:", error)
    // Always return default settings as fallback
    return {
      settings: {
        id: "default",
        site_name: "FioCloud",
        site_description: "Belanja Kebutuhan Hosting Murah",
        whatsapp_number: "089603749671",
        email: "av8rui@gmail.com",
        logo_url: "https://placehold.co/400x400/22d3ee/ffffff?text=FioCloud",
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        hero_badge_text: "Hosting Pterodactyl Terpercaya",
        hero_subtitle: "Hosting Pterodactyl",
        hero_description: "Solusi hosting terbaik untuk server Anda dengan performa tinggi",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }
}

export async function updateSettings(formData: SettingsFormData) {
  try {
    // Try to get existing settings
    const { data: existingSettings, error: selectError } = await supabaseServer.from("settings").select("id").single()

    if (selectError && selectError.message?.includes("does not exist")) {
      // If table doesn't exist, we can't update settings
      return { error: "Database belum diinisialisasi. Silakan jalankan setup database terlebih dahulu." }
    }

    const settingsId = existingSettings?.id

    // Prepare base update data (only existing columns)
    const baseUpdateData = {
      site_name: formData.site_name,
      site_description: formData.site_description,
      whatsapp_number: formData.whatsapp_number,
      email: formData.email,
      logo_url: formData.logo_url,
      music_url: formData.music_url,
      updated_at: new Date().toISOString(),
    }

    // Try to check if hero columns exist by attempting a select
    const { error: columnCheckError } = await supabaseServer
      .from("settings")
      .select("hero_badge_text, hero_subtitle, hero_description")
      .limit(1)

    // If hero columns exist, include them in the update
    let updateData = baseUpdateData
    if (!columnCheckError) {
      updateData = {
        ...baseUpdateData,
        hero_badge_text: formData.hero_badge_text,
        hero_subtitle: formData.hero_subtitle,
        hero_description: formData.hero_description,
      }
    }

    if (settingsId) {
      // Update pengaturan yang ada
      const { error } = await supabaseServer.from("settings").update(updateData).eq("id", settingsId)

      if (error) throw error
    } else {
      // Buat pengaturan baru jika tidak ada
      const { error } = await supabaseServer.from("settings").insert(updateData)

      if (error) throw error
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Update settings error:", error)
    return { error: "Gagal memperbarui pengaturan" }
  }
}

// Backup dan Restore
export async function getBackupData() {
  try {
    const { data: products, error: productsError } = await supabaseServer.from("products").select("*")

    if (productsError) throw productsError

    const { data: priceOptions, error: priceOptionsError } = await supabaseServer.from("price_options").select("*")

    if (priceOptionsError) throw priceOptionsError

    const { data: settings, error: settingsError } = await supabaseServer.from("settings").select("*").single()

    if (settingsError && settingsError.code !== "PGRST116") throw settingsError

    const backupData: BackupData = {
      products: products || [],
      price_options: priceOptions || [],
      settings: settings || {
        id: "",
        site_name: "FioCloud",
        site_description: "Belanja Kebutuhan Hosting Murah",
        whatsapp_number: "089603749671",
        email: "av8rui@gmail.com",
        logo_url: "https://placehold.co/400x400/22d3ee/ffffff?text=FioCloud",
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      version: "1.0",
    }

    return { backupData }
  } catch (error) {
    console.error("Get backup data error:", error)
    return { error: "Gagal mengambil data backup" }
  }
}

export async function restoreData(backupData: BackupData) {
  try {
    // Hapus semua data yang ada
    await supabaseServer.from("price_options").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabaseServer.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000")

    // Restore produk
    if (backupData.products.length > 0) {
      const { error: productsError } = await supabaseServer.from("products").insert(backupData.products)

      if (productsError) throw productsError
    }

    // Restore opsi harga
    if (backupData.price_options.length > 0) {
      const { error: priceOptionsError } = await supabaseServer.from("price_options").insert(backupData.price_options)

      if (priceOptionsError) throw priceOptionsError
    }

    // Restore pengaturan
    if (backupData.settings) {
      const { data: existingSettings } = await supabaseServer.from("settings").select("id").single()

      if (existingSettings) {
        const { error: settingsError } = await supabaseServer
          .from("settings")
          .update({
            site_name: backupData.settings.site_name,
            site_description: backupData.settings.site_description,
            whatsapp_number: backupData.settings.whatsapp_number,
            email: backupData.settings.email,
            logo_url: backupData.settings.logo_url,
            music_url: backupData.settings.music_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSettings.id)

        if (settingsError) throw settingsError
      } else {
        const { error: settingsError } = await supabaseServer.from("settings").insert({
          site_name: backupData.settings.site_name,
          site_description: backupData.settings.site_description,
          whatsapp_number: backupData.settings.whatsapp_number,
          email: backupData.settings.email,
          logo_url: backupData.settings.logo_url,
          music_url: backupData.settings.music_url,
        })

        if (settingsError) throw settingsError
      }
    }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Restore data error:", error)
    return { error: "Gagal memulihkan data" }
  }
}
