'use client'

import { ArrowLeft, Trash2, LayoutGrid } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { getMyArtworks, deleteArtwork } from '@/app/redux/store/uploadslice'
import { logArtworkView } from '@/app/redux/store/analysisslice'
import { toast } from 'sonner'
import ArtworkLikeButton from '@/app/components/ArtworkLikeButton'

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

  const handleDelete = async (e: React.MouseEvent, artworkId: string) => {
    e.stopPropagation()
    if (!confirm('Permanently remove this piece from your collection?')) return
    try {
      await dispatch(deleteArtwork(artworkId)).unwrap()
      toast.success('Artwork deleted.')
    } catch {
      toast.error('Could not delete this artwork. Please try again.')
    }
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
      <div
        className="portfolio-background relative overflow-hidden rounded-2xl text-white"
      >
        {/* CONTENT */}
        <div className="relative z-10">
          {/* HEADER */}
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pb-8 pt-16 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center justify-center gap-3">
                <LayoutGrid className="text-cyan-400" size={24} />
                <h1 className="page-heading text-4xl font-black tracking-tighter uppercase">
                  My <span className="text-cyan-400">Archives</span>
                </h1>
              </div>
              <p className="max-w-md text-zinc-400">
                Manage your digital assets and monitor public engagement.
              </p>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:block">
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
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-3 pb-20 sm:gap-6 sm:px-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {myArtworks.map((art) => (
              <div
                key={art.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left transition hover:border-white/25"
              >
                <div
                  onClick={() => handleArtworkView(art.id, art.url)}
                  className="relative aspect-[4/5] cursor-pointer overflow-hidden"
                >
                  <Image
                    src={art.url}
                    alt={art.title}
                    fill
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="truncate text-sm font-bold text-white sm:text-base">{art.title}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-zinc-400">{art.views} views</p>
                    <ArtworkLikeButton artworkId={art.id} />
                    <button
                      onClick={(e) => handleDelete(e, art.id)}
                      aria-label={`Delete ${art.title}`}
                      className="flex shrink-0 items-center gap-1 text-zinc-500 transition hover:text-red-400"
                    >
                      <Trash2 size={16} />
                      <span className="hidden text-[10px] font-black uppercase sm:inline">
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
