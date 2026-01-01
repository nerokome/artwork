'use client'

import { Star, Heart, Eye, ArrowLeft, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { getMyArtworks, deleteArtwork } from '@/app/redux/store/uploadslice'
import { logArtworkView } from '@/app/redux/store/analysisslice'

const Page = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { myArtworks, loading } = useSelector((state: RootState) => state.artwork)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getMyArtworks())
  }, [dispatch])

  const handleArtworkView = (artworkId: string, url: string) => {
    dispatch(logArtworkView(artworkId))
    setSelectedImage(url)
  }

  const handleDelete = (e: React.MouseEvent, artworkId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this artwork permanently?')) return
    dispatch(deleteArtwork(artworkId))
  }

  return (
    <div className="relative min-h-screen">
      
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/fotos.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/90 -z-10" />

      <div className="text-center py-12 px-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          My Collection
        </h1>
        <p className="text-white/70 mt-2">
          Manage and control your uploaded artworks
        </p>
      </div>

      {loading && (
        <p className="text-center text-white/70">Loading artworks...</p>
      )}

      
      <div className="px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myArtworks.map((art) => (
          <div
            key={art.id}
            className="
              bg-neutral-900/80 rounded-xl overflow-hidden
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-2xl
              focus-within:ring-2 focus-within:ring-cyan-500/40
            "
          >
          
            <div
              onClick={() => handleArtworkView(art.id, art.url)}
              className="relative cursor-pointer group"
            >
             <Image
  src={art.url}
  alt={art.title}
  width={600}
  height={400}
  loading="lazy"
  decoding="async"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         25vw"
  className="
    w-full h-52 object-cover
    transition-transform duration-300
    group-hover:scale-[1.03]
  "
/>

              <div className="
                absolute inset-0
                bg-black/0 group-hover:bg-black/20
                transition-colors
              " />
            </div>

            
            <div className="p-4 space-y-3">
              <h3 className="text-white font-semibold truncate">
                {art.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-cyan-400">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {art.views}
                  </span>
                  <span className="flex items-center gap-1 opacity-50">
                    <Heart size={14} /> 0
                  </span>
                  <span className="flex items-center gap-1 opacity-50">
                    <Star size={14} /> 0
                  </span>
                </div>

                
                <button
                  onClick={(e) => handleDelete(e, art.id)}
                  className="
                    flex items-center gap-1
                    text-red-400 text-sm
                    transition
                    hover:text-red-200
                    active:scale-95
                  "
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      {selectedImage && (
        <div className="
          fixed inset-0 z-50
          bg-black/90
          flex items-center justify-center
          animate-in fade-in duration-200
        ">
          <button
            onClick={() => setSelectedImage(null)}
            className="
              absolute top-4 left-4
              flex items-center gap-2
              text-white/80 hover:text-white
              transition
            "
          >
            <ArrowLeft size={18} /> Back
          </button>

          <Image
  src={selectedImage}
  alt="Artwork"
  width={1200}
  height={800}
  loading="eager"
  priority
  className="
    max-h-[85vh] max-w-full
    object-contain
    rounded-lg
    shadow-2xl
    animate-in zoom-in-95 duration-200
  "
/>

        </div>
      )}
    </div>
  )
}

export default Page
