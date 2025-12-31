'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Eye, Heart, Star, ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { fetchPublicPortfolio } from '@/app/redux/store/publicportfolioslice'
import { logArtworkView } from '@/app/redux/store/analysisslice'

export default function PublicPortfolioPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { name } = useParams()
  const { profile, artworks, loading, error } = useSelector(
    (state: RootState) => state.publicPortfolio
  )

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return
    const nameString = Array.isArray(name) ? name.join(" ") : name
    dispatch(fetchPublicPortfolio(nameString.replace(/-/g, " ")))
  }, [dispatch, name])

  const handleArtworkView = (artId: string, url: string) => {
    dispatch(logArtworkView(artId)) // log the view in backend
    setSelectedImage(url)           // open modal
  }

  if (loading) return <p className="text-white p-6">Loading...</p>
  if (error) return <p className="text-red-500 p-6">{error}</p>

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/fotos.jpg')" }} />
      <div className="fixed inset-0 bg-black/90 -z-10" />

      <div className="relative px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
            {profile?.name}'s Portfolio
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Explore the public artworks of {profile?.name}.
          </p>
        </div>

        {/* Gallery */}
        {artworks.length === 0 && <p className="text-center text-white py-6">No public artworks found.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="group bg-neutral-900/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
              onClick={() => handleArtworkView(art.id, art.url)}
            >
              <div className="relative">
                <Image
                  src={art.url}
                  alt={art.title}
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-52 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>

              <div className="p-3 sm:p-4 space-y-2">
                <h3 className="text-white text-sm sm:text-base font-semibold truncate">{art.title}</h3>
                <div className="flex items-center gap-3 text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-cyan-400" /> {art.views || 0}
                  </div>
                  <div className="flex items-center gap-1 opacity-50">
                    <Heart size={14} /> 0
                  </div>
                  <div className="flex items-center gap-1 opacity-50">
                    <Star size={14} /> 0
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-3 sm:px-6">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <Image
              src={selectedImage}
              alt="Full artwork"
              width={1200}
              height={800}
              className="max-h-[75vh] sm:max-h-[85vh] max-w-full rounded-lg shadow-lg border border-neutral-700 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}
