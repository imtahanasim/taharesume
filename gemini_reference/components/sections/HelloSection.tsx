'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HelloSection() {
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Wait 1 second, then slide up
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          ref={sectionRef}
          initial={{ y: 0 }}
          animate={{ y: '-100%' }}
          exit={{ y: '-100%' }}
          transition={{
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1], // Custom heavy ease for premium feel
          }}
          className="fixed inset-0 z-50 bg-deep-black flex items-center justify-center pointer-events-auto"
          onAnimationComplete={() => {
            // Set pointer-events-none after animation completes
            if (sectionRef.current) {
              sectionRef.current.style.pointerEvents = 'none'
            }
          }}
        >
          <h1 className="text-fluid-6xl font-bold text-white">
            Hello!
          </h1>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
