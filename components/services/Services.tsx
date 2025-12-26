'use client'

import { Code2, Layout, Globe, Server, LucideIcon } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

const services: Service[] = [
  {
    id: '01',
    title: 'Full Stack Development',
    description: 'Building scalable and high-performance web applications using Next.js, React, Node.js, and TypeScript, with robust backend architectures.',
    icon: Code2,
  },
  {
    id: '02',
    title: 'UI/UX Design & Frontend',
    description: 'Designing modern, responsive interfaces with Figma, Tailwind CSS, and Framer Motion. Creating intuitive experiences with clean design systems.',
    icon: Layout,
  },
  {
    id: '03',
    title: 'SaaS Platform Development',
    description: 'Developing end-to-end SaaS solutions with subscription systems, Stripe billing, and multi-tenant management.',
    icon: Globe,
  },
  {
    id: '04',
    title: 'API & System Architecture',
    description: 'Designing maintainable APIs with PostgreSQL, Prisma, and MongoDB. Focusing on performance optimization and security.',
    icon: Server,
  },
]

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon

  return (
    <motion.div
      className="service-card group flex flex-col items-start p-8 border-l border-black/10 hover:bg-white/50 transition-colors duration-300"
    >
      {/* Header: Icon & Number */}
      <div className="w-full flex justify-between items-start mb-8">
        {/* Icon Container */}
        <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#C6F432] group-hover:border-transparent">
          <Icon className="w-5 h-5 text-black" />
        </div>
        {/* Number */}
        <span className="text-xl font-medium text-black/30 font-mono">
          {service.id}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-black mb-4 leading-tight">
        {service.title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        {service.description}
      </p>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useLayoutEffect(() => {
    if (!ref.current || !containerRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll('.service-card')
      const worksSection = document.getElementById('works')

      if (!cards || !worksSection) return

      // Initially hide cards
      gsap.set(cards, {
        y: 60,
        opacity: 0,
        scale: 0.9,
      })

      // Stagger animation for cards
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          end: 'top 45%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })

      // Parallax effect: Services content moves slower as Works section approaches
      // This creates the "sticky" effect where white section moves slower
      gsap.to(contentRef.current, {
        y: '15%', // Moves down slower, creating parallax depth
        ease: 'power1.out',
        scrollTrigger: {
          trigger: worksSection,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 1.5, // Slightly slower for smoother effect
          toggleActions: 'play reverse play reverse',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#F0F0F0] py-40 md:py-48 px-4 md:px-12 z-0"
    >
      <div ref={contentRef} className="relative">
        <div ref={containerRef} className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

