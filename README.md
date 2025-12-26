# Aziz Portfolio - Full-stack Developer Portfolio

A pixel-perfect, high-performance portfolio website built with Next.js 14, React Three Fiber, GSAP, and Framer Motion.

## Features

- **3D Glass Blob Hero** - Interactive 3D glass sphere with liquid wobble animation
- **Custom Cursor** - Magnetic cursor with multiple states (default, hover, text, project)
- **Smooth Scroll** - Lenis-powered smooth scrolling with custom easing
- **Curtain Reveal** - Sticky hero section with dark content sliding over
- **Green Line Timeline** - SVG path animation synced with scroll
- **Project Gallery** - Interactive project cards with hover effects
- **Experience Timeline** - Sticky dates with alternating layout
- **3D Robot Mascot** - Interactive robot in footer that follows mouse
- **Full-screen Navigation** - Animated overlay menu

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D**: React Three Fiber, Three.js, Drei
- **Animations**: GSAP (ScrollTrigger), Framer Motion
- **Smooth Scroll**: Lenis
- **Fonts**: Manrope (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── 3d/
│   │   └── BlobScene.tsx   # 3D glass blob component
│   ├── cursor/
│   │   ├── Cursor.tsx      # Custom cursor component
│   │   ├── CursorProvider.tsx  # Cursor context
│   │   └── Magnetic.tsx    # Magnetic hover effect
│   ├── navigation/
│   │   └── Navigation.tsx  # Full-screen nav
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── MarqueeSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   └── FooterSection.tsx
│   └── smooth-scroll/
│       └── SmoothScroll.tsx
└── lib/
    └── utils.ts            # Utility functions
```

## Customization

### Colors

Edit `tailwind.config.ts` to customize colors:
- `neon-lime`: #C6F432
- `off-white`: #F0F0F0
- `deep-black`: #0E0E0E

### 3D Blob

Modify `components/3d/BlobScene.tsx` to adjust:
- Wobble intensity (noise multiplier)
- Rotation speed
- Glass material properties

### Smooth Scroll

Adjust Lenis settings in `components/smooth-scroll/SmoothScroll.tsx`:
- `duration`: Scroll duration
- `easing`: Custom easing function

## Performance Tips

- Use `next/image` for optimized images
- Lazy load 3D components when possible
- Consider reducing blob geometry segments on mobile
- Use `will-change` CSS property for animated elements

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

