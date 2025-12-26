'use client'

import { useRef, useLayoutEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Magnetic from '@/components/cursor/Magnetic'
import { useCursor } from '@/components/cursor/CursorProvider'
import PortraitReveal from '@/components/about/PortraitReveal'
import PillButton from '@/components/ui/PillButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const text = "I&apos;m Taha, a BS Computer Science Candidate at FAST-NUCES, passionate about Machine Learning & AI. I combine technical expertise with innovative solutions to build cutting-edge applications."

const words = text.split(' ')

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const curveRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { setVariant } = useCursor()

  useLayoutEffect(() => {
    if (!ref.current || !contentRef.current || !curveRef.current) return

    const ctx = gsap.context(() => {
      const curveElement = curveRef.current?.querySelector('div') as HTMLElement

      if (!curveElement) return

      // Initially hide the content (translate down and fade out)
      gsap.set(contentRef.current, {
        y: 200,
        opacity: 0,
      })

      // Initially hide the curve - start with a flat line at the bottom
      gsap.set(curveElement, {
        clipPath: 'ellipse(100% 0% at 50% 100%)', // Completely flat, no curve
        opacity: 0,
      })

      // Create a timeline for coordinated animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1, // Smooth scrubbing linked to scroll
          toggleActions: 'play reverse play reverse', // Works both directions
        },
      })

      // Step 1: Fade in and reveal the curve from bottom to top
      tl.to(curveElement, {
        opacity: 1,
        clipPath: 'ellipse(75% 100% at 50% 100%)', // Full curve revealed
        duration: 0.6,
        ease: 'power2.out',
      })

      // Step 2: Content slides up through the curve
      tl.to(
        contentRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3' // Start slightly before curve completes
      )
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen w-full bg-transparent z-10"
    >
      {/* The Curve Shape - Convex hill at the top */}
      <div ref={curveRef} className="relative z-10">
        <div
          className="absolute bottom-0 left-0 w-full h-[15vh] bg-deep-black z-10"
          style={{
            clipPath: 'ellipse(75% 100% at 50% 100%)',
          }}
        />
      </div>

      {/* The actual content with dark background */}
      <div ref={contentRef} className="relative z-10 bg-deep-black pt-32 pb-64">
        <div className="container mx-auto px-8 py-24">
          {/* Portrait Section - Above the text */}
          <div className="mb-16">
            <PortraitReveal />
          </div>

          <div className="max-w-3xl">
          <motion.p
            className="text-fluid-xl text-white/80 leading-relaxed"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {words.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                variants={{
                  hidden: { opacity: 0.2 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.3,
                    },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <div className="mt-12">
            <Magnetic>
              <a
                href="/coming-soon"
                onMouseEnter={() => {
                  setVariant('hover')
                }}
                onMouseLeave={() => setVariant('default')}
              >
                <PillButton
                  onMouseEnter={() => {
                    setVariant('hover')
                  }}
                  onMouseLeave={() => setVariant('default')}
                >
                  About Me
                </PillButton>
              </a>
            </Magnetic>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
