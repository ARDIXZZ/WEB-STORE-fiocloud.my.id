"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  Trash2,
  Edit,
  Plus,
  Save,
  LogOut,
  Home,
  Eye,
  EyeOff,
  Download,
  Music,
  Settings,
  Database,
  Users,
  BarChart3,
  FileText,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Copy,
  ExternalLink,
  MoreVertical,
  Camera,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Upload,
  MousePointer,
  BadgeIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getProducts, getSettings, createProduct, updateProduct, deleteProduct, updateSettings } from "@/lib/actions"
import type { Product, ProductFormData } from "@/types"
import type { Settings as SettingsType } from "@/types"
import { formatPrice } from "@/lib/utils"

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")

  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalClicks: 0,
  })

  // Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showSettingsForm, setShowSettingsForm] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [activeTab, setActiveTab] = useState("dashboard")

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Product form data
  const [productForm, setProductForm] = useState<ProductFormData>({
    title: "",
    description: "",
    image_url: "",
    price_options: [{ name: "Standard", price: 0, is_default: true }],
  })

  // Auto backup state
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>(null)

  // Restore state
  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem("fiocloud_admin")
    if (auth === "authenticated") {
      setIsAuthenticated(true)
      loadData()
      initAudioPlayer()
      checkAutoBackup()
      loadStats()
    }
  }, [])

  // Load real stats from localStorage
  const loadStats = () => {
    const views = localStorage.getItem("fiocloud_total_views") || "0"
    const clicks = localStorage.getItem("fiocloud_total_clicks") || "0"
    setStats((prev) => ({
      ...prev,
      totalViews: Number.parseInt(views),
      totalClicks: Number.parseInt(clicks),
    }))
  }

  // Auto backup check
  const checkAutoBackup = () => {
    const enabled = localStorage.getItem("auto_backup_enabled") === "true"
    const lastBackupTime = localStorage.getItem("last_backup_time")
    setAutoBackupEnabled(enabled)
    setLastBackup(lastBackupTime)

    if (enabled) {
      const now = new Date().getTime()
      const lastTime = lastBackupTime ? Number.parseInt(lastBackupTime) : 0
      const dayInMs = 24 * 60 * 60 * 1000

      if (now - lastTime > dayInMs) {
        performAutoBackup()
      }
    }
  }

  // Initialize audio player
  const initAudioPlayer = () => {
    if (typeof window !== "undefined") {
      const audio = new Audio()
      audio.loop = true
      audio.volume = 0.3
      audioRef.current = audio
    }
  }

  // Auth functions
  const handleLogin = () => {
    if (username === "ardi" && password === "ardi") {
      localStorage.setItem("fiocloud_admin", "authenticated")
      setIsAuthenticated(true)
      setAuthError("")
      loadData()
      initAudioPlayer()
      checkAutoBackup()
      loadStats()
    } else {
      setAuthError("Username atau password salah!")
    }
  }

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari admin panel?")) {
      localStorage.removeItem("fiocloud_admin")
      setIsAuthenticated(false)
      setUsername("")
      setPassword("")
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }

  // Data functions
  const loadData = async () => {
    setIsLoading(true)
    try {
      const { products: productsData } = await getProducts()
      const { settings: settingsData } = await getSettings()

      setProducts(productsData || [])
      setSettings(settingsData)
      setStats((prev) => ({ ...prev, totalProducts: productsData?.length || 0 }))

      // Load music if available
      if (settingsData?.music_url && audioRef.current) {
        audioRef.current.src = settingsData.music_url
      }
    } catch (error) {
      console.error("Load data error:", error)
      showMessage("Gagal memuat data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 5000)
  }

  // Audio functions
  const toggleMusic = () => {
    if (!audioRef.current || !settings?.music_url) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Audio play error:", error)
          showMessage("Gagal memutar musik", "error")
        })
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Product functions
  const handleProductSubmit = async () => {
    if (!productForm.title || !productForm.description || !productForm.image_url) {
      showMessage("Semua field harus diisi!", "error")
      return
    }

    if (productForm.price_options.some((opt) => !opt.name || opt.price < 0)) {
      showMessage("Semua opsi harga harus valid!", "error")
      return
    }

    setIsLoading(true)
    try {
      if (editingProduct) {
        const result = await updateProduct(editingProduct.id, productForm)
        if (result.error) {
          showMessage(result.error, "error")
        } else {
          showMessage("Produk berhasil diperbarui!", "success")
          resetProductForm()
          loadData()
        }
      } else {
        const result = await createProduct(productForm)
        if (result.error) {
          showMessage(result.error, "error")
        } else {
          showMessage("Produk berhasil ditambahkan!", "success")
          resetProductForm()
          loadData()
        }
      }
    } catch (error) {
      console.error("Product submit error:", error)
      showMessage("Terjadi kesalahan saat menyimpan produk", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.")) return

    setIsLoading(true)
    try {
      const result = await deleteProduct(id)
      if (result.error) {
        showMessage(result.error, "error")
      } else {
        showMessage("Produk berhasil dihapus!", "success")
        loadData()
      }
    } catch (error) {
      console.error("Delete product error:", error)
      showMessage("Gagal menghapus produk", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      title: product.title,
      description: product.description,
      image_url: product.image_url,
      price_options: product.price_options?.map((option) => ({
        name: option.name,
        price: option.price,
        is_default: option.is_default,
      })) || [{ name: "Standard", price: 0, is_default: true }],
    })
    setShowProductForm(true)
    setActiveTab("products")
  }

  const resetProductForm = () => {
    setProductForm({
      title: "",
      description: "",
      image_url: "",
      price_options: [{ name: "Standard", price: 0, is_default: true }],
    })
    setEditingProduct(null)
    setShowProductForm(false)
  }

  // Settings functions
  const handleSettingsSubmit = async () => {
    if (!settings) return

    if (!settings.site_name || !settings.email || !settings.whatsapp_number) {
      showMessage("Nama website, email, dan WhatsApp harus diisi!", "error")
      return
    }

    setIsLoading(true)
    try {
      const result = await updateSettings(settings)
      if (result.error) {
        showMessage(result.error, "error")
      } else {
        showMessage("Pengaturan berhasil disimpan!", "success")
        setShowSettingsForm(false)
        loadData()
      }
    } catch (error) {
      console.error("Settings submit error:", error)
      showMessage("Gagal menyimpan pengaturan", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Price option functions
  const updatePriceOption = (index: number, field: string, value: string | boolean) => {
    const newOptions = [...productForm.price_options]
    if (field === "name") {
      newOptions[index].name = value as string
    } else if (field === "price") {
      newOptions[index].price = Math.max(0, Number.parseInt(value as string) || 0)
    } else if (field === "is_default") {
      newOptions.forEach((opt, i) => {
        opt.is_default = i === index
      })
    }
    setProductForm({ ...productForm, price_options: newOptions })
  }

  const addPriceOption = () => {
    setProductForm({
      ...productForm,
      price_options: [...productForm.price_options, { name: "", price: 0, is_default: false }],
    })
  }

  const removePriceOption = (index: number) => {
    if (productForm.price_options.length <= 1) return
    const newOptions = productForm.price_options.filter((_, i) => i !== index)
    if (productForm.price_options[index].is_default && newOptions.length > 0) {
      newOptions[0].is_default = true
    }
    setProductForm({ ...productForm, price_options: newOptions })
  }

  // Backup functions
  const performAutoBackup = async () => {
    try {
      const backupData = {
        products,
        settings,
        stats: {
          totalViews: localStorage.getItem("fiocloud_total_views") || "0",
          totalClicks: localStorage.getItem("fiocloud_total_clicks") || "0",
        },
        timestamp: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(backupData, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `fiocloud-auto-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      const now = new Date().getTime().toString()
      localStorage.setItem("last_backup_time", now)
      setLastBackup(now)

      showMessage("Auto backup berhasil!", "success")
    } catch (error) {
      console.error("Auto backup error:", error)
      showMessage("Auto backup gagal", "error")
    }
  }

  const toggleAutoBackup = () => {
    const newState = !autoBackupEnabled
    setAutoBackupEnabled(newState)
    localStorage.setItem("auto_backup_enabled", newState.toString())

    if (newState) {
      showMessage("Auto backup diaktifkan (setiap 24 jam)", "success")
    } else {
      showMessage("Auto backup dinonaktifkan", "success")
    }
  }

  const manualBackup = () => {
    performAutoBackup()
  }

  // Restore functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/json") {
      setRestoreFile(file)
    } else {
      showMessage("Pilih file JSON yang valid!", "error")
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) {
      showMessage("Pilih file backup terlebih dahulu!", "error")
      return
    }

    if (!confirm("Yakin ingin restore data? Semua data saat ini akan diganti dengan data backup!")) {
      return
    }

    setIsRestoring(true)
    try {
      const fileContent = await restoreFile.text()
      const backupData = JSON.parse(fileContent)

      // Validate backup data structure
      if (!backupData.products || !backupData.settings || !backupData.timestamp) {
        throw new Error("Format backup tidak valid")
      }

      // Restore products
      if (backupData.products.length > 0) {
        // Clear existing products first
        for (const product of products) {
          await deleteProduct(product.id)
        }

        // Add products from backup
        for (const productData of backupData.products) {
          const formData: ProductFormData = {
            title: productData.title,
            description: productData.description,
            image_url: productData.image_url,
            price_options: productData.price_options?.map((option: any) => ({
              name: option.name,
              price: option.price,
              is_default: option.is_default,
            })) || [{ name: "Standard", price: 0, is_default: true }],
          }
          await createProduct(formData)
        }
      }

      // Restore settings
      if (backupData.settings) {
        await updateSettings(backupData.settings)
      }

      // Restore stats if available
      if (backupData.stats) {
        localStorage.setItem("fiocloud_total_views", backupData.stats.totalViews || "0")
        localStorage.setItem("fiocloud_total_clicks", backupData.stats.totalClicks || "0")
      }

      // Reload data
      await loadData()
      loadStats()

      showMessage("Data berhasil di-restore!", "success")
      setRestoreFile(null)

      // Reset file input
      const fileInput = document.getElementById("restore-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Restore error:", error)
      showMessage("Gagal restore data. Pastikan file backup valid!", "error")
    } finally {
      setIsRestoring(false)
    }
  }

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showMessage("Disalin ke clipboard!", "success")
      })
      .catch(() => {
        showMessage("Gagal menyalin", "error")
      })
  }

  const testImageUrl = (url: string) => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  const testMusicUrl = (url: string) => {
    if (url && audioRef.current) {
      audioRef.current.src = url
      audioRef.current
        .play()
        .then(() => {
          showMessage("Musik berhasil diputar!", "success")
        })
        .catch(() => {
          showMessage("URL musik tidak valid", "error")
        })
    }
  }

  // Reset stats function
  const resetStats = () => {
    if (confirm("Yakin ingin reset semua statistik? Tindakan ini tidak dapat dibatalkan!")) {
      localStorage.setItem("fiocloud_total_views", "0")
      localStorage.setItem("fiocloud_total_clicks", "0")
      loadStats()
      showMessage("Statistik berhasil direset!", "success")
    }
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">🚀 FioCloud</CardTitle>
            <p className="text-blue-100">Admin Control Panel</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {authError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{authError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="h-11"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="h-11 pr-10"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
              🔐 Masuk ke Admin Panel
            </Button>

            <div className="text-center">
              <a href="/" className="text-blue-600 hover:underline text-sm font-medium">
                ← Kembali ke Website Utama
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FioCloud Admin</h1>
              <p className="text-xs text-gray-500">Control Panel</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Music Player */}
            {settings?.music_url && (
              <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
                <Button variant="ghost" size="sm" onClick={toggleMusic} className="h-8 w-8 p-0">
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleMute} className="h-8 w-8 p-0">
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
              </div>
            )}

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.open("/", "_blank")}>
                  <Home className="w-4 h-4 mr-2" />
                  Lihat Website
                </DropdownMenuItem>
                <DropdownMenuItem onClick={manualBackup}>
                  <Download className="w-4 h-4 mr-2" />
                  Backup Manual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Message */}
        {message && (
          <Alert
            className={`${messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} animate-in slide-in-from-top-2`}
          >
            <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 h-auto p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs sm:text-sm">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 text-xs sm:text-sm">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Produk</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs sm:text-sm">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Website</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-1 text-xs sm:text-sm">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1 text-xs sm:text-sm">
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-1 text-xs sm:text-sm">
              <Database className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Backup</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Produk</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Clicks</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.totalClicks}</p>
                    </div>
                    <MousePointer className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Button
                    onClick={() => {
                      setActiveTab("products")
                      setShowProductForm(true)
                    }}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Tambah Produk</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("settings")}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="text-xs">Edit Website</span>
                  </Button>
                  <Button variant="outline" onClick={manualBackup} className="h-auto p-4 flex-col gap-2">
                    <Download className="h-5 w-5" />
                    <span className="text-xs">Backup Data</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("/", "_blank")}
                    className="h-auto p-4 flex-col gap-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span className="text-xs">Lihat Website</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Produk Terbaru
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("products")}>
                    Lihat Semua
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Belum ada produk</p>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        setActiveTab("products")
                        setShowProductForm(true)
                      }}
                    >
                      Tambah Produk Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 6).map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "https://placehold.co/400x300/cccccc/666666?text=No+Image"
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 text-xs"
                          >
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kelola Produk</h2>
                <p className="text-gray-600">Tambah, edit, dan hapus produk website</p>
              </div>
              <Button onClick={() => setShowProductForm(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Produk
              </Button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</span>
                    <Button variant="ghost" size="sm" onClick={resetProductForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Judul Produk *</Label>
                      <Input
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="Nama produk yang menarik"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL Gambar Produk *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="h-10"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testImageUrl(productForm.image_url)}
                          disabled={!productForm.image_url}
                          className="px-3"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Deskripsi Produk *</Label>
                    <Textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Deskripsi detail tentang produk..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  {/* Image Preview */}
                  {productForm.image_url && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Preview Gambar</Label>
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
                        <Image
                          src={productForm.image_url || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "https://placehold.co/400x300/cccccc/666666?text=Invalid+Image"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Opsi Harga</Label>
                    {productForm.price_options.map((option, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <Input
                            placeholder="Nama paket (contoh: Basic, Premium)"
                            value={option.name}
                            onChange={(e) => updatePriceOption(index, "name", e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div className="w-full sm:w-32">
                          <Input
                            type="number"
                            placeholder="Harga"
                            value={option.price}
                            onChange={(e) => updatePriceOption(index, "price", e.target.value)}
                            className="h-9"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                            <input
                              type="radio"
                              checked={option.is_default}
                              onChange={() => updatePriceOption(index, "is_default", true)}
                              className="w-4 h-4"
                            />
                            Default
                          </label>
                          {productForm.price_options.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removePriceOption(index)}
                              className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={addPriceOption} className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Opsi Harga
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button onClick={handleProductSubmit} disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {editingProduct ? "Update Produk" : "Simpan Produk"}
                    </Button>
                    <Button variant="outline" onClick={resetProductForm} className="w-full sm:w-auto">
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Daftar Produk ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-2" />
                    <p className="text-gray-500">Memuat produk...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Belum ada produk</h3>
                    <p className="mb-4">Mulai dengan menambahkan produk pertama Anda</p>
                    <Button onClick={() => setShowProductForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Produk Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-video bg-gray-100">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "https://placehold.co/400x300/cccccc/666666?text=No+Image"
                            }}
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-medium line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          </div>

                          {product.price_options && product.price_options.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">Opsi Harga:</p>
                              <div className="space-y-1">
                                {product.price_options.map((option) => (
                                  <div key={option.id} className="flex justify-between items-center text-sm">
                                    <span className="flex items-center gap-1">
                                      {option.name}
                                      {option.is_default && (
                                        <Badge variant="secondary" className="text-xs">
                                          Default
                                        </Badge>
                                      )}
                                    </span>
                                    <span className="font-medium">{formatPrice(option.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pengaturan Website</h2>
              <p className="text-gray-600">Kelola informasi dan tampilan website Anda</p>
            </div>

            {settings && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Informasi Dasar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nama Website *</Label>
                      <Input
                        value={settings.site_name}
                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        placeholder="Nama website Anda"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Deskripsi Website</Label>
                      <Textarea
                        value={settings.site_description}
                        onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                        placeholder="Deskripsi singkat tentang website"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Informasi Kontak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email *</Label>
                      <Input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="email@domain.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nomor WhatsApp *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.whatsapp_number}
                          onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                          placeholder="089603749671"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(settings.whatsapp_number)}
                          className="px-3"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Logo Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Logo Website
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL Logo</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.logo_url}
                          onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testImageUrl(settings.logo_url)}
                          disabled={!settings.logo_url}
                          className="px-3"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {settings.logo_url && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Preview Logo</Label>
                        <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                          <Image
                            src={settings.logo_url || "/placeholder.svg"}
                            alt="Logo Preview"
                            fill
                            className="object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "https://placehold.co/400x400/cccccc/666666?text=Logo"
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Music Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5" />
                      Musik Latar Belakang
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL Musik</Label>
                      <div className="flex gap-2">
                        <Input
                          value={settings.music_url}
                          onChange={(e) => setSettings({ ...settings, music_url: e.target.value })}
                          placeholder="https://example.com/music.mp3"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testMusicUrl(settings.music_url)}
                          disabled={!settings.music_url}
                          className="px-3"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                      <p>
                        <strong>Tips:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Gunakan format MP3 untuk kompatibilitas terbaik</li>
                        <li>Ukuran file sebaiknya di bawah 5MB</li>
                        <li>Musik akan diputar otomatis saat website dibuka</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSettingsSubmit} disabled={isLoading || !settings} className="w-full sm:w-auto">
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Semua Pengaturan
              </Button>
            </div>
          </TabsContent>

          {/* Hero Content Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hero Section</h2>
              <p className="text-gray-600">Kelola konten bagian utama website (dashboard bawah)</p>
            </div>

            {settings && (
              <div className="space-y-6">
                {/* Info Alert */}
                <Alert className="border-blue-200 bg-blue-50">
                  <BadgeIcon className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    <strong>Info:</strong> Fitur Hero Content menggunakan fallback values jika database belum memiliki
                    kolom hero. Perubahan akan tersimpan saat database di-update.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Hero Badge */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BadgeIcon className="h-5 w-5" />
                        Badge Text
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Teks Badge Hero</Label>
                        <Input
                          value={settings.hero_badge_text || "Hosting Pterodactyl Terpercaya"}
                          onChange={(e) => setSettings({ ...settings, hero_badge_text: e.target.value })}
                          placeholder="Hosting Pterodactyl Terpercaya"
                        />
                        <p className="text-xs text-gray-500">Teks kecil di atas judul utama</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hero Subtitle */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Subtitle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Subtitle Hero</Label>
                        <Input
                          value={settings.hero_subtitle || "Hosting Pterodactyl"}
                          onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                          placeholder="Hosting Pterodactyl"
                        />
                        <p className="text-xs text-gray-500">Teks di bawah nama website</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hero Description */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Deskripsi Hero
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Deskripsi Utama</Label>
                        <Textarea
                          value={
                            settings.hero_description ||
                            "Solusi hosting terbaik untuk kebutuhan server Anda dengan performa tinggi dan dukungan 24/7"
                          }
                          onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                          placeholder="Solusi hosting terbaik untuk kebutuhan server Anda dengan performa tinggi dan dukungan 24/7"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500">Deskripsi panjang di bawah subtitle</p>
                      </div>

                      {/* Preview */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Preview Hero Section:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-blue-800 text-xs">
                            {settings.hero_badge_text || "Hosting Pterodactyl Terpercaya"}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {settings.site_name}
                            <span className="block text-blue-600 text-base">
                              {settings.hero_subtitle || "Hosting Pterodactyl"}
                            </span>
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {settings.hero_description ||
                              "Solusi hosting terbaik untuk kebutuhan server Anda dengan performa tinggi dan dukungan 24/7"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSettingsSubmit} disabled={isLoading || !settings} className="w-full sm:w-auto">
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Hero Content
              </Button>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Media Manager</h2>
              <p className="text-gray-600">Kelola gambar dan media website</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Tools Gambar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test URL Gambar</Label>
                    <div className="flex gap-2">
                      <Input placeholder="https://example.com/image.jpg" id="test-image-url" />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("test-image-url") as HTMLInputElement
                          if (input?.value) testImageUrl(input.value)
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Rekomendasi Situs Gambar Gratis:</h4>
                    <div className="space-y-2 text-sm">
                      <a
                        href="https://unsplash.com"
                        target="_blank"
                        className="block text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Unsplash.com - Foto berkualitas tinggi
                      </a>
                      <a
                        href="https://pixabay.com"
                        target="_blank"
                        className="block text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Pixabay.com - Gambar dan ilustrasi gratis
                      </a>
                      <a
                        href="https://pexels.com"
                        target="_blank"
                        className="block text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Pexels.com - Foto stock gratis
                      </a>
                      <a
                        href="https://placehold.co"
                        target="_blank"
                        className="block text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Placehold.co - Generator placeholder
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audio Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Tools Audio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test URL Audio</Label>
                    <div className="flex gap-2">
                      <Input placeholder="https://example.com/music.mp3" id="test-audio-url" />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById("test-audio-url") as HTMLInputElement
                          if (input?.value) testMusicUrl(input.value)
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sumber Audio Gratis:</h4>
                    <div className="space-y-2 text-sm">
                      <a
                        href="https://freemusicarchive.org"
                        target="_blank"
                        className="block text-green-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Free Music Archive - Musik bebas royalti
                      </a>
                      <a
                        href="https://www.soundhelix.com"
                        target="_blank"
                        className="block text-green-600 hover:underline"
                        rel="noreferrer"
                      >
                        • SoundHelix - Musik instrumental
                      </a>
                      <a
                        href="https://incompetech.com"
                        target="_blank"
                        className="block text-green-600 hover:underline"
                        rel="noreferrer"
                      >
                        • Incompetech - Musik Kevin MacLeod
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Preview Responsif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
                    <Monitor className="h-4 w-4 mr-1" />
                    Desktop
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
                    <Tablet className="h-4 w-4 mr-1" />
                    Tablet
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
                    <Smartphone className="h-4 w-4 mr-1" />
                    Mobile
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Klik tombol di atas untuk melihat website dalam berbagai ukuran layar
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Backup & Restore</h2>
              <p className="text-gray-600">Kelola backup data website Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Auto Backup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Auto Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Backup Harian</p>
                      <p className="text-sm text-gray-600">Backup otomatis setiap 24 jam</p>
                    </div>
                    <Switch checked={autoBackupEnabled} onCheckedChange={toggleAutoBackup} />
                  </div>

                  {lastBackup && (
                    <div className="text-sm text-gray-600">
                      <p>Backup terakhir: {new Date(Number.parseInt(lastBackup)).toLocaleString("id-ID")}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <p>
                      <strong>Info:</strong> Auto backup akan menyimpan file JSON ke download folder Anda secara
                      otomatis.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Backup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Manual Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={manualBackup} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup Sekarang
                  </Button>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Backup mencakup:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Semua data produk</li>
                      <li>Pengaturan website</li>
                      <li>Konfigurasi harga</li>
                      <li>Statistik views & clicks</li>
                      <li>Timestamp backup</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Restore Backup */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Restore Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pilih File Backup</Label>
                    <Input
                      id="restore-file"
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>

                  {restoreFile && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>File dipilih:</strong> {restoreFile.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Ukuran: {(restoreFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}

                  <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                    <p className="font-medium mb-1">⚠️ Peringatan:</p>
                    <p>
                      Restore akan mengganti semua data saat ini dengan data dari backup. Pastikan Anda sudah backup
                      data terbaru sebelum melakukan restore.
                    </p>
                  </div>

                  <Button
                    onClick={handleRestore}
                    disabled={!restoreFile || isRestoring}
                    className="w-full"
                    variant={restoreFile ? "default" : "secondary"}
                  >
                    {isRestoring ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isRestoring ? "Sedang Restore..." : "Restore Data"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Statistik</h2>
                <p className="text-gray-600">Monitor performa website Anda</p>
              </div>
              <Button variant="outline" onClick={resetStats} className="text-red-600 hover:text-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Stats
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Pengunjung website</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Clicks</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalClicks}</p>
                      <p className="text-xs text-gray-500">Klik produk</p>
                    </div>
                    <MousePointer className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Click Rate</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-xs text-gray-500">Rasio klik/view</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Popular Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Produk Terpopuler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "https://placehold.co/400x300/cccccc/666666?text=No+Image"
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.title}</p>
                          <p className="text-xs text-gray-600">
                            {localStorage.getItem(`product_views_${product.id}`) || 0} views
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {localStorage.getItem(`product_clicks_${product.id}`) || 0} clicks
                        </p>
                        <p className="text-xs text-gray-600">
                          {product.price_options?.[0] ? formatPrice(product.price_options[0].price) : "No price"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Belum ada data produk</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Informasi Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">📊 Data Real-Time</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Views dihitung setiap kali halaman website dibuka</li>
                      <li>• Clicks dihitung setiap kali tombol "Pesan via WhatsApp" diklik</li>
                      <li>• Data disimpan di browser dan disinkronkan dengan backup</li>
                      <li>• Reset stats akan menghapus semua data statistik</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">💡 Tips Optimasi</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Click rate di atas 5% menunjukkan performa yang baik</li>
                      <li>• Produk dengan views tinggi tapi clicks rendah perlu optimasi deskripsi</li>
                      <li>• Gunakan gambar menarik untuk meningkatkan click rate</li>
                      <li>• Update harga secara berkala untuk menjaga daya saing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
