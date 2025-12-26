'use client'

import { useRef } from 'react'

// Sound effect for button hover - plays once per hover
export function useButtonSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastPlayTimeRef = useRef<number>(0)

  const playSound = () => {
    const now = Date.now()
    // Throttle: only play if at least 300ms have passed since last play
    if (now - lastPlayTimeRef.current < 300) return

    try {
      if (!audioRef.current) {
        // Create audio element on first use
        const audio = new Audio()
        audio.src = '/sounds/button-hover.wav'
        audio.volume = 0.5 // 50% volume
        audio.preload = 'auto'
        audioRef.current = audio
      }

      // Reset and play
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore errors (autoplay restrictions, etc.)
      })
      
      lastPlayTimeRef.current = now
    } catch (error) {
      // Silently fail if audio can't play
    }
  }

  return { playSound }
}

