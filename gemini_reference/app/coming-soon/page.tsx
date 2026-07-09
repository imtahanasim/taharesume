'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import BlobScene from '@/components/3d/BlobScene'
import Magnetic from '@/components/cursor/Magnetic'
import PillButton from '@/components/ui/PillButton'
import { useCursor } from '@/components/cursor/CursorProvider'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ComingSoonPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const { setVariant } = useCursor()

  // Generate stable positions for animated particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }))
  }, [])

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !subtitleRef.current || !buttonRef.current) return

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 50,
      })

      // Animate title
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
      })

      // Animate subtitle
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.6,
      })

      // Animate button
      gsap.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1,
      })

      // Floating animation for title
      gsap.to(titleRef.current, {
        y: -10,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-deep-black">
      {/* Split Layout */}
      <div className="relative z-20 flex h-full">
        {/* Left Side - Text Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-20">
          {/* Back Button */}
          <motion.div
            className="absolute top-8 left-8 z-30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Magnetic>
              <Link
                href="/"
                onMouseEnter={() => setVariant('hover')}
                onMouseLeave={() => setVariant('default')}
              >
                <PillButton
                  icon={ArrowLeft}
                  onMouseEnter={() => setVariant('hover')}
                  onMouseLeave={() => setVariant('default')}
                >
                  Back Home
                </PillButton>
              </Link>
            </Magnetic>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-2xl">
            {/* Title */}
            <motion.h1
              ref={titleRef}
              className="text-fluid-6xl md:text-fluid-7xl font-black text-white mb-6"
              style={{
                textShadow: '0 0 40px rgba(198, 244, 50, 0.3)',
              }}
            >
              COMING SOON
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              ref={subtitleRef}
              className="text-fluid-xl md:text-fluid-2xl text-white/70 mb-12 leading-relaxed"
            >
              Something amazing is in the works. Stay tuned for updates!
            </motion.p>

            {/* Button */}
            <motion.div ref={buttonRef} className="flex">
              <Magnetic>
                <Link
                  href="/"
                  onMouseEnter={() => setVariant('hover')}
                  onMouseLeave={() => setVariant('default')}
                >
                  <PillButton
                    onMouseEnter={() => setVariant('hover')}
                    onMouseLeave={() => setVariant('default')}
                  >
                    Return Home
                  </PillButton>
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Blob Scene */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 60 }}
              gl={{ alpha: true, antialias: true }}
              className="w-full h-full"
            >
              <BlobScene />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-neon-lime/20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

