"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Settings } from "@/types"

interface AudioPlayerProps {
  settings: Settings | null
}

export function AudioPlayer({ settings }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Create audio element
    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.3 // Set default volume to 30%
    audioRef.current = audio

    // Set audio source
    if (settings?.music_url) {
      audio.src = settings.music_url
      audio.load()

      // Auto-play when component mounts (with user interaction)
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error)
            setIsPlaying(false)
          })
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [settings?.music_url])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Play prevented:", error)
      })
    }

    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  if (!settings?.music_url) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="music-player rounded-full shadow-lg p-3 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          className="h-10 w-10 rounded-full hover:bg-blue-100 transition-all duration-300"
        >
          {isPlaying ? <Pause size={18} className="text-blue-600" /> : <Play size={18} className="text-blue-600" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-10 w-10 rounded-full hover:bg-blue-100 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={18} className="text-blue-600" /> : <Volume2 size={18} className="text-blue-600" />}
        </Button>

        <div className="text-xs font-medium text-gray-700 px-2 hidden sm:block">
          {isPlaying ? "♪ Musik Aktif" : "♪ Musik Pause"}
        </div>
      </div>

      {/* Toggle button for mobile */}
      <button
        onClick={toggleVisibility}
        className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg sm:hidden"
      >
        {isVisible ? "→" : "♪"}
      </button>
    </div>
  )
}
