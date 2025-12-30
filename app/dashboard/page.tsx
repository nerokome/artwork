'use client'

import { Star, Heart, Eye, ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { getMyArtworks } from '@/app/redux/store/uploadslice'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { myArtworks, loading } = useSelector((state: RootState) => state.artwork)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getMyArtworks())
  }, [dispatch])

  return (
    <div className="relative min-h-screen">
      {/* Full-page Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/fotos.jpg')" }}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black/90 -z-10" />

      {/* Content without any background color */}
      <div className="relative">
        {/* Hero */}
        <div className="relative rounded-b-2xl overflow-hidden">
          <div className="relative flex flex-col items-center text-center py-12 sm:py-16 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              My Collection
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg max-w-xl">
              Manage and showcase your collection of digital artworks with style.
            </p>
          </div>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-white py-6">Loading artworks...</p>
        )}
        {!loading && myArtworks.length === 0 && (
          <p className="text-center text-white py-6">
            You haven’t uploaded any artworks yet.
          </p>
        )}

        {/* Grid */}
        <div className="px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {myArtworks.map((art) => (
            <div
              key={art.id}
              className="group bg-neutral-900/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedImage(art.url)}
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
                <h3 className="text-white text-sm sm:text-base font-semibold truncate">
                  {art.title}
                </h3>

                <div className="flex items-center gap-3 text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-cyan-400" />
                    {art.views}
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

        {/* Modal */}
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

export default Page
