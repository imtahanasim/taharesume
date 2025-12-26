'use client'

import { Github, Linkedin, MessageCircle } from 'lucide-react'
import Magnetic from '@/components/cursor/Magnetic'
import { useCursor } from '@/components/cursor/CursorProvider'
import { useButtonSound } from '@/hooks/useButtonSound'

export default function LeftSidebar() {
  const { setVariant } = useCursor()
  const { playSound } = useButtonSound()

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-24 flex-col items-center justify-between py-12 z-40 pointer-events-none">
      {/* 1. TOP: Logo - Acts as link button */}
      <div className="pointer-events-auto">
        <Magnetic>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('home')
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
            }}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full border border-deep-black/20 bg-transparent text-deep-black transition-all duration-300 hover:bg-[#C6F432] hover:border-[#C6F432] hover:text-black hover:scale-110"
            onMouseEnter={() => {
              setVariant('hover')
              playSound()
            }}
            onMouseLeave={() => setVariant('default')}
          >
            <span className="font-black text-2xl tracking-tighter relative z-10 transition-colors duration-300">
              T.
            </span>
          </a>
        </Magnetic>
      </div>

      {/* 2. MIDDLE: Decorative Line */}
      <div className="flex-1 flex items-center justify-center w-full py-8">
        <div className="relative h-64 w-px bg-gray-300">
          {/* Top Dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-deep-black rounded-full" />

          {/* Center Hollow Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-deep-black rounded-full bg-transparent" />

          {/* Bottom Dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-deep-black rounded-full" />
        </div>
      </div>

      {/* 3. BOTTOM: Social Icons */}
      <div className="flex flex-col gap-4 pointer-events-auto">
        <SocialIcon
          icon={<Linkedin size={18} />}
          href="https://www.linkedin.com/in/muhammad-taha-nasim-296107341"
          label="LinkedIn"
        />
        <SocialIcon
          icon={<MessageCircle size={18} />}
          href="https://wa.me/1234567890"
          label="WhatsApp"
        />
        <SocialIcon
          icon={<Github size={18} />}
          href="https://github.com/imtahanasim"
          label="GitHub"
        />
      </div>
    </div>
  )
}

function SocialIcon({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode
  href: string
  label: string
}) {
  const { setVariant } = useCursor()
  const { playSound } = useButtonSound()

  return (
    <Magnetic>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full border border-deep-black/20 bg-transparent text-deep-black transition-all duration-300 hover:bg-[#C6F432] hover:border-[#C6F432] hover:text-black hover:scale-110"
        aria-label={label}
        onMouseEnter={() => {
          setVariant('hover')
          playSound()
        }}
        onMouseLeave={() => setVariant('default')}
      >
        <span className="relative z-10 transition-colors duration-300">
          {icon}
        </span>
      </a>
    </Magnetic>
  )
}

