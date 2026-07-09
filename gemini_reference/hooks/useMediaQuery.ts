'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if the viewport matches a media query
 * @param query - Media query string (e.g., '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [matches, query])

  return matches
}

/**
 * Hook to detect mobile devices (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

