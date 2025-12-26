'use client'

export default function RightSidebar() {
  return (
    <div className="hidden md:flex fixed right-0 top-0 h-screen w-24 flex-col items-center justify-center z-40 pointer-events-none">
      <div className="rotate-[-90deg] origin-center whitespace-nowrap">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-deep-black/80">
          Muhammad Taha Nasim
        </span>
      </div>
    </div>
  )
}

