'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  Upload,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/redux/store/store'
import { logoutUser } from '@/app/redux/store/userslice'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const links = [
    { href: '/dashboard', label: 'Portfolio', icon: LayoutDashboard },
    { href: '/dashboard/uploaddocs', label: 'Upload', icon: Upload },
    { href: '/dashboard/analyticsdash', label: 'Analytics', icon: BarChart },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setMobileOpen(false)
    router.replace('/')
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-black/80 backdrop-blur border-b border-white/10 flex justify-between items-center px-4 py-4">
        <Image src="/rarrr.png" alt="Artfolio" width={110} height={40} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <aside className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 md:hidden">
          <nav className="mt-16 space-y-6">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition
                ${isActive(href)
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex items-center gap-3 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen z-30
        ${collapsed ? 'w-20' : 'w-64'}
        bg-black/70 backdrop-blur-xl border-r border-white/10
        transition-all duration-300`}
      >
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-6">
            {!collapsed && (
              <Link href="/">
                <Image src="/rarrr.png" alt="Artfolio" width={130} height={40} />
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 mt-8 space-y-3">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all
                  ${active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }
                  ${collapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <Icon size={20} />
                  {!collapsed && (
                    <span className="font-semibold tracking-tight">{label}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 pb-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition
              ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <LogOut size={18} />
              {!collapsed && <span className="font-semibold">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
