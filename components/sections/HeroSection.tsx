'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import BlobScene from '@/components/3d/BlobScene'
import MagneticButton from '@/components/ui/MagneticButton'
import LeftSidebar from '@/components/hero/LeftSidebar'
import RightSidebar from '@/components/hero/RightSidebar'

export default function HeroSection({ children }: { children?: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      setOpacity(Math.max(0, 1 - y / 50))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="home" className="h-screen w-full sticky top-0 z-0 bg-off-white relative">
      {/* Left Sidebar Navigation */}
      <LeftSidebar />
      
      {/* Right Sidebar - Name */}
      <RightSidebar />
      
      {/* Header - Only visible in hero section */}
      {children}
      
      {/* Hero Text - On top of the blob */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        <p className="text-fluid-xl font-light text-deep-black mb-6">
          Hi! i&apos;m Taha
        </p>
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-fluid-6xl font-bold text-deep-black leading-tight text-center">
            BS Computer Science 
          </h1>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-deep-black" />
            <h1 className="text-fluid-6xl font-bold text-deep-black leading-tight">
            Candidate at FAST-NUCES
            </h1>
          </div>
        </div>
        
        {/* Projects Button */}
        <div className="mt-12">
          <MagneticButton link="/coming-soon" size="medium" className="border-deep-black/20 text-deep-black hover:border-[#C6F432] hover:bg-[#C6F432] hover:text-black [&_span]:text-deep-black [&_svg]:text-deep-black [&_span]:group-hover:text-black [&_svg]:group-hover:text-black">
            See Projects
          </MagneticButton>
        </div>
      </div>

      {/* 3D Blob Canvas - In the background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          className="w-full h-full"
        >
          <BlobScene />
        </Canvas>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        style={{ opacity }}
      >
        <p className="text-sm text-deep-black/60 uppercase tracking-wider">
          Scroll Down
        </p>
      </div>
    </section>
  )
}

