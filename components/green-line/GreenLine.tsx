'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GreenLine() {
  const pathRef = useRef<SVGPathElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pathRef.current) return

    const path = pathRef.current
    const pathLength = path.getTotalLength()

    // Initialize stroke dash
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    })

    // Create scroll-triggered animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - progress),
        })
      },
    })

    // Refresh on resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      scrollTrigger.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      <svg
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 5000"
        style={{ height: '5000px' }}
      >
        <path
          ref={pathRef}
          d="M 50 0 Q 70 500 50 1000 T 50 2000 Q 30 2500 50 3000 T 50 4000 Q 70 4500 50 5000"
          stroke="#C6F432"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
