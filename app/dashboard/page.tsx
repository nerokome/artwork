'use client'

import { Star, Heart, Eye, ArrowLeft, Trash2, LayoutGrid } from 'lucide-react'
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
    if (!confirm('Permanently remove this piece from your collection?')) return
    dispatch(deleteArtwork(artworkId))
  }

  // Shimmer effect for lazy loading placeholder
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      
      <div
        className="fixed inset-0 bg-cover bg-center -z-10 scale-105 blur-sm"
        style={{ backgroundImage: "url('/fotos.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/90 -z-10" />

      
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-6 text-center sm:text-left flex flex-col sm:flex-row items-end justify-between gap-4">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
             <LayoutGrid className="text-cyan-400" size={24} />
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
               My <span className="text-cyan-400">Archives</span>
             </h1>
          </div>
          <p className="text-zinc-400 font-medium tracking-wide max-w-md">
            Manage your digital assets and monitor public engagement.
          </p>
        </div>
        
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hidden sm:block">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Total Assets: <span className="text-white">{myArtworks.length}</span>
            </p>
        </div>
      </div>

     
      {loading && myArtworks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
        </div>
      )}

     
      {!loading && myArtworks.length === 0 && (
          <div className="text-center py-40">
              <p className="text-zinc-600 font-black uppercase tracking-tighter text-3xl opacity-20">No Artworks Found</p>
          </div>
      )}

  
      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {myArtworks.map((art) => (
          <div
            key={art.id}
            className="group relative bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan-400/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            
            <div
              onClick={() => handleArtworkView(art.id, art.url)}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer"
            >
              <Image
                src={art.url}
                alt={art.title}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
             
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                      <Eye className="text-white" size={24} />
                  </div>
              </div>
            </div>

          
            <div className="p-5">
              <h3 className="text-white font-bold text-lg leading-tight truncate mb-4">
                {art.title}
              </h3>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-cyan-400 font-black text-xs">{art.views}</span>
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-tighter">Views</span>
                  </div>
                  <div className="flex flex-col items-center opacity-30">
                    <span className="text-white font-black text-xs">0</span>
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-tighter">Likes</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(e, art.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 active:scale-90"
                >
                  <Trash2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase tracking-widest text-xs">Return to Gallery</span>
          </button>

          <div className="relative w-full max-w-5xl max-h-[80vh] aspect-auto">
            <Image
              src={selectedImage}
              alt="Artwork Full Preview"
              width={1920}
              height={1080}
              priority 
              className="object-contain w-full h-full rounded-lg shadow-[0_0_50px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Page