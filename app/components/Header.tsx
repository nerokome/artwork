'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="h-23 bg-neutral-900  flex items-center justify-between px-8 shadow-sm">
      
      <div className="flex items-center gap-2">
        <span className="text-lg text-neutral-200">Welcome,</span>
        <span className="text-lg font-semibold text-neutral-300">Nero</span>
      </div>

      
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 text-sm rounded-2xl border border-cyan-400  text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
          Logout
        </button>

        
      </div>
    </header>
  )
}