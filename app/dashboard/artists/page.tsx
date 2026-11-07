'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Heart, Image as ImageIcon, UserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/redux/store/store'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface Artist {
  id: string
  _id: string
  name: string
  profilePictureUrl: string
  artworkCount: number
  followerCount: number
  followingCount: number
}

interface ArtistResponse {
  id?: string
  _id?: string
  name?: string
  full_name?: string
  profilePictureUrl?: string
  artworkCount?: number
  followerCount?: number
  followingCount?: number
}

interface Artwork {
  id: string
  title: string
  url: string
  views: number
  likes: number
  popularityScore: number
}

interface ArtworkResponse {
  id?: string
  _id?: string
  title?: string
  url?: string
  views?: number
  likes?: number
  popularityScore?: number
}

function normalizeArtworks(payload: unknown): Artwork[] {
  const records = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && 'artworks' in payload && Array.isArray(payload.artworks)
      ? payload.artworks
      : []

  return (records as ArtworkResponse[]).flatMap((artwork) => {
    const id = artwork.id || artwork._id
    if (!id || !artwork.url) return []
    const views = artwork.views ?? 0
    const likes = artwork.likes ?? 0
    return [{
      id,
      title: artwork.title || 'Untitled artwork',
      url: artwork.url,
      views,
      likes,
      popularityScore: artwork.popularityScore ?? views + likes,
    }]
  })
}

export default function ArtistsPage() {
  const token = useSelector((state: RootState) => state.user.token)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [popularArtworks, setPopularArtworks] = useState<Artwork[]>([])
  const [artworksLoading, setArtworksLoading] = useState(true)
  const [artworksError, setArtworksError] = useState('')
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current
    if (!carousel) return
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.8, behavior: 'smooth' })
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel || popularArtworks.length < 2) return

    const interval = window.setInterval(() => {
      const firstCard = carousel.firstElementChild
      if (!(firstCard instanceof HTMLElement)) return
      const styles = window.getComputedStyle(carousel)
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
      const step = firstCard.getBoundingClientRect().width + gap
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth

      if (carousel.scrollLeft + step > maxScrollLeft - 1) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        carousel.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 2000)

    return () => window.clearInterval(interval)
  }, [popularArtworks])

  useEffect(() => {
    const controller = new AbortController()
    const loadArtworks = async () => {
      try {
        const popularResult = await axios.get(`${BASE_URL}/artworks/popular`, { signal: controller.signal })
        setPopularArtworks(normalizeArtworks(popularResult.data).slice(0, 10))
      } catch (requestError) {
        if (axios.isCancel(requestError)) return
        setArtworksError('Could not load popular artworks. Please try again.')
      } finally {
        if (!controller.signal.aborted) setArtworksLoading(false)
      }
    }
    void loadArtworks()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const loadArtists = async () => {
      if (!token) {
        setError('Sign in to explore artists.')
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get<{ count: number; artists: ArtistResponse[] }>(
          `${BASE_URL}/portfolio/artists`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        )
        setArtists(
          (data.artists ?? []).flatMap((artist) => {
            const id = artist.id || artist._id
            if (!id) return []

            return [{
              id,
              _id: id,
              name: artist.name || artist.full_name || 'Artist',
              profilePictureUrl: artist.profilePictureUrl || '',
              artworkCount: artist.artworkCount ?? 0,
              followerCount: artist.followerCount ?? 0,
              followingCount: artist.followingCount ?? 0,
            }]
          })
        )
      } catch (requestError) {
        if (axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load artists. Please try again.'
            : 'Could not load artists. Please try again.'
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadArtists()
    return () => controller.abort()
  }, [token])

  return (
    <main className="portfolio-background min-h-full w-full min-w-0 px-5 py-8 text-zinc-100 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <header className="mb-10">
          <h1 className="page-heading text-4xl font-black tracking-tighter uppercase">Artist Directory</h1>
        </header>

        <section aria-labelledby="popular-artworks-heading" className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="popular-artworks-heading" className="text-2xl font-bold text-white sm:text-3xl">Popular artworks</h2>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Scroll popular artworks left" onClick={() => scrollCarousel(-1)} className="rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10"><ChevronLeft size={20} /></button>
              <button type="button" aria-label="Scroll popular artworks right" onClick={() => scrollCarousel(1)} className="rounded-full border border-white/15 bg-white/5 p-2 text-white transition hover:bg-white/10"><ChevronRight size={20} /></button>
            </div>
          </div>
          {artworksLoading ? (
            <p role="status" className="py-10 text-center text-sm text-zinc-400">Loading popular artworks…</p>
          ) : artworksError ? (
            <p role="alert" className="rounded-2xl border border-red-400/20 bg-black/40 p-5 text-sm text-red-300">{artworksError}</p>
          ) : popularArtworks.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">No popular artworks yet.</p>
          ) : (
            <div ref={carouselRef} role="region" aria-label="Popular artworks carousel" className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 touch-pan-x [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,.25)_transparent]">
              {popularArtworks.map((artwork) => (
                <article key={artwork.id} className="w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:w-[42%] lg:w-[calc(25%-12px)]">
                  <div className="relative aspect-[4/3] bg-white/5">
                    <Image src={artwork.url} alt={artwork.title} fill unoptimized sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 25vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="truncate font-semibold text-white">{artwork.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1"><Eye size={14} />{artwork.views} views</span>
                      <span className="inline-flex items-center gap-1"><Heart size={14} />{artwork.likes} likes</span>
                      <span>Score {artwork.popularityScore}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {loading ? (
          <p role="status" className="py-16 text-center text-sm text-zinc-400">Loading artists…</p>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-400/20 bg-black/40 p-6 text-center text-sm text-red-300">
            {error}
          </div>
        ) : artists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-zinc-400">
            No artists found yet. Check back when more artists have joined.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {artists.map((artist) => {
              const artistName = artist.name
              const artistId = artist.id || artist._id
              return (
                <Link
                  key={artistId}
                  href={`/dashboard/artists/${encodeURIComponent(artistId)}`}
                  className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-center backdrop-blur transition hover:border-white/25 hover:bg-white/[0.08] sm:flex-row sm:gap-4 sm:p-5 sm:text-left"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-zinc-400 sm:h-16 sm:w-16">
                    {artist.profilePictureUrl ? (
                      <Image
                        src={artist.profilePictureUrl}
                        alt={`${artistName} profile picture`}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <UserRound size={20} className="sm:h-[26px] sm:w-[26px]" />
                    )}
                  </div>
                  <div className="min-w-0 w-full flex-1">
                    <h2 className="truncate text-xs font-bold text-white transition group-hover:text-cyan-300 sm:text-lg">
                      {artistName}
                    </h2>
                    <p className="mt-1 flex items-center justify-center gap-1 text-[9px] text-zinc-400 sm:justify-start sm:gap-1.5 sm:text-xs">
                      <ImageIcon size={12} className="shrink-0 sm:h-[14px] sm:w-[14px]" />
                      <span className="truncate">{artist.artworkCount} {artist.artworkCount === 1 ? 'artwork' : 'artworks'}</span>
                    </p>
                    <p className="mt-1 truncate text-[9px] leading-tight text-zinc-500 sm:text-xs">
                      {artist.followerCount} {artist.followerCount === 1 ? 'follower' : 'followers'}
                    </p>
                    <p className="mt-1 truncate text-[9px] leading-tight text-zinc-500 sm:text-xs">
                      {artist.followingCount} following
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
