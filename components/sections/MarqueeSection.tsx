'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const marqueeRef = useRef(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })

  useLayoutEffect(() => {
    if (!sectionRef.current || !marqueeRef.current || !statsRef.current) return

    const ctx = gsap.context(() => {
      const statsContainer = statsRef.current as HTMLElement

      // Initially hide stats
      gsap.set(statsContainer, {
        y: 80,
        opacity: 0,
      })

      // Animate stats in on scroll
      gsap.to(statsContainer, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-deep-black py-40 md:py-48 overflow-hidden">
      {/* Marquee */}
      <div className="relative mb-32">
        <motion.div
          ref={marqueeRef}
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 20,
              ease: 'linear',
            },
          }}
        >
          <div className="text-fluid-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white to-transparent [-webkit-text-stroke:1px_white] mx-4">
            BS COMPUTER SCIENCE CANDIDATE AT FAST-NUCES | MACHINE LEARNING & AI
          </div>
          <div className="text-fluid-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white to-transparent [-webkit-text-stroke:1px_white] mx-4">
            BS COMPUTER SCIENCE CANDIDATE AT FAST-NUCES | MACHINE LEARNING & AI
          </div>
          <div className="text-fluid-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-transparent via-white to-transparent [-webkit-text-stroke:1px_white] mx-4">
            BS COMPUTER SCIENCE CANDIDATE AT FAST-NUCES | MACHINE LEARNING & AI
          </div>
        </motion.div>
      </div>

      {/* Stats Counter */}
      <div ref={statsRef} className="container mx-auto px-8">
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StatCounter label="Experience" target={30} suffix="+" isInView={statsInView} />
          <StatCounter label="Projects" target={50} suffix="+" isInView={statsInView} />
          <StatCounter label="Clients" target={20} suffix="+" isInView={statsInView} />
        </div>
      </div>
    </section>
  )
}

function StatCounter({
  label,
  target,
  suffix,
  isInView,
}: {
  label: string
  target: number
  suffix: string
  isInView: boolean
}) {
  const controls = useAnimation()

  if (isInView) {
    controls.start({
      scale: [0, 1],
      transition: { duration: 0.5 },
    })
  }

  return (
    <motion.div
      className="text-center"
      animate={controls}
    >
      <motion.div
        className="text-fluid-4xl font-bold text-neon-lime mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2 }}
      >
        {isInView ? (
          <Counter target={target} suffix={suffix} />
        ) : (
          `0${suffix}`
        )}
      </motion.div>
      <p className="text-white/60 text-sm uppercase tracking-wider">{label}</p>
    </motion.div>
  )
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [target])

  return <span>{count}{suffix}</span>
}

