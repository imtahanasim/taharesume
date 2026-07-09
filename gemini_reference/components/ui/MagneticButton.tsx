'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useCursor } from '@/components/cursor/CursorProvider'
import { useButtonSound } from '@/hooks/useButtonSound'

interface MagneticButtonProps {
  children: React.ReactNode
  link?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

export default function MagneticButton({
  children,
  link,
  className = '',
  size = 'medium',
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { setVariant } = useCursor()
  const { playSound } = useButtonSound()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const transform = useMotionTemplate`translate(${xSpring}px, ${ySpring}px)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    // Magnetic effect: move towards cursor within 15px limit
    if (distance < 100) {
      const moveX = (distanceX / distance) * Math.min(distance * 0.3, 15)
      const moveY = (distanceY / distance) * Math.min(distance * 0.3, 15)
      x.set(moveX)
      y.set(moveY)
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setVariant('default')
  }

  const handleMouseEnter = () => {
    setVariant('hover')
    playSound() // Play sound effect on hover
  }

  // Size variants
  const sizeClasses = {
    small: 'px-5 py-2 text-sm',
    medium: 'px-8 py-4 text-lg',
    large: 'px-10 py-5 text-xl',
  }

  const buttonContent = (
    <motion.button
      className={`group relative flex items-center gap-2 ${sizeClasses[size]} rounded-full border border-white/20 bg-transparent text-white overflow-hidden transition-colors duration-300 hover:border-[#C6F432] hover:bg-[#C6F432] hover:text-black ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 font-medium transition-colors duration-300 group-hover:text-black">
        {children}
      </span>
      <ArrowUpRight className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:rotate-45" />
    </motion.button>
  )

  return (
    <motion.div
      ref={ref}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="inline-block"
    >
      {link ? (
        <a href={link} className="block">
          {buttonContent}
        </a>
      ) : (
        buttonContent
      )}
    </motion.div>
  )
}

