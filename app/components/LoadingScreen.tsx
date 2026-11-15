import { LoaderCircle, Palette } from 'lucide-react'

export function LoadingIndicator({
  message = 'Preparing your space',
  className = '',
  compact = false,
}: {
  message?: string
  className?: string
  compact?: boolean
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center text-center ${
        compact ? 'flex-row justify-start gap-2' : 'flex-col gap-3'
      } ${className}`}
    >
      <span className={`relative flex shrink-0 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 ${
        compact ? 'h-6 w-6 rounded-md' : 'h-12 w-12 rounded-xl'
      }`}>
        <Palette size={compact ? 12 : 21} />
        <LoaderCircle
          aria-hidden="true"
          className={`absolute animate-spin text-cyan-400/70 ${compact ? '-inset-0.5' : '-inset-1.5'}`}
          size={compact ? 28 : 60}
          strokeWidth={1}
        />
      </span>
      <p className={`font-medium text-zinc-400 ${compact ? 'text-xs' : 'text-sm'}`}>{message}</p>
    </div>
  )
}

export default function LoadingScreen({ className = 'min-h-screen' }: { className?: string }) {
  return (
    <main className={`portfolio-background flex items-center justify-center px-6 ${className}`}>
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
