'use client'

import { CursorProvider } from '@/components/cursor/CursorProvider'
import Cursor from '@/components/cursor/Cursor'
import SmoothScroll from '@/components/smooth-scroll/SmoothScroll'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CursorProvider>
      <SmoothScroll>
        {children}
      </SmoothScroll>
      <Cursor />
    </CursorProvider>
  )
}

