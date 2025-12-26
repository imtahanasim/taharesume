import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-lime': '#C6F432',
        'off-white': '#F0F0F0',
        'deep-black': '#0E0E0E',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

