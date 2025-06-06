"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple client-side authentication
    if (username === "ardi" && password === "ardi") {
      // Set localStorage for simple auth
      localStorage.setItem("admin_authenticated", "true")
      router.push("/admin")
    } else {
      setError("Username atau password salah")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">FioCloud</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Login Admin</CardTitle>
            <CardDescription>Masukkan username dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Kembali ke{" "}
                <a href="/" className="text-blue-600 hover:underline font-medium">
                  Website Utama
                </a>
              </p>
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p>
                <strong>Demo Credentials:</strong>
              </p>
              <p>Username: ardi</p>
              <p>Password: ardi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
