'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCursor } from '@/components/cursor/CursorProvider'
import Magnetic from '@/components/cursor/Magnetic'
import MagneticButton from '@/components/ui/MagneticButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ProjectProps {
  title: string
  category: string
  tags: string[]
  image: string
  year: string
}

const projects: ProjectProps[] = [
  {
    title: 'VexLogic AI',
    category: 'SaaS Platform',
    tags: ['AI', 'Next.js', 'WebGL'],
    year: '2025',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  },
  {
    title: 'Neo Bank',
    category: 'Fintech App',
    tags: ['Mobile', 'Finance', 'UX'],
    year: '2024',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop',
  },
  {
    title: 'Design System Pro',
    category: 'Design Platform',
    tags: ['Design', 'UI/UX', 'React'],
    year: '2024',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop',
  },
]

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !titleRef.current || !gridRef.current || !buttonRef.current) return

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.project-card')
      const curveElement = sectionRef.current?.querySelector('.curve-overlay > div') as HTMLElement

      // Animate the curve sliding up over Services section
      if (curveElement) {
        gsap.fromTo(
          curveElement,
          {
            y: '100%', // Start below, hidden
          },
          {
            y: '0%', // Slide up to reveal
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top 60%',
              scrub: 1.5,
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }

      // Initially hide title
      gsap.set(titleRef.current, {
        x: -100,
        opacity: 0,
      })

      // Initially hide cards
      if (cards) {
        gsap.set(cards, {
          y: 80,
          opacity: 0,
          scale: 0.95,
        })
      }

      // Animate title
      gsap.to(titleRef.current, {
        x: 0,
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

      // Stagger animate cards
      if (cards) {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1,
            toggleActions: 'play reverse play reverse',
          },
        })
      }

      // Animate Projects button
      gsap.set(buttonRef.current, {
        y: 40,
        opacity: 0,
      })

      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 50%',
          end: 'top 30%',
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative w-full bg-deep-black py-40 md:py-48 px-4 md:px-12 z-10"
    >
      {/* Curved Overlay - Slides up over Services section */}
      <div className="curve-overlay absolute top-0 left-0 w-full h-[150px] -translate-y-full z-10 overflow-hidden pointer-events-none">
        {/* The Curved Shape - Convex hill */}
        <div className="w-[150%] h-full bg-[#0E0E0E] absolute left-1/2 -translate-x-1/2 rounded-t-[100%] scale-x-125" />
      </div>

      <div className="container mx-auto">
        <h2 ref={titleRef} className="text-fluid-5xl font-bold mb-20 text-white">
          Selected Works
        </h2>
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {/* Projects Button - Centered after projects */}
        <div ref={buttonRef} className="flex justify-center mt-16">
          <Magnetic>
            <MagneticButton link="/coming-soon" size="medium">
              View All Projects
            </MagneticButton>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: ProjectProps }) {
  const { setVariant, setCursorText } = useCursor()

  return (
    <div
      className="project-card group relative w-full aspect-[16/9] bg-[#111111] rounded-3xl overflow-hidden cursor-none mb-12"
      onMouseEnter={() => {
        setVariant('project')
        setCursorText('VIEW CASE')
      }}
      onMouseLeave={() => {
        setVariant('default')
        setCursorText('')
      }}
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-70" />

      {/* Content Layer (Positioned Bottom Left) */}
      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full z-20 flex flex-col items-start transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
        {/* Tags Row */}
        <div className="flex flex-wrap gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black bg-neon-lime rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-fluid-4xl md:text-fluid-5xl font-bold text-white mb-2 leading-tight">
          {project.title}
        </h3>

        {/* Subtitle/Category */}
        <p className="text-gray-400 text-lg md:text-xl font-medium">
          {project.category} — {project.year}
        </p>
      </div>
    </div>
  )
}
