'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import MagneticButton from '@/components/ui/MagneticButton'

const LocalSnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Game Constants
  const GRID_SIZE = 20
  const COLS = 25 // 500px width
  const ROWS = 15 // 300px height
  const CANVAS_WIDTH = COLS * GRID_SIZE
  const CANVAS_HEIGHT = ROWS * GRID_SIZE
  const GAME_SPEED = 100 // ms per frame

  // Game state references
  const snake = useRef([{ x: 5, y: 7 }])
  const direction = useRef({ x: 1, y: 0 })
  const nextDirection = useRef({ x: 1, y: 0 })
  const food = useRef({ x: 15, y: 7 })
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const generateFood = useCallback(() => {
    let newFood
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      }
      // Make sure food doesn't spawn on the snake
      const onSnake = snake.current.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
      if (!onSnake) break
    }
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    snake.current = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }]
    direction.current = { x: 1, y: 0 }
    nextDirection.current = { x: 1, y: 0 }
    food.current = generateFood()
    setScore(0)
  }, [generateFood])

  const drawAll = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas - White Background for light theme
    ctx.fillStyle = '#FFFFFF' 
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw Grid (Subtle grey lines)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < COLS; i++) {
      ctx.beginPath()
      ctx.moveTo(i * GRID_SIZE, 0)
      ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT)
      ctx.stroke()
    }
    for (let i = 0; i < ROWS; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * GRID_SIZE)
      ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE)
      ctx.stroke()
    }

    // Draw Food (Neon Lime with black stroke for contrast on white)
    ctx.fillStyle = '#C6F432'
    ctx.fillRect(food.current.x * GRID_SIZE + 2, food.current.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(food.current.x * GRID_SIZE + 2, food.current.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4)

    // Draw Snake
    snake.current.forEach((segment, index) => {
      // Head is Neon Lime, Body is Deep Black for maximum contrast
      ctx.fillStyle = index === 0 ? '#C6F432' : '#111111' 
      
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      )

      // Add stroke to the head so it pops against the white background
      if (index === 0) {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        ctx.strokeRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        )
      }
    })

    // Draw Overlays
    if (gameState !== 'playing') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)' // Light overlay
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.fillStyle = '#000000' // Dark text
      ctx.font = 'bold 16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(
        gameState === 'idle' ? 'CLICK TO START - USE ARROWS/WASD' : 'GAME OVER - CLICK TO RESTART',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2
      )
    }
  }, [gameState])

  const update = useCallback(() => {
    if (gameState !== 'playing') return

    direction.current = nextDirection.current
    const head = snake.current[0]
    const newHead = {
      x: head.x + direction.current.x,
      y: head.y + direction.current.y,
    }

    // Collision detection (Walls)
    if (
      newHead.x < 0 ||
      newHead.x >= COLS ||
      newHead.y < 0 ||
      newHead.y >= ROWS
    ) {
      setGameState('gameOver')
      return
    }

    // Collision detection (Self)
    if (
      snake.current.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )
    ) {
      setGameState('gameOver')
      return
    }

    snake.current.unshift(newHead)

    // Check if food eaten
    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      setScore((s) => s + 10)
      food.current = generateFood()
    } else {
      snake.current.pop() // Remove tail if no food eaten
    }
  }, [gameState, generateFood])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        update()
        drawAll(ctx)
      }, GAME_SPEED)
    } else {
      drawAll(ctx)
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameState, update, drawAll])

  useEffect(() => {
    if (score > highScore) setHighScore(score)
  }, [score, highScore])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      if (gameState !== 'playing') {
        if (e.code === 'Space') {
          resetGame()
          setGameState('playing')
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.current.y !== 1) nextDirection.current = { x: 0, y: -1 }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.current.y !== -1) nextDirection.current = { x: 0, y: 1 }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.current.x !== 1) nextDirection.current = { x: -1, y: 0 }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.current.x !== -1) nextDirection.current = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, resetGame])

  const handleClick = () => {
    if (gameState !== 'playing') {
      resetGame()
      setGameState('playing')
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full max-w-[500px] mb-4 font-mono text-sm font-bold uppercase tracking-widest text-black">
        <span>Score: {score}</span>
        <span>High: {highScore}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full max-w-[500px] h-auto bg-white cursor-pointer border-2 border-[#C6F432] rounded-lg shadow-lg"
        onClick={handleClick}
      />
    </div>
  )
}

export default function InteractiveSection() {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  const marqueeText = 'C++ • PYTHON • TYPESCRIPT • JAVASCRIPT • X86 ASSEMBLY (MASM) • SQL • JAVA • REACT.JS • NEXT.JS • NODE.JS • EXPRESS • MONGODB • POSTGRESQL • TAILWIND CSS • ELECTRON • JAVAFX • LINUX • DOCKER • GIT • '

  const skills = [
    'Python', 'C++', 'TypeScript', 'JavaScript', 'x86 Assembly', 
    'SQL', 'Java', 'React.js', 'Next.js', 'Node.js', 
    'Express', 'MongoDB', 'PostgreSQL', 'Tailwind', 
    'Electron', 'Linux', 'Docker', 'Git'
  ]

  const badgeData: Record<string, string> = {
    'Systems': 'POSIX APIs, Custom Data Structures, Manual Memory Management & Linux/Docker.',
    'AI & ML': 'Neural Networks from scratch, NumPy, Constraint Satisfaction & Genetic Algorithms.',
    'Full-Stack': 'React.js, Next.js, Node.js, Express & hybrid PostgreSQL/MongoDB Architectures.',
    'Low-Level': 'x86 Assembly (MASM), CPU registers, hardware interrupts & C++.'
  }

  return (
    <section id="interactive" className="w-full bg-white overflow-hidden text-black font-sans border-t-2 border-[#C6F432] relative z-10 pb-32 lg:pb-48">

      {/* 1. Top Header Bar */}
      <div className="w-full bg-[#C6F432] py-4 text-center">
        <span className="text-black text-sm font-bold tracking-[0.3em] uppercase">
          TECH STACK & SKILLS
        </span>
      </div>

      {/* 2. Marquee Row */}
      <div className="w-full border-b-2 border-[#C6F432] py-6 overflow-hidden select-none bg-white">
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {[1, 2].map((i) => (
            <span key={i} className="flex items-center px-12 text-6xl md:text-8xl font-black uppercase tracking-tighter text-black">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full bg-white">
        {/* Left Column (1fr) */}
        <div className="w-full md:w-1/4 border-b-2 md:border-b-0 md:border-r-2 border-[#C6F432] p-8 flex flex-col items-center text-center justify-between min-h-[550px]">
          <div className="flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl font-black mb-2 leading-none text-black">Taha.</h2>
            <p className="text-sm font-black uppercase tracking-tight mb-8 text-[#C6F432] bg-black px-2 py-1 rounded">SOFTWARE ENGINEER | AI</p>
            <a href="mailto:i240635@isb.nu.edu.pk" className="text-sm font-bold tracking-widest mt-2 hover:text-[#C6F432] transition-colors text-black">
              i240635@isb.nu.edu.pk
            </a>
            <p className="mt-2 text-sm font-mono tracking-widest text-black/60">+92 334 5723602</p>
            <p className="mt-8 text-[0.75rem] font-mono font-bold uppercase tracking-widest leading-relaxed max-w-[200px] text-black/70">
              Bridging low-level systems architecture and modern full-stack web development.
            </p>
          </div>
          <MagneticButton
            // Added [&_span]:group-hover:!text-white and [&_svg]:group-hover:!text-white to enforce white text on hover
            className="mt-8 shadow-lg !bg-[#C6F432] !border-[#C6F432] !text-black hover:!bg-black hover:!border-black group transition-all duration-300 [&_span]:group-hover:!text-white [&_svg]:group-hover:!text-white"
            size="small"
            onClick={() => {
              const element = document.getElementById('footer-cta')
              if (element) {
                const lenis = (window as any).lenis
                if (lenis) {
                  lenis.scrollTo(element, { duration: 1.5 })
                } else {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }
            }}
          >
            LET'S CHAT!
          </MagneticButton>
        </div>

        {/* Center Column (2fr) */}
        <div className="w-full md:w-2/4 border-b-2 md:border-b-0 md:border-r-2 border-[#C6F432] p-8 my-0 md:my-0 flex flex-col items-center justify-center bg-white">
          <div className="w-full text-center mb-6 flex flex-col items-center gap-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 border-b-2 border-[#C6F432] pb-1 inline-block text-black">
              Interactive Breather
            </h3>
            <span className="text-sm font-mono font-bold uppercase tracking-widest text-black/60">
              Guide the snake. Feed the logic.
            </span>
          </div>
          <div className="w-full flex justify-center overflow-hidden">
            <LocalSnakeGame />
          </div>
        </div>

        {/* Right Column (1fr) - Skills & Badge Interaction */}
        <div className="w-full md:w-1/4 border-b-2 md:border-b-0 border-[#C6F432] p-8 flex flex-col justify-between min-h-[550px]">

          {/* Top Section: Skills as Pills */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 border-b-2 border-[#C6F432] pb-1 text-black inline-block self-start">
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <div key={i} className="skill-pill">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Badge Interaction */}
          <div className="mt-auto pt-8">
            <div className="h-16 mb-4 flex items-center justify-center text-center px-4">
              <p className={`text-[0.7rem] font-mono font-bold uppercase tracking-tight text-black transition-opacity duration-300 ${hoveredBadge ? 'opacity-100' : 'opacity-0'}`}>
                {hoveredBadge ? badgeData[hoveredBadge] : ''}
              </p>
            </div>

            <div className="flex justify-between items-center px-1">
              {Object.keys(badgeData).map((label) => (
                <div
                  key={label}
                  className="w-14 h-14 border-2 border-[#C6F432] rounded-full flex items-center justify-center text-[0.55rem] text-center leading-[1.1] font-black cursor-crosshair transition-all duration-300 hover:bg-[#C6F432] hover:text-black px-1 shrink-0 text-black"
                  onMouseEnter={() => setHoveredBadge(label)}
                  onMouseLeave={() => setHoveredBadge(null)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Bottom Checkerboard Pattern (Removed absolute positioning) */}
      <div
        className="w-full h-[100px] border-t-2 border-b-2 border-[#C6F432]"
        style={{
          background: `repeating-conic-gradient(#C6F432 0% 25%, #ffffff 0% 50%) 50% / 20px 20px`,
          backgroundColor: '#ffffff'
        }}
      />

      <style jsx>{`
        @keyframes marquee { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        .animate-marquee { 
          animation: marquee 60s linear infinite; 
        }
        
        .skill-pill {
          position: relative;
          overflow: hidden;
          z-index: 1;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid rgba(198, 244, 50, 0.8); /* Neon Lime Border */
          background: transparent;
          color: #000000;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.4s ease-in-out, border-color 0.4s ease-in-out;
          display: inline-block;
          font-family: monospace;
        }

        .skill-pill::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #C6F432;
          z-index: -1;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s ease-in-out;
        }

        .skill-pill:hover {
          color: #000000;
          border-color: #C6F432;
        }

        .skill-pill:hover::before {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>
    </section>
  )
}