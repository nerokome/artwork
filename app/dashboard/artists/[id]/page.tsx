'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, MessageCircle, UserCheck, UserPlus, UserRound, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/redux/store/store'
import { logArtworkView } from '@/app/redux/store/analysisslice'
import ArtworkLikeButton from '@/app/components/ArtworkLikeButton'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface ArtistProfile {
  id: string
  name: string
  profilePictureUrl: string
}

interface Artwork {
  id: string
  title: string
  url: string
  views: number
  likes?: number
}

interface ArtistPortfolio {
  profile: ArtistProfile
  count: number
  artworks: Artwork[]
}

interface FollowStatus {
  isFollowing: boolean
  followerCount: number
}

export default function ArtistPortfolioPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.user.token)
  const [portfolio, setPortfolio] = useState<ArtistPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [followStatus, setFollowStatus] = useState<FollowStatus | null>(null)
  const [followLoading, setFollowLoading] = useState(false)
  const [followError, setFollowError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadPortfolio = async () => {
      setLoading(true)
      setError('')
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined
        const { data } = await axios.get<ArtistPortfolio>(
          `${BASE_URL}/portfolio/id/${encodeURIComponent(id)}`,
          { headers, signal: controller.signal }
        )
        setPortfolio(data)
      } catch (requestError) {
        if (axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.message || 'Could not load this artist’s portfolio.'
            : 'Could not load this artist’s portfolio.'
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPortfolio()
    return () => controller.abort()
  }, [id, token])

  useEffect(() => {
    const controller = new AbortController()
    setFollowStatus(null)
    setFollowError('')

    if (!token) return () => controller.abort()

    const loadFollowStatus = async () => {
      try {
        const { data } = await axios.get<FollowStatus>(
          `${BASE_URL}/artists/${encodeURIComponent(id)}/follow`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        )
        setFollowStatus(data)
      } catch (requestError) {
        if (axios.isCancel(requestError)) return
        setFollowError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load follow status.'
            : 'Could not load follow status.'
        )
      }
    }

    void loadFollowStatus()
    return () => controller.abort()
  }, [id, token])

  const handleFollowToggle = async () => {
    if (!token || !followStatus || followLoading) return

    setFollowLoading(true)
    setFollowError('')
    try {
      await axios.request({
        url: `${BASE_URL}/artists/${encodeURIComponent(id)}/follow`,
        method: followStatus.isFollowing ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const { data } = await axios.get<FollowStatus>(
        `${BASE_URL}/artists/${encodeURIComponent(id)}/follow`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFollowStatus(data)
    } catch (requestError) {
      setFollowError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not update follow status.'
          : 'Could not update follow status.'
      )
    } finally {
      setFollowLoading(false)
    }
  }

  useEffect(() => {
    if (selectedArtwork?.id) dispatch(logArtworkView(selectedArtwork.id))
  }, [selectedArtwork, dispatch])

  return (
    <main className="portfolio-background min-h-screen px-5 py-12 text-zinc-100 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/artists"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} /> All artists
        </Link>

        {loading ? (
          <p role="status" className="py-20 text-center text-sm text-zinc-400">Loading portfolio…</p>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-400/20 bg-black/40 p-8 text-center text-sm text-red-300">
            {error}
          </div>
        ) : portfolio ? (
          <>
            <header className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-zinc-400">
                {portfolio.profile.profilePictureUrl ? (
                  <Image
                    src={portfolio.profile.profilePictureUrl}
                    alt={`${portfolio.profile.name} profile picture`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound size={32} />
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Public portfolio</p>
                <h1 className="page-heading text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {portfolio.profile.name}
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  {portfolio.count} {portfolio.count === 1 ? 'public artwork' : 'public artworks'}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  {token ? (
                    <button
                      type="button"
                      onClick={() => void handleFollowToggle()}
                      disabled={!followStatus || followLoading}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {followStatus?.isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                      {followLoading ? 'Updating…' : followStatus?.isFollowing ? 'Following' : 'Follow Artist'}
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      <UserPlus size={16} /> Sign in to follow
                    </Link>
                  )}
                  {followStatus && (
                    <span className="text-sm text-zinc-400">
                      {followStatus.followerCount} {followStatus.followerCount === 1 ? 'follower' : 'followers'}
                    </span>
                  )}
                  {token && (
                    <Link
                      href={`/dashboard/messages?artistId=${encodeURIComponent(id)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <MessageCircle size={16} /> Chat
                    </Link>
                  )}
                </div>
                {followError && <p role="alert" className="mt-2 text-sm text-red-300">{followError}</p>}
              </div>
            </header>

            {portfolio.artworks.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-zinc-400">
                This artist has no public artworks yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {portfolio.artworks.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left transition hover:border-white/25"
                  >
                    <button type="button" onClick={() => setSelectedArtwork(artwork)} className="relative block aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={artwork.url}
                        alt={artwork.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                    <div className="p-3 sm:p-4">
                      <h2 className="truncate text-sm font-bold text-white sm:text-base">{artwork.title}</h2>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-zinc-400">{artwork.views} views</p>
                        <ArtworkLikeButton artworkId={artwork.id} initialLikeCount={artwork.likes ?? 0} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      {selectedArtwork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur"
          onClick={() => setSelectedArtwork(null)}
        >
          <button
            type="button"
            aria-label="Close artwork preview"
            onClick={() => setSelectedArtwork(null)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <Image
            src={selectedArtwork.url}
            alt={selectedArtwork.title}
            width={1600}
            height={1200}
            unoptimized
            className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
