'use client'

import { useEffect, useState } from 'react'
import { useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { motion } from 'framer-motion'
import { useCursor } from './CursorProvider'

export default function Cursor() {
  const { variant, cursorText } = useCursor()
  const [mounted, setMounted] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 20, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const cursorTransform = useMotionTemplate`translate(${cursorXSpring}px, ${cursorYSpring}px)`

  useEffect(() => {
    setMounted(true)
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [cursorX, cursorY])

  if (!mounted) return null

  const variants = {
    default: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '1px solid white',
      backgroundColor: 'transparent',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '1px solid white',
      backgroundColor: 'transparent',
      mixBlendMode: 'difference' as const,
    },
    text: {
      width: 2,
      height: 24,
      borderRadius: '0',
      border: 'none',
      backgroundColor: 'white',
      mixBlendMode: 'difference' as const,
    },
    project: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      border: '1px solid white',
      backgroundColor: 'transparent',
      mixBlendMode: 'difference' as const,
    },
  }

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        transform: cursorTransform,
        x: '-50%',
        y: '-50%',
      }}
      animate={variants[variant]}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    />
  )
}

