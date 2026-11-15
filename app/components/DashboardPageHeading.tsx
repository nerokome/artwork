import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface DashboardPageHeadingProps {
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export default function DashboardPageHeading({
  icon: Icon,
  children,
  className = '',
}: DashboardPageHeadingProps) {
  return (
    <div className={`flex min-h-12 w-full items-center justify-center gap-2 px-2 text-center sm:gap-3 sm:px-0 ${className}`}>
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-cyan-400 sm:h-6 sm:w-6" size={24} />
      <h1 className="page-heading min-w-0 text-2xl font-black leading-tight sm:text-4xl">{children}</h1>
    </div>
  )
}
