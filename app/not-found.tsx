import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="portfolio-background flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex max-w-lg flex-col items-center text-center">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
          <Compass size={32} />
        </span>
        <p className="text-sm font-semibold text-cyan-400">404 · Page not found</p>
        <h1 className="mt-3 text-4xl font-black text-white">This page is off the canvas.</h1>
        <p className="mt-4 text-zinc-400">
          The page may have moved, or the address might be incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition hover:bg-cyan-300"
        >
          <ArrowLeft size={17} />
          Back to home
        </Link>
      </div>
    </main>
  )
}
