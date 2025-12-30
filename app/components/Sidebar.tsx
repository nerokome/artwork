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
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const links = [
    { href: '/dashboard', label: 'Portfolio', icon: <LayoutDashboard size={22} /> },
    { href: '/dashboard/uploaddocs', label: 'Upload Docs', icon: <Upload size={22} /> },
    { href: '/dashboard/analyticsdash', label: 'Analytics', icon: <BarChart size={22} /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={22} /> },
  ]

  return (
    <>
      {/* Mobile Header */}
      <nav className="md:hidden bg-neutral-900 text-neutral-200 flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/rarrr.png" alt="Artfolio Logo" width={40} height={40} />
          <span className="font-bold">Artfolio</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-neutral-800 transition"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Sidebar (50% width, no overlay) */}
      {mobileOpen && (
        <aside className="fixed top-0 left-0 h-full w-1/2 z-50 bg-neutral-900 text-neutral-200 flex flex-col p-4 md:hidden shadow-lg">
          <button
            onClick={() => setMobileOpen(false)}
            className="self-end mb-4 p-2 rounded-md hover:bg-neutral-800"
          >
            <X size={24} />
          </button>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-6">
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
        </aside>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen bg-neutral-900 text-neutral-200 flex-col transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 mt-2">
          {!collapsed && (
            <Link href="/">
              <Image
                src="/rarrr.png"
                alt="Artfolio Logo"
                width={150}
                height={150}
                priority
              />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-neutral-800 transition"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-2">
          <ul className="space-y-10 mt-8">
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
        className={`flex items-center gap-5 px-3 py-2 rounded-lg transition-colors
        ${active ? 'bg-neutral-800 font-semibold' : 'hover:bg-neutral-800'}
        ${collapsed ? 'justify-center' : ''}`}
      >
        {icon}
        {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
      </Link>
    </li>
  )
}
