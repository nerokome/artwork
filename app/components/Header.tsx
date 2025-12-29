'use client'

import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { RootState, AppDispatch } from '@/app/redux/store/store'
import { logoutUser } from '@/app/redux/store/userslice'
import { IoPerson } from "react-icons/io5";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { user } = useSelector((state: RootState) => state.user)

  const handleLogout = () => {
    dispatch(logoutUser())
    router.push('/') 
  }

  return (
    <header className="h-23 bg-neutral-900 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg text-neutral-200">Welcome,</span>
        <span className="text-lg font-semibold text-neutral-300">
          {user?.name }
        </span>
        <div>
          <IoPerson size={30} color="#67E8F9"/>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
