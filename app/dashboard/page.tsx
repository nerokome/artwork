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
    <div className="bg-neutral-800 min-h-screen">
     
      <div
        className="relative rounded-b-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/sun.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative flex flex-col items-center text-center py-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            My Collection
          </h1>
          <p className="text-neutral-300 text-lg max-w-xl">
            Manage and showcase your collection of digital artworks with style.
          </p>
        </div>
      </div>

      
      {loading && (
        <p className="text-center text-neutral-300 py-6">Loading artworks...</p>
      )}

     
      {!loading && myArtworks.length === 0 && (
        <p className="text-center text-neutral-400 py-6">
          You haven’t uploaded any artworks yet.
        </p>
      )}

      
      <div className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {myArtworks.map((art) => (
          <div
            key={art.id}
            className="group bg-neutral-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer"
            onClick={() => setSelectedImage(art.url)}
          >
            <div className="relative">
              <Image
                src={art.url}
                alt={art.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-white text-base font-semibold truncate">
                {art.title}
              </h3>

              <div className="flex items-center gap-4 text-neutral-400 text-sm">
                <div className="flex items-center gap-1">
                  <Eye size={16} className="text-cyan-400" /> {art.views}
                </div>
                <div className="flex items-center gap-1 opacity-50">
                  <Heart size={16} /> 0
                </div>
                <div className="flex items-center gap-1 opacity-50">
                  <Star size={16} /> 0
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="flex items-center gap-2 px-3 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <Image
            src={selectedImage}
            alt="Full artwork"
            width={1200}
            height={800}
            className="max-h-[85%] max-w-[90%] rounded-lg shadow-lg border border-neutral-600 object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default Page