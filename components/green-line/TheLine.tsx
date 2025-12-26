'use client'

import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TheLine() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(5000)

  // Calculate container height using ResizeObserver
  useEffect(() => {
    const darkContent = document.getElementById('dark-content')
    if (!darkContent) return

    const updateHeight = () => {
      const height = darkContent.offsetHeight
      setContainerHeight(height)
    }

    // Initial height
    updateHeight()

    // Use ResizeObserver to track height changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
      ScrollTrigger.refresh()
    })

    resizeObserver.observe(darkContent)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useLayoutEffect(() => {
    if (!pathRef.current || !svgRef.current) return

    const path = pathRef.current
    const pathLength = path.getTotalLength()

    // Reset positioning
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    })

    const trigger = ScrollTrigger.create({
      trigger: '#dark-content',
      start: 'top center',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        // Manually animate offset for maximum performance
        gsap.to(path, {
          strokeDashoffset: pathLength - (pathLength * self.progress),
          duration: 0.1,
          ease: 'none',
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [containerHeight])

  // Create a wrapping path that goes to extreme left, then wraps to extreme right
  // Using normalized coordinates: X is percentage (0-100), Y is percentage of height (0-100)
  // The path snakes through the Services section (light background) between columns 2 and 3
  const createPath = (height: number) => {
    const scaleY = (percent: number) => (percent / 100) * height
    
    // Create wrapping effect: line goes to extreme left, then wraps to extreme right
    // Start at top-right (near 95%, near top) - coming from portrait/About section
    let path = `M 95 ${scaleY(1)}`
    
    // Curve 1: Curve down and towards extreme left (through About section)
    path += ` C 92 ${scaleY(5)}, 85 ${scaleY(10)}, 70 ${scaleY(15)}`
    
    // Curve 2: Continue curving to extreme left (through Marquee/Stats section)
    path += ` C 50 ${scaleY(20)}, 20 ${scaleY(25)}, 2 ${scaleY(30)}`
    
    // Curve 3: Stay at extreme left, move down (end of Stats section)
    path += ` C 1 ${scaleY(35)}, 2 ${scaleY(38)}, 2 ${scaleY(40)}`
    
    // Curve 4: Snake through Services section - curve between columns 2 and 3 (around 50-60% horizontal)
    // This creates the effect of the line going behind the service cards
    path += ` C 2 ${scaleY(42)}, 45 ${scaleY(45)}, 55 ${scaleY(48)}`
    path += ` C 60 ${scaleY(50)}, 55 ${scaleY(52)}, 50 ${scaleY(54)}`
    path += ` C 45 ${scaleY(56)}, 2 ${scaleY(58)}, 2 ${scaleY(60)}`
    
    // Curve 5: Continue down and prepare for Projects section
    path += ` C 2 ${scaleY(62)}, 5 ${scaleY(65)}, 10 ${scaleY(68)}`
    
    // Curve 6: Wrap to near right (through Projects section) - avoiding extreme right edge
    path += ` C 50 ${scaleY(72)}, 95 ${scaleY(75)}, 95 ${scaleY(78)}`
    
    // Curve 7: Stay near right, move down - avoiding extreme right edge
    path += ` C 96 ${scaleY(80)}, 95 ${scaleY(82)}, 95 ${scaleY(85)}`
    
    // Curve 8: Wrap back to extreme left (through Timeline section)
    path += ` C 95 ${scaleY(87)}, 50 ${scaleY(90)}, 2 ${scaleY(93)}`
    
    // Curve 9: Stay at extreme left, then curve towards center-bottom (Footer)
    path += ` C 2 ${scaleY(95)}, 5 ${scaleY(97)}, 50 ${scaleY(98)}`
    
    return path
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ height: `${containerHeight}px` }}
    >
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 100 ${containerHeight}`}
        style={{ height: `${containerHeight}px` }}
      >
        <defs>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          d={createPath(containerHeight)}
          stroke="#C6F432"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-line)"
          style={{
            filter: 'drop-shadow(0px 0px 6px rgba(198, 244, 50, 0.4))',
            opacity: 0.9,
          }}
        />
      </svg>
    </div>
  )
}

