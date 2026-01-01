'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Eye, Heart, Star, ArrowLeft } from 'lucide-react'
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
    else console.error("Missing ID for artwork:", art.title)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white animate-pulse">Loading Gallery...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</p>
      </div>
    )

  return (
    <div className="relative min-h-screen bg-black">
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/fotos.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/90 -z-10" />

      <div className="relative px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 uppercase italic">
            {profile?.name || 'Artist'}'s Portfolio
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Viewing public artworks and collections.
          </p>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl">
            <p className="text-neutral-500">No public artworks available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {artworks.map((art: Artwork) => (
              <div
                key={art.id}
                className="group bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 cursor-pointer shadow-lg sm:shadow-xl"
                onClick={() => handleArtworkClick(art)}
              >
                <div className="relative aspect-video sm:aspect-square overflow-hidden">
                  <Image
                    src={art.url}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-white font-medium truncate mb-1 sm:mb-2">{art.title}</h3>
                  <div className="flex items-center gap-3 text-neutral-400 text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-cyan-400" /> {art.views || 0}
                    </span>
                    <span className="flex items-center gap-1.5 opacity-40">
                      <Heart size={14} /> 0
                    </span>
                    <span className="flex items-center gap-1.5 opacity-40">
                      <Star size={14} /> 0
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 text-sm sm:text-base"
            >
              <ArrowLeft size={18} /> 
              <span className="hidden sm:inline">Back to Gallery</span>
            </button>

            <div className="relative w-full h-full max-w-full sm:max-w-5xl max-h-[75vh] sm:max-h-[85vh] flex items-center justify-center">
              <Image
                src={selectedImage.url}
                alt="Selected Artwork"
                width={1200}
                height={800}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
