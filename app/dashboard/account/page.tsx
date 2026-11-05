import Link from 'next/link'
import { ArrowRight, Settings, UserRound } from 'lucide-react'

const accountSections = [
  {
    href: '/dashboard/profile',
    title: 'Profile',
    description: 'Update your name, profile photo, and account details.',
    icon: UserRound,
  },
  {
    href: '/dashboard/settings',
    title: 'Settings',
    description: 'Manage your public portfolio link and preferences.',
    icon: Settings,
  },
]

export default function AccountPage() {
  return (
    <main className="portfolio-background min-h-screen px-5 py-12 text-zinc-100 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
            Your space
          </p>
          <h1 className="page-heading text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Account
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Manage your profile and account settings in one place.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {accountSections.map(({ href, title, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-white transition group-hover:text-cyan-300">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-zinc-400">
                  {description}
                </span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
