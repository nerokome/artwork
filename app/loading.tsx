import { LoaderCircle, Palette } from 'lucide-react'

export default function Loading() {
  return (
    <main className="portfolio-background flex min-h-screen items-center justify-center px-6">
      <div role="status" aria-live="polite" className="flex flex-col items-center text-center">
        <span className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
          <Palette size={28} />
          <LoaderCircle
            aria-hidden="true"
            className="absolute -inset-2 animate-spin text-cyan-400/70"
            size={80}
            strokeWidth={1}
          />
        </span>
        <p className="text-xl font-semibold text-white">Preparing your space</p>
        <p className="mt-2 text-sm text-zinc-400">Your creative world is loading.</p>
      </div>
    </main>
  )
}
