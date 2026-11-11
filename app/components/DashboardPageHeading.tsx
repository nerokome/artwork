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
    <div className={`flex min-h-12 w-full items-center justify-center gap-3 text-center ${className}`}>
      <Icon aria-hidden="true" className="shrink-0 text-cyan-400" size={24} />
      <h1 className="page-heading min-w-0 text-4xl font-black">{children}</h1>
    </div>
  )
}
