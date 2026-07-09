'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCursor } from '@/components/cursor/CursorProvider'
import MenuButton from '@/components/ui/MenuButton'
import Magnetic from '@/components/cursor/Magnetic'
import PillButton from '@/components/ui/PillButton'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { setVariant } = useCursor()

  useEffect(() => {
    const handleScroll = () => {
      // Show menu button only when scrolled past hero section
      const heroHeight = window.innerHeight
      setShowMenu(window.scrollY > heroHeight * 0.8)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Works', href: '#works' },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    
    // Wait for menu to close, then scroll using Lenis
    setTimeout(() => {
      if (href.startsWith('#')) {
        const element = document.getElementById(href.substring(1))
        if (element) {
          // Use Lenis for smooth scrolling if available
          const lenis = (window as any).lenis
          if (lenis) {
            lenis.scrollTo(element, {
              duration: 1.2,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              offset: 0,
            })
          } else {
            // Fallback to native smooth scroll
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }, 300) // Wait for menu close animation
  }

  return (
    <>
      {/* Menu Button - Only shown after scrolling past hero */}
      {showMenu && (
        <div className="fixed top-8 right-8 z-50">
          <Magnetic>
            <MenuButton
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setVariant('hover')}
              onMouseLeave={() => setVariant('default')}
            />
          </Magnetic>
        </div>
      )}

      {/* Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-deep-black z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Centered Menu Buttons */}
            <motion.nav
              className="flex flex-col gap-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {links.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <Magnetic>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      onMouseEnter={() => setVariant('hover')}
                      onMouseLeave={() => setVariant('default')}
                    >
                      <PillButton
                        onMouseEnter={() => setVariant('hover')}
                        onMouseLeave={() => setVariant('default')}
                      >
                        {link.name}
                      </PillButton>
                    </a>
                  </Magnetic>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

