'use client'

import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface MenuButtonProps {
  isOpen: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
}

export default function MenuButton({
  isOpen,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
}: MenuButtonProps) {
  return (
    <motion.button
      className={`group relative flex items-center gap-3 px-8 py-3 rounded-full border border-white/20 bg-transparent transition-all duration-300 ease-out hover:bg-[#C6F432] hover:border-[#C6F432] ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Text: White by default, Black on hover */}
      <span className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-black">
        {isOpen ? 'Close' : 'Menu'}
      </span>

      {/* Icon: Rotates and changes based on state */}
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white transition-colors duration-300 group-hover:text-black" />
        ) : (
          <Menu className="w-5 h-5 text-white transition-colors duration-300 group-hover:text-black group-hover:rotate-45" />
        )}
      </motion.div>
    </motion.button>
  )
}

