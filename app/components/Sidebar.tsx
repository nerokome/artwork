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
import { useState, useEffect } from 'react'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isActive = (path: string) => pathname === path

  const links = [
    { href: '/dashboard', label: 'Portfolio', icon: <LayoutDashboard size={20} /> },
    { href: '/dashboard/uploaddocs', label: 'Upload Docs', icon: <Upload size={20} /> },
    { href: '/dashboard/analyticsdash', label: 'Analytics', icon: <BarChart size={20} /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setMobileOpen(false)
    router.replace('/')
  }

  if (!mounted) return null

  return (
    <>
      
      <nav className="md:hidden fixed top-0 w-full z-[90] bg-black/80 backdrop-blur-xl border-b border-white/5 text-neutral-200 flex items-center justify-between px-6 py-2">
        <Image src="/rarrr.png" alt="Logo" width={80} height={32} className="opacity-90" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-400/20 transition-colors"
        >
          {/* Always visible toggle */}
          {mobileOpen ? <X size={20} className="text-cyan-400" /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Sidebar - Shorter top padding to match new header height */}
      <aside className={`fixed top-0 left-0 h-full z-[80] bg-[#0A0A0A] text-neutral-200 flex flex-col border-r border-white/5 transition-transform duration-500 ease-in-out md:hidden shadow-2xl ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } w-72 pt-16`}>
        <nav className="flex-1 px-4 mt-8">
          <ul className="space-y-3">
            {links.map(link => (
              <SidebarItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={isActive(link.href)}
                collapsed={false}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all group"
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Exit</span>
          </button>
        </div>
      </aside>

     
      <aside
        className={`hidden md:flex h-screen bg-[#090909] text-neutral-200 flex-col border-r border-white/5 transition-all duration-500 ease-in-out sticky top-0
        ${collapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="flex items-center justify-between px-6 py-10">
          {!collapsed && (
            <Link href="/" className="transition-all hover:brightness-125">
              <Image src="/rarrr.png" alt="Artfolio Logo" width={140} height={40} />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all ${collapsed ? 'mx-auto' : ''}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4">
          <div className={`mb-6 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            System Menu
          </div>
          <ul className="space-y-2">
            {links.map(link => (
              <SidebarItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={isActive(link.href)}
                collapsed={collapsed}
              />
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-cyan-400 hover:bg-cyan-400/5 transition-all group ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-xs font-black uppercase tracking-[0.2em]">Exit</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

function SidebarItem({
  href,
  icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
        ${active 
          ? 'bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.03)]' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}
        ${collapsed ? 'justify-center' : ''}`}
      >
        {active && (
          <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]" />
        )}
        
        <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
          {icon}
        </div>
        
        {!collapsed && (
          <span className="text-[11px] font-black uppercase tracking-[0.15em] leading-none">
            {label}
          </span>
        )}

        {collapsed && (
          <div className="absolute left-full ml-6 px-3 py-2 bg-zinc-900 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all border border-white/10 z-[100] whitespace-nowrap translate-x-[-10px] group-hover:translate-x-0">
            {label}
          </div>
        )}
      </Link>
    </li>
  )
}