'use client'

import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Phone, Mail } from 'lucide-react'
import Robot from '@/components/footer/Robot'
import { useCursor } from '@/components/cursor/CursorProvider'
import MagneticButton from '@/components/ui/MagneticButton'
import Magnetic from '@/components/cursor/Magnetic'
import PillButton from '@/components/ui/PillButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tahaRef = useRef<HTMLHeadingElement>(null)
  const { setVariant } = useCursor()
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Pakistan Standard Time (PKT) is UTC+5
      // Get UTC time components
      const utcHours = now.getUTCHours()
      const utcMinutes = now.getUTCMinutes()
      const utcSeconds = now.getUTCSeconds()
      
      // Add 5 hours for Pakistan time
      let hours = utcHours + 5
      if (hours >= 24) hours -= 24
      
      const minutes = utcMinutes
      const seconds = utcSeconds
      
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')
      const displaySeconds = seconds.toString().padStart(2, '0')
      
      setCurrentTime(`${displayHours}:${displayMinutes}:${displaySeconds} ${ampm} PKT`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000) // Update every second to show seconds

    return () => clearInterval(interval)
  }, [])

  useLayoutEffect(() => {
    if (!footerRef.current || !contentRef.current || !tahaRef.current) return

    const ctx = gsap.context(() => {
      // Initially hide content
      gsap.set(contentRef.current, {
        y: 100,
        opacity: 0,
      })

      // Initially hide TAHA text
      gsap.set(tahaRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
      })

      // Animate content in
      gsap.to(contentRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })

      // Animate TAHA text
      gsap.to(tahaRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 70%',
          end: 'top 50%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const socialLinks = [
    { name: 'Email', url: 'mailto:tahanasimaps@gmail.com' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-taha-nasim-296107341' },
    { name: 'WhatsApp', url: 'https://wa.me/923345723602' },
    { name: 'GitHub', url: 'https://github.com/imtahanasim' },
  ]

  return (
    <footer ref={footerRef} className="relative w-full bg-deep-black min-h-[80vh]">
      {/* Crossed Marquee Divider */}
      <div className="relative h-[200px] overflow-hidden -mt-20 z-20">
        {/* Tape 1 - White background, black text, straight (no rotation) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] bg-white text-black py-6 shadow-xl border-y border-black/10"
          style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
        >
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: '-50%',
            }}
            initial={{
              x: '0%',
            }}
            transition={{
                repeat: Infinity,
              ease: 'linear',
                duration: 20,
            }}
          >
            {Array(8).fill("LET'S WORK TOGETHER — ").map((t, i) => (
              <span
                key={i}
                className="text-fluid-3xl md:text-fluid-4xl font-black tracking-wider flex items-center gap-4"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div ref={contentRef} className="relative container mx-auto px-4 md:px-12 py-20">
        {/* Top Row - Socials and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left: Socials + Contact Buttons */}
          <div>
            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4">
              SOCIALS
            </h3>
            <ul className="flex flex-col gap-2 mb-8">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-lg inline-block hover:translate-x-1"
                    onMouseEnter={() => setVariant('hover')}
                    onMouseLeave={() => setVariant('default')}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Contact Buttons */}
            <div className="flex flex-col gap-3">
              <Magnetic>
                <a
                  href="tel:+923345723602"
                  onMouseEnter={() => setVariant('hover')}
                  onMouseLeave={() => setVariant('default')}
                >
                  <PillButton
                    icon={Phone}
                    onMouseEnter={() => setVariant('hover')}
                    onMouseLeave={() => setVariant('default')}
                  >
                    +923345723602
                  </PillButton>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="mailto:tahanasimaps@gmail.com"
                  onMouseEnter={() => setVariant('hover')}
                  onMouseLeave={() => setVariant('default')}
                >
                  <PillButton
                    icon={Mail}
                    onMouseEnter={() => setVariant('hover')}
                    onMouseLeave={() => setVariant('default')}
                  >
                    tahanasimaps@gmail.com
                  </PillButton>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right: Local Time */}
          <div className="md:text-right">
            <div className="text-white/60 text-sm uppercase tracking-wider mb-4">
              Pakistan Time
            </div>
            <div 
              className="text-white text-2xl md:text-3xl mb-4 font-bold tracking-wider"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                letterSpacing: '0.1em',
                textShadow: '0 0 10px rgba(198, 244, 50, 0.3)',
              }}
            >
              {currentTime}
            </div>
            <div className="text-gray-400 text-sm">2025 Edition</div>
          </div>
        </div>

        {/* Center: 3D Robot */}
        <div className="flex justify-center mb-12 -mt-8">
          <Robot />
        </div>

        {/* CTA Button - Between Robot and TAHA */}
        <div className="flex justify-center mb-12" id="footer-cta">
          <Magnetic>
            <a
              href="mailto:tahanasimaps@gmail.com"
              onMouseEnter={() => setVariant('hover')}
              onMouseLeave={() => setVariant('default')}
            >
              <PillButton
                onMouseEnter={() => setVariant('hover')}
                onMouseLeave={() => setVariant('default')}
              >
                Get in touch
              </PillButton>
            </a>
          </Magnetic>
        </div>

        {/* Bottom: Massive TAHA Text */}
        <div className="relative -mt-8">
          <h2
            ref={tahaRef}
            className="text-[20vw] font-black leading-[0.8] text-center text-white select-none"
            style={{
              fontFamily: 'var(--font-manrope)',
            }}
          >
            TAHA
          </h2>
        </div>
      </div>
    </footer>
  )
}
