'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Eye, Heart, Star, ArrowLeft, Layout, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { fetchPublicPortfolio } from '@/app/redux/store/publicportfolioslice'
import { logArtworkView } from '@/app/redux/store/analysisslice'

interface Artwork {
  id: string
  title: string
  url: string
  views?: number
}

export default function PublicPortfolioPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { name } = useParams()
  const { profile, artworks, loading, error } = useSelector(
    (state: RootState) => state.publicPortfolio
  )
  const [selectedImage, setSelectedImage] = useState<{ id: string; url: string } | null>(null)

  useEffect(() => {
    if (!name) return
    const nameString = Array.isArray(name) ? name.join(' ') : name
    dispatch(fetchPublicPortfolio(nameString.replace(/-/g, ' ')))
  }, [dispatch, name])

  useEffect(() => {
    if (selectedImage?.id && selectedImage.id !== 'undefined') {
      dispatch(logArtworkView(selectedImage.id))
    }
  }, [selectedImage, dispatch])

  const handleArtworkClick = (art: Artwork) => {
    if (art.id) setSelectedImage({ id: art.id, url: art.url })
  }

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#18181b" offset="20%" />
          <stop stop-color="#27272a" offset="50%" />
          <stop stop-color="#18181b" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#18181b" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Syncing Exhibit</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black px-6">
        <div className="max-w-xs w-full bg-red-500/5 border border-red-500/20 p-6 rounded-2xl text-center">
          <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
        </div>
      </div>
    )

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-cyan-500/30">
     
      <div
        className="fixed inset-0 bg-cover bg-center -z-10 scale-110 blur-md brightness-[0.2]"
        style={{ backgroundImage: "url('/fotos.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/80 -z-10" />

      <div className="relative px-4 sm:px-6 py-10 lg:py-20 max-w-7xl mx-auto">
      
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4">
             <Layout size={12} className="text-cyan-400" />
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Public Archive</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4 uppercase italic break-words">
            {profile?.name || 'Artist'}<span className="text-cyan-400">.</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium max-w-md mx-auto leading-relaxed px-4">
            A curated digital experience showcasing visual narratives and original concepts.
          </p>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 mx-2">
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Archive Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {artworks.map((art: Artwork) => (
              <div
                key={art.id}
                className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-400/40 transition-all duration-500 cursor-pointer"
                onClick={() => handleArtworkClick(art)}
              >
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                  <Image
                    src={art.url}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-white font-bold text-base sm:text-lg tracking-tight truncate mb-3">{art.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-cyan-400 font-black text-[11px] sm:text-xs">{art.views || 0}</span>
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Views</span>
                    </div>
                    <div className="flex flex-col opacity-30">
                      <span className="text-white font-black text-[11px] sm:text-xs">0</span>
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 sm:bg-black/98 flex items-center justify-center z-[100] p-2 sm:p-12 backdrop-blur-2xl animate-in fade-in duration-300">
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 sm:top-8 sm:left-8 flex items-center justify-center sm:justify-start gap-2 h-12 w-12 sm:h-auto sm:w-auto bg-white/10 sm:bg-transparent rounded-full sm:rounded-none text-white transition-all z-[110]"
            >
              <X size={24} className="sm:hidden" />
              <ArrowLeft size={20} className="hidden sm:block" />
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Exit Preview</span>
            </button>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <Image
                src={selectedImage.url}
                alt="Exhibit Preview"
                width={1600}
                height={1200}
                className="max-h-[85vh] sm:max-h-full max-w-full rounded-xl sm:rounded-2xl object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}