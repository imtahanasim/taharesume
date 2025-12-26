'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ExperienceItem {
  id: number
  role: string
  company: string
  period: string
  description: string
}

const experienceData: ExperienceItem[] = [
  {
    id: 1,
    role: 'Senior Frontend Engineer',
    company: 'Tech Giant Corp',
    period: '2024',
    description: 'Leading the design system team and rebuilding the core product dashboard using Next.js 14.',
  },
  {
    id: 2,
    role: 'Creative Developer',
    company: 'Digital Agency X',
    period: '2022',
    description: 'Built award-winning immersive web experiences for luxury brands using WebGL and GSAP.',
  },
  {
    id: 3,
    role: 'UI/UX Designer',
    company: 'Freelance',
    period: '2020',
    description: 'Designed mobile applications and design systems for early-stage fintech startups.',
  },
]

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const curveRef = useRef<HTMLDivElement>(null)
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set())

  useLayoutEffect(() => {
    if (!containerRef.current || !lineRef.current) return

    const ctx = gsap.context(() => {
      const nodes = containerRef.current?.querySelectorAll('.timeline-node')
      if (!nodes || nodes.length === 0) return

      // Calculate node positions based on their actual DOM positions
      const calculateNodePositions = () => {
        const contentContainer = containerRef.current?.querySelector('.relative.flex.flex-col') as HTMLElement
        if (!contentContainer || !containerRef.current) return []
        
        const containerTop = containerRef.current.offsetTop
        const containerHeight = containerRef.current.offsetHeight
        const nodePositions: number[] = []
        
        nodes.forEach((node) => {
          const nodeElement = node as HTMLElement
          const nodeParent = nodeElement.closest('.relative.grid') as HTMLElement
          if (!nodeParent) return
          
          const nodeTop = nodeParent.offsetTop - containerTop
          const nodePosition = nodeTop / containerHeight
          nodePositions.push(Math.max(0, Math.min(1, nodePosition)))
        })
        
        return nodePositions
      }
      
      // Wait for layout to settle before calculating
      let nodePositions: number[] = []
      let resizeHandler: (() => void) | null = null
      
      const timer = setTimeout(() => {
        nodePositions = calculateNodePositions()
        
        // Recalculate on resize
        resizeHandler = () => {
          setTimeout(() => {
            nodePositions = calculateNodePositions()
          }, 100)
        }
        window.addEventListener('resize', resizeHandler)

        // Animate the Green Line height (the snake)
        gsap.to(lineRef.current, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress

              // Calculate which nodes are active based on scroll progress
              const newActiveNodes = new Set<number>()
              nodePositions.forEach((nodePosition, index) => {
                // If snake progress has passed this node position, activate it
                if (progress >= nodePosition) {
                  newActiveNodes.add(index)
                }
              })

              setActiveNodes(newActiveNodes)
            },
          },
        })
      }, 100)
      
      return () => {
        clearTimeout(timer)
        if (resizeHandler) {
          window.removeEventListener('resize', resizeHandler)
        }
      }
    }, containerRef)

    // Curve animation for transition to MarqueeSeparator
    if (curveRef.current) {
      const curveElement = curveRef.current?.querySelector('div') as HTMLElement

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
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'top 60%',
              scrub: 1.5,
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      }
    }

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative bg-deep-black min-h-screen py-40 md:py-48 px-4 md:px-12 text-white"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Central Axis - Grey Track */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-800 -translate-x-1/2 z-10">
          {/* The Snake (Green Line) */}
          <div
            ref={lineRef}
            className="absolute top-0 left-0 w-full bg-[#C6F432] h-0 origin-top"
            style={{ transformOrigin: 'top' }}
          >
            {/* The Head (Glowing Dot) */}
            <div
              ref={headRef}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C6F432] rounded-full shadow-[0_0_10px_#C6F432] md:shadow-[0_0_20px_#C6F432] translate-y-1/2 z-20"
            />
          </div>
        </div>

        {/* Grid Content */}
        <div className="relative flex flex-col gap-48">
          {experienceData.map((item, index) => (
            <TimelineItem
              key={item.id}
              data={item}
              index={index}
              isActive={activeNodes.has(index)}
              totalItems={experienceData.length}
            />
          ))}
        </div>
      </div>

      {/* Curved Overlay - Slides up over MarqueeSeparator section */}
      <div
        ref={curveRef}
        className="curve-overlay absolute bottom-0 left-0 w-full h-[200px] translate-y-full z-10 overflow-hidden pointer-events-none"
      >
        {/* The Curved Shape - Convex hill with gradient */}
        <div className="w-[150%] h-full bg-[#F5F5F5] absolute left-1/2 -translate-x-1/2 rounded-b-[100%] scale-x-125 shadow-[0_-10px_30px_rgba(245,245,245,0.2)] md:shadow-[0_-20px_60px_rgba(245,245,245,0.3)]" />
      </div>
    </section>
  )
}

function TimelineItem({
  data,
  index,
  isActive,
  totalItems,
}: {
  data: ExperienceItem
  index: number
  isActive: boolean
  totalItems: number
}) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] gap-8 items-center min-h-[200px]">
      {/* Left Side */}
      <div className={isEven ? 'text-right order-1' : 'text-right order-1'}>
        {isEven ? (
          // Content for Even (Left)
          <div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {data.role}
            </h3>
            <p className="text-[#C6F432] font-medium mb-4">{data.company}</p>
            <p className="text-gray-400 leading-relaxed max-w-sm ml-auto">
              {data.description}
            </p>
          </div>
        ) : (
          // Date for Odd (Left)
          <span className="text-6xl md:text-8xl font-black text-gray-800 opacity-50 select-none">
            {data.period}
          </span>
        )}
      </div>

      {/* Center Axis - Node */}
      <div className="relative flex justify-center items-center order-2 z-20">
        <div
          ref={nodeRef}
          className={`timeline-node w-4 h-4 rounded-full border-2 border-[#C6F432] transition-all duration-300 ${
            isActive
              ? 'bg-[#C6F432] shadow-[0_0_8px_#C6F432] md:shadow-[0_0_15px_#C6F432] scale-125'
              : 'bg-transparent border-gray-600'
          }`}
        />
      </div>

      {/* Right Side */}
      <div className={isEven ? 'text-left order-3' : 'text-left order-3'}>
        {isEven ? (
          // Date for Even (Right)
          <span className="text-6xl md:text-8xl font-black text-gray-800 opacity-50 select-none">
            {data.period}
          </span>
        ) : (
          // Content for Odd (Right)
          <div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {data.role}
            </h3>
            <p className="text-[#C6F432] font-medium mb-4">{data.company}</p>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              {data.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

