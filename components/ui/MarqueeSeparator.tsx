'use client'

import { motion } from 'framer-motion'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function MarqueeSeparator() {
  const sectionRef = useRef<HTMLElement>(null)
  const curveRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !curveRef.current) return

    const ctx = gsap.context(() => {
      const curveElement = curveRef.current?.querySelector('div') as HTMLElement

      if (!curveElement) return

      // Animate the curve sliding down over Footer section
      if (curveElement) {
        gsap.fromTo(
          curveElement,
          {
            y: '-100%', // Start above, hidden
          },
          {
            y: '0%', // Slide down to reveal
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top 60%',
              scrub: 1.5,
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full h-[60vh] bg-[#F5F5F5] overflow-hidden"
    >
      {/* The Arch Mask - Creates concave bottom edge */}
      <div
        className="absolute inset-0 bg-[#F5F5F5]"
        style={{
          // Concave arch at the bottom - creates a "bridge" effect that reveals content below
          // Polygon creates a dip in the middle: top corners, then bottom corners with center point lower
          clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)',
        }}
      >
        {/* The Ribbons Content - Centered vertically */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MarqueeItem
            text="Custom Web Experiences ✹ Innovative Solutions ✹ "
            direction="left"
            rotate={-8}
          />
          <MarqueeItem
            text="Driven by Passion, Built with Code ✹ Tailored Web Development ✹ "
            direction="right"
            rotate={8}
          />
        </div>
      </div>

      {/* Curved Overlay - Slides down over Footer section with enhanced effect */}
      <div
        ref={curveRef}
        className="curve-overlay absolute bottom-0 left-0 w-full h-[200px] translate-y-full z-10 overflow-hidden pointer-events-none"
      >
        {/* The Curved Shape - Convex hill with gradient effect */}
        <div className="w-[150%] h-full bg-deep-black absolute left-1/2 -translate-x-1/2 rounded-b-[100%] scale-x-125 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]" />
        {/* Additional glow effect */}
        <div className="w-[150%] h-full bg-gradient-to-t from-deep-black via-transparent to-transparent absolute left-1/2 -translate-x-1/2 rounded-b-[100%] scale-x-125 opacity-50" />
      </div>
    </section>
  )
}

function MarqueeItem({
  text,
  direction,
  rotate,
}: {
  text: string
  direction: 'left' | 'right'
  rotate: number
}) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] bg-black text-white py-6 shadow-xl border-y border-white/10"
      style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
    >
      {/* Inner sliding track */}
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === 'left' ? '-50%' : '0%',
        }}
        initial={{
          x: direction === 'left' ? '0%' : '-50%',
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 20,
        }}
      >
        {/* Repeat text to fill space */}
        {Array(8).fill(text).map((t, i) => (
          <span
            key={i}
            className="text-xl md:text-2xl font-black tracking-wider flex items-center gap-4"
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

