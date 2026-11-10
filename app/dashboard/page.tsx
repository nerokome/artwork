'use client'

import { ArrowLeft, Trash2, LayoutGrid } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
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
  const [artworkToDelete, setArtworkToDelete] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const cancelDeleteRef = useRef<HTMLButtonElement>(null)
  const deletingRef = useRef(false)

  useEffect(() => {
    dispatch(getMyArtworks())
  }, [dispatch])

  const handleArtworkView = (artworkId: string, url: string) => {
    dispatch(logArtworkView(artworkId))
    setSelectedImage(url)
  }

  const handleDelete = (e: React.MouseEvent, artwork: { id: string; title: string }) => {
    e.stopPropagation()
    setArtworkToDelete(artwork)
  }

  const confirmDelete = async () => {
    if (!artworkToDelete || deletingRef.current) return
    deletingRef.current = true
    setDeleting(true)
    try {
      await dispatch(deleteArtwork(artworkToDelete.id)).unwrap()
      toast.success('Artwork deleted.')
      setArtworkToDelete(null)
    } catch {
      toast.error('Could not delete this artwork. Please try again.')
    } finally {
      deletingRef.current = false
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!artworkToDelete) return
    cancelDeleteRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deletingRef.current) setArtworkToDelete(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [artworkToDelete])

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
                      onClick={(e) => handleDelete(e, art)}
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

          {artworkToDelete && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget && !deleting) setArtworkToDelete(null)
              }}
            >
              <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-artwork-title"
                aria-describedby="delete-artwork-description"
                className="delete-confirmation w-full max-w-md rounded-3xl p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-red-300">
                  <Trash2 size={21} />
                </div>
                <h2 id="delete-artwork-title" className="delete-confirmation-title text-xl font-bold">Delete this artwork?</h2>
                <p id="delete-artwork-description" className="delete-confirmation-description mt-2 text-sm leading-6">
                  <span className="delete-confirmation-artwork-name font-semibold">{artworkToDelete.title}</span> will be permanently removed from your collection. This action cannot be undone.
                </p>
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={cancelDeleteRef}
                    type="button"
                    onClick={() => setArtworkToDelete(null)}
                    disabled={deleting}
                    className="delete-confirmation-cancel rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void confirmDelete()}
                    disabled={deleting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    {deleting ? 'Deleting…' : 'Delete artwork'}
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
