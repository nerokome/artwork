import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DashboardBackLink() {
  return (
    <Link
      href="/dashboard"
      className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400"
    >
      <ArrowLeft size={16} /> Back to dashboard
    </Link>
  )
}
