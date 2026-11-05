'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, Image as ImageIcon, UserRound } from 'lucide-react'
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

export default function ArtistsPage() {
  const token = useSelector((state: RootState) => state.user.token)
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    <main className="portfolio-background min-h-screen px-5 py-12 text-zinc-100 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Home
        </Link>

        <header className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Discover</p>
          <h1 className="page-heading text-4xl font-black uppercase tracking-tight sm:text-5xl">Artist Directory</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Explore artists and discover their public artwork collections.
          </p>
        </header>

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
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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
