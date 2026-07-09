'use client'

import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PortraitReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !imageRef.current) return

    const ctx = gsap.context(() => {
      // 1. The Mask Opening (Clip Path) - Reveals the image container
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'inset(10% 5% 10% 5% round 20px)' }, // Starts small/clipped
        {
          clipPath: 'inset(0% 0% 0% 0% round 12px)', // Opens to full size
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%', // Start when image enters viewport
            end: 'top 20%',
            scrub: 1.5, // Smooth scrubbing
            toggleActions: 'play reverse play reverse', // Works both directions
          },
        }
      )

      // 2. The Scale & Parallax (Inner Image) - Zoom IN more while scrolling
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.0, // Start at natural size
          y: '0%', // Start centered
        },
        {
          scale: 1.8, // Zoom IN significantly as you scroll
          y: '-15%', // Pull up slightly for better framing
          ease: 'none', // Linear for parallax
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1, // Direct link to scroll
            toggleActions: 'play reverse play reverse', // Works both directions
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-xl bg-gray-900 z-0"
    >
      <div ref={imageRef} className="relative w-full h-[120%] -top-[10%]">
        <Image
          src="/me.jpeg"
          alt="Portrait"
          fill
          className="object-cover"
          style={{
            filter: 'grayscale(100%)',
          }}
          sizes="(max-width: 768px) 100vw, 90vw"
          priority
        />
      </div>
    </div>
  )
}

