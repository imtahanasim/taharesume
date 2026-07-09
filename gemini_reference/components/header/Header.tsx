'use client'

import { useState, useEffect } from 'react'
import Magnetic from '@/components/cursor/Magnetic'
import MagneticButton from '@/components/ui/MagneticButton'
import { useButtonSound } from '@/hooks/useButtonSound'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const { playSound } = useButtonSound()

  useEffect(() => {
    const handleScroll = () => {
      // Toggle dark mode when scrolling past hero section (approximately 100vh)
      const heroHeight = window.innerHeight
      setIsDark(window.scrollY > heroHeight * 0.8)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Works', href: '#works' },
  ]

  return (
    <header className="absolute top-0 left-0 w-full px-8 md:px-12 py-6 flex justify-between items-center z-50 pointer-events-none">
      {/* Logo (Left) - Removed */}
      <div className="pointer-events-none">
      </div>

      {/* Navigation (Right) */}
      <nav className="pointer-events-auto flex items-center gap-8">
        {/* Text Links */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Magnetic key={link.name}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  if (link.href.startsWith('#')) {
                    const element = document.getElementById(link.href.substring(1))
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
                }}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-black'
                } hover:opacity-60`}
                onMouseEnter={playSound}
              >
                {link.name}
              </a>
            </Magnetic>
          ))}
        </div>

        {/* Contact Button */}
        <Magnetic>
          <MagneticButton
            link="#contact"
            size="small"
            className={`!px-6 !py-2.5 !rounded-full !border !transition-all !duration-300 ${
              isDark
                ? '!border-white/20 !text-white !bg-transparent hover:!bg-[#C6F432] hover:!border-[#C6F432] hover:!text-black [&_span]:!text-white [&_svg]:!text-white [&_span]:group-hover:!text-black [&_svg]:group-hover:!text-black'
                : '!bg-[#111] !border-[#111] !text-white hover:!bg-[#C6F432] hover:!border-[#C6F432] hover:!text-black [&_span]:!text-white [&_svg]:!text-white [&_span]:group-hover:!text-black [&_svg]:group-hover:!text-black'
            }`}
          >
            Contact
          </MagneticButton>
        </Magnetic>
      </nav>
    </header>
  )
}

