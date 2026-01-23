'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { Copy, Check, Globe, Shield, Zap, ExternalLink, Search } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function PortfolioSettings() {
  const { user } = useSelector((state: RootState) => state.user)
  const [copied, setCopied] = useState(false)

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://artwork-phi-swart.vercel.app'

  const portfolioUrl = useMemo(() => {
    if (!user?.name) return ''
    const slug = user.name.trim().toLowerCase().replace(/\s+/g, '-')
    return `${baseUrl}/portfolio/${slug}`
  }, [user?.name, baseUrl])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
     
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/90" />

        
        <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl space-y-8">
            
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Portfolio <span className="text-cyan-400">Gateway</span>
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                Public Access Node & Link Management
              </p>
            </div>

            {/* URL CARD */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="text-cyan-400" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Global URL
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase">
                      Live
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full bg-black/50 border border-white/5 px-5 py-4 rounded-xl flex items-center justify-between">
                    <span className="text-white text-sm truncate mr-4">
                      {portfolioUrl || 'Link logic initializing...'}
                    </span>
                    <a href={portfolioUrl} target="_blank" rel="noreferrer">
                      <ExternalLink
                        size={14}
                        className="text-zinc-600 hover:text-cyan-400 transition-colors"
                      />
                    </a>
                  </div>

                  <button
                    onClick={handleCopy}
                    disabled={!portfolioUrl}
                    className="w-full md:w-auto bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check size={16} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StaticMetric icon={<Zap size={16} />} label="Response" value="24ms" />
              <StaticMetric icon={<Shield size={16} />} label="Security" value="SSL-v3" />
              <StaticMetric icon={<Search size={16} />} label="Indexing" value="Global" />
            </div>

            {/* METADATA */}
            <div className="bg-black/60 border border-white/5 rounded-3xl p-8 space-y-8 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-black uppercase mb-1">
                  Portfolio Metadata
                </h2>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
                  How your link appears on search engines
                </p>
              </div>

              <div className="border-l-2 border-cyan-400 pl-6">
                <p className="text-cyan-400 font-bold">
                  Portfolio | {user?.name || 'User'}
                </p>
                <p className="text-emerald-500 text-xs">{portfolioUrl}</p>
                <p className="text-zinc-400 text-xs max-w-md mt-2">
                  Explore the curated creative works and digital portfolio of{' '}
                  {user?.name}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StaticMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-black/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="text-zinc-500">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {label}
        </span>
      </div>
      <span className="text-xs font-black">{value}</span>
    </div>
  )
}
