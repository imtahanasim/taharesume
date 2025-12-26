'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music/background.mp3')
    audio.loop = true
    audio.volume = 0.2 // Low volume (20%)
    audio.preload = 'auto'
    
    // Handle audio errors
    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e)
      const error = audio.error
      if (error) {
        console.error('Audio error details:', {
          code: error.code,
          message: error.message
        })
      }
    })

    // Log when audio is ready
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio is ready to play')
    })

    audio.addEventListener('play', () => {
      console.log('Audio started playing')
    })
    
    audioRef.current = audio

    // Function to try playing audio
    const tryPlayAudio = async () => {
      if (hasStartedRef.current || !audioRef.current) return
      
      try {
        const playPromise = audioRef.current.play()
        
        if (playPromise !== undefined) {
          await playPromise
          hasStartedRef.current = true
          console.log('Background music started successfully')
        }
      } catch (error: any) {
        console.log('Audio play failed (will retry on interaction):', error?.message || error)
        // Don't set hasStartedRef to true, so we can retry
      }
    }

    // Try to play immediately (might work in some browsers)
    // Wait a bit for audio to load
    setTimeout(() => {
      tryPlayAudio()
    }, 100)

    // Listen for any user interaction to start audio
    const handleInteraction = () => {
      if (!hasStartedRef.current) {
        tryPlayAudio()
      }
    }

    // Use more reliable interaction events
    const events = ['click', 'touchstart', 'keydown', 'mousedown', 'scroll']
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { passive: true, once: false })
    })

    // Also try on window focus (some browsers allow this)
    window.addEventListener('focus', handleInteraction, { passive: true })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction)
      })
      window.removeEventListener('focus', handleInteraction)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load() // Reset audio element
        audioRef.current = null
      }
    }
  }, []) // Empty dependency array - only run once

  return null // This component doesn't render anything
}

