'use client'

import { useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const experience = [
  {
    id: 1,
    role: 'Senior Frontend Engineer',
    company: 'Tech Giant Corp',
    period: '2024 - Present',
    description: 'Leading the design system team and rebuilding the core product dashboard using Next.js 14.',
  },
  {
    id: 2,
    role: 'Creative Developer',
    company: 'Digital Agency X',
    period: '2022 - 2024',
    description: 'Built award-winning immersive web experiences for luxury brands using WebGL and GSAP.',
  },
  {
    id: 3,
    role: 'UI/UX Designer',
    company: 'Freelance',
    period: '2020 - 2022',
    description: 'Designed mobile applications and design systems for early-stage fintech startups.',
  },
]

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !titleRef.current || !timelineRef.current) return

    const ctx = gsap.context(() => {
      const items = timelineRef.current?.querySelectorAll('.timeline-item')

      // Initially hide title
      gsap.set(titleRef.current, {
        y: -50,
        opacity: 0,
      })

      // Initially hide timeline items
      if (items) {
        gsap.set(items, {
          x: (index) => (index % 2 === 0 ? -100 : 100),
          opacity: 0,
        })
      }

      // Animate title
      gsap.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })

      // Stagger animate timeline items
      if (items) {
        gsap.to(items, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-deep-black py-40 md:py-48 px-4 md:px-12 text-white"
    >
      <h2
        ref={titleRef}
        className="text-fluid-5xl md:text-fluid-6xl font-bold text-center mb-24 uppercase tracking-tighter"
      >
        Experience
      </h2>

      <div ref={timelineRef} className="max-w-7xl mx-auto flex flex-col gap-0">
        {experience.map((item, index) => (
          <ExperienceItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}

function ExperienceItem({ item, index }: { item: typeof experience[0]; index: number }) {
  const isEven = index % 2 === 0

  return (
    <div className="timeline-item grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-4 md:gap-8 items-center mb-20">
      {/* Mobile: Content First */}
      <div
        className={`md:hidden order-1 ${
          isEven ? 'text-left' : 'text-left'
        } border-l-2 border-neon-lime pl-6`}
      >
        <h3 className="text-2xl font-bold text-white">{item.role}</h3>
        <p className="text-neon-lime font-medium mt-1">{item.company}</p>
        <p className="text-gray-400 mt-4 leading-relaxed">{item.description}</p>
        <span className="text-3xl font-bold text-gray-800 opacity-50 select-none mt-4 block">
          {item.period}
        </span>
      </div>

      {/* Desktop: LEFT SIDE */}
      <div
        className={`hidden md:block text-right ${
          isEven ? 'order-1 md:text-right' : 'order-1 md:order-3 md:text-left'
        }`}
      >
        {isEven ? (
          // Content for Even (Left)
          <>
            <h3 className="text-2xl md:text-4xl font-bold text-white">{item.role}</h3>
            <p className="text-neon-lime font-medium mt-1">{item.company}</p>
            <p className="text-gray-400 mt-4 leading-relaxed max-w-sm ml-auto">
              {item.description}
            </p>
          </>
        ) : (
          // Date for Odd (Left side gets date)
          <span className="text-4xl md:text-6xl font-bold text-gray-800 opacity-50 select-none">
            {item.period}
          </span>
        )}
      </div>

      {/* CENTER AXIS (The Dot) */}
      <div className="order-2 flex justify-center relative h-full">
        {/* Mobile: Left border line */}
        <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-neon-lime" />
        
        {/* The Glowing Node */}
        <div className="relative w-4 h-4 bg-neon-lime rounded-full z-20 shadow-[0_0_8px_rgba(198,244,50,0.6)] md:shadow-[0_0_15px_rgba(198,244,50,0.8)]">
          {/* Optional inner white dot for detail */}
          <div className="absolute inset-0 m-auto w-1 h-1 bg-black rounded-full" />
        </div>
      </div>

      {/* Desktop: RIGHT SIDE */}
      <div
        className={`hidden md:block text-left ${
          isEven ? 'order-3 md:text-left' : 'order-3 md:order-1 md:text-right'
        }`}
      >
        {isEven ? (
          // Date for Even (Right side gets date)
          <span className="text-4xl md:text-6xl font-bold text-gray-800 opacity-50 select-none">
            {item.period}
          </span>
        ) : (
          // Content for Odd (Right side gets content)
          <>
            <h3 className="text-2xl md:text-4xl font-bold text-white">{item.role}</h3>
            <p className="text-neon-lime font-medium mt-1">{item.company}</p>
            <p className="text-gray-400 mt-4 leading-relaxed max-w-sm mr-auto">
              {item.description}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
