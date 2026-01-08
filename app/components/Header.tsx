'use client'

import { useEffect, useState } from 'react' // Added
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { RootState, AppDispatch } from '@/app/redux/store/store'
import { logoutUser } from '@/app/redux/store/userslice'

export default function Header() {
  const [mounted, setMounted] = useState(false) // Added logic
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)

  // Wait for the component to mount before showing dynamic user data
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    router.push('/')
  }

  return (
    <header className="w-full h-20 bg-neutral-900 flex items-center justify-between px-4 md:px-8 shadow-sm">
      
      <div className="flex items-center gap-2">
        <span className="text-lg text-neutral-200">Welcome,</span>
        <span className="text-lg font-semibold text-cyan-400">
          {mounted ? user?.name : ""} 
        </span>
      </div>

      
      <div className="hidden md:flex items-center">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-2xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}