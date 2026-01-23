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

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect width="${w}" height="${h}" fill="url(#g)">
        <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  `

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* SAME BACKGROUND AS DASHBOARD */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/90" />

        {/* CONTENT */}
        <div className="relative z-10">
          {/* HEADER */}
          <div className="max-w-7xl mx-auto pt-16 pb-8 px-6 flex flex-col sm:flex-row items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutGrid className="text-cyan-400" size={24} />
                <h1 className="text-4xl font-black tracking-tighter uppercase">
                  My <span className="text-cyan-400">Archives</span>
                </h1>
              </div>
              <p className="text-zinc-400 max-w-md">
                Manage your digital assets and monitor public engagement.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Total Assets:{' '}
                <span className="text-white">{myArtworks.length}</span>
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading && myArtworks.length === 0 && (
            <div className="flex flex-col items-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest text-xs">
                Accessing Database...
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && myArtworks.length === 0 && (
            <div className="text-center py-40">
              <p className="text-zinc-600 font-black uppercase text-3xl opacity-20">
                No Artworks Found
              </p>
            </div>
          )}

          {/* GRID */}
          <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {myArtworks.map((art) => (
              <div
                key={art.id}
                className="group bg-black/60 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden hover:border-cyan-400/30 transition-all"
              >
                <div
                  onClick={() => handleArtworkView(art.id, art.url)}
                  className="relative aspect-[4/3] cursor-pointer"
                >
                  <Image
                    src={art.url}
                    alt={art.title}
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-bold truncate mb-4">{art.title}</h3>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <div className="text-xs font-black text-cyan-400">
                      {art.views} Views
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, art.id)}
                      className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                      <span className="text-[10px] uppercase font-black">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-8 left-8 text-zinc-500 hover:text-cyan-400"
              >
                <ArrowLeft size={22} />
              </button>

              <Image
                src={selectedImage}
                alt="Artwork Preview"
                width={1920}
                height={1080}
                className="max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
