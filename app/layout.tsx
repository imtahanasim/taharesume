import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/Providers'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Taha - Full-stack Developer',
  description: 'Portfolio of Taha - Full-stack Developer & UI/UX Designer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

