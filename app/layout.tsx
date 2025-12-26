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
  title: 'Taha - BS Computer Science Candidate | Machine Learning & AI',
  description: 'Portfolio of Muhammad Taha Nasim - BS Computer Science Candidate at FAST-NUCES, passionate about Machine Learning & AI. Full-stack developer and innovative problem solver.',
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

