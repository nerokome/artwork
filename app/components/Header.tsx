'use client'

import { useEffect, useState } from 'react' // Added
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { RootState, AppDispatch } from '@/app/redux/store/store'
import { logoutUser } from '@/app/redux/store/userslice'
import ThemeToggle from './ThemeToggle'
import { LogOut, UserRound } from 'lucide-react'
import { toast } from 'sonner'

export default function Header() {
  const [mounted, setMounted] = useState(false) // Added logic
  const [greeting, setGreeting] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)

  // Wait for the component to mount before showing dynamic user data
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,')
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      toast.success('You have been logged out.')
      router.replace('/')
    } catch {
      toast.error('Could not log out. Please try again.')
    }
  }

  return (
    <header className="w-full h-20 bg-[#090909] flex items-center justify-between px-4 md:px-8 shadow-sm">
      
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-300">
          {mounted && user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name} profile picture`}
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            mounted && user?.name
              ? user.name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
              : <UserRound size={19} />
          )}
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <span className="dashboard-header-greeting text-lg">{greeting}</span>
          <span className="dashboard-header-greeting truncate text-lg font-semibold">
            {mounted ? user?.name : ''}
          </span>
        </div>
      </div>

      
      <div className="flex items-center gap-3">
        <div className="hidden md:block"><ThemeToggle /></div>
        <button
          onClick={handleLogout}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm rounded-2xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}
