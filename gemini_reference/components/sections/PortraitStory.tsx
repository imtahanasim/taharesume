'use client'

import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PortraitStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !imageRef.current) return

    const ctx = gsap.context(() => {
      // 1. Parallax & Scale Effect
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.2,
          y: '15%', // Start slightly lower
        },
        {
          scale: 1.0,
          y: '0%', // Move up to center
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', // Start when top of image hits bottom of screen
            end: 'bottom top', // End when bottom of image hits top of screen
            scrub: 1, // Smooth scrubbing linked to scroll
          },
        }
      )

      // 2. The Clip-Path Reveal
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'inset(20% 0% 0% 0%)' }, // Cut off the top slightly
        {
          clipPath: 'inset(0% 0% 0% 0%)', // Reveal full
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto aspect-[3/4] overflow-hidden rounded-lg z-0"
    >
      <div
        ref={imageRef}
        className="relative w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="/me.jpeg"
          alt="Portrait"
          fill
          className="object-cover"
          style={{
            filter: 'grayscale(100%)',
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}

