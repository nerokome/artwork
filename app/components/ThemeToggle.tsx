'use client'

import { Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  const handleToggle = () => {
    toggleTheme()
    toast.success(`${isLight ? 'Dark' : 'Light'} mode enabled`)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-black/80 text-cyan-300 shadow-lg backdrop-blur-md transition hover:bg-cyan-400 hover:text-black"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}
