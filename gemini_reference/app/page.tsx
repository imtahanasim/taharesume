'use client'

import HeroSection from '@/components/sections/HeroSection'
import HelloSection from '@/components/sections/HelloSection'
import AboutSection from '@/components/sections/AboutSection'
import MarqueeSection from '@/components/sections/MarqueeSection'
import Services from '@/components/services/Services'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import ExperienceTimeline from '@/components/experience/ExperienceTimeline'
import MarqueeSeparator from '@/components/ui/MarqueeSeparator'
import FooterSection from '@/components/sections/FooterSection'
import Navigation from '@/components/navigation/Navigation'
import Header from '@/components/header/Header'
import TheLine from '@/components/green-line/TheLine'
import BackgroundMusic from '@/components/audio/BackgroundMusic'

export default function Home() {
  return (
    <main className="relative">
      <BackgroundMusic />
      <Navigation />
      <HelloSection />
      <HeroSection>
        <Header />
      </HeroSection>
      <div id="dark-content" className="relative overflow-hidden">
        <TheLine />
        <AboutSection />
        <MarqueeSection />
        <Services />
        <ProjectsSection />
        <ExperienceTimeline />
        <TimelineSection />
        <MarqueeSeparator />
        <FooterSection />
      </div>
    </main>
  )
}

