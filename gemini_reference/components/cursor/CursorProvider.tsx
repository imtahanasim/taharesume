'use client'

import React, { createContext, useContext, useState } from 'react'

type CursorVariant = 'default' | 'hover' | 'text' | 'project'

interface CursorContextType {
  variant: CursorVariant
  setVariant: (variant: CursorVariant) => void
  cursorText: string
  setCursorText: (text: string) => void
}

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>('default')
  const [cursorText, setCursorText] = useState<string>('')

  return (
    <CursorContext.Provider value={{ variant, setVariant, cursorText, setCursorText }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider')
  }
  return context
}

