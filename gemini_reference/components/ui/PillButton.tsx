'use client'

import { ArrowUpRight, LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useButtonSound } from '@/hooks/useButtonSound'

interface PillButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: LucideIcon
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function PillButton({
  children,
  onClick,
  className = '',
  icon: Icon = ArrowUpRight,
  onMouseEnter,
  onMouseLeave,
}: PillButtonProps) {
  const { playSound } = useButtonSound()

  const handleMouseEnter = () => {
    playSound()
    onMouseEnter?.()
  }

  return (
    <motion.button
      className={`group relative flex items-center gap-3 px-8 py-3 rounded-full border border-white/20 bg-transparent transition-all duration-300 ease-out hover:bg-[#C6F432] hover:border-[#C6F432] ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Text: White by default, Black on hover */}
      <span className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-black">
        {children}
      </span>

      {/* Icon: White by default, Black on hover, Rotates 45deg */}
      <Icon className="w-5 h-5 text-white transition-all duration-300 group-hover:text-black group-hover:rotate-45" />
    </motion.button>
  )
}

