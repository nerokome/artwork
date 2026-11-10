'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/redux/store/store'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const VISITOR_ID_STORAGE_KEY = 'visitorId'

interface LikeStatus {
  artworkId: string
  isLiked: boolean
  likeCount: number
}

function isLikeStatus(value: unknown, artworkId: string): value is LikeStatus {
  return (
    typeof value === 'object' &&
    value !== null &&
    'artworkId' in value &&
    value.artworkId === artworkId &&
    'isLiked' in value &&
    typeof value.isLiked === 'boolean' &&
    'likeCount' in value &&
    typeof value.likeCount === 'number' &&
    Number.isFinite(value.likeCount) &&
    value.likeCount >= 0
  )
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback
  if (error.response?.status === 429) return ''
  const response = error.response?.data
  if (typeof response === 'object' && response !== null) {
    if ('error' in response && typeof response.error === 'string') return response.error
    if ('message' in response && typeof response.message === 'string') return response.message
  }
  return fallback
}

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY)
  if (!visitorId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId)) {
    visitorId = crypto.randomUUID()
    localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId)
  }
  return visitorId
}

export default function ArtworkLikeButton({
  artworkId,
  initialLikeCount = 0,
}: {
  artworkId: string
  initialLikeCount?: number
}) {
  const token = useSelector((state: RootState) => state.user.token)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusLoaded, setStatusLoaded] = useState(false)
  const [statusRetry, setStatusRetry] = useState(0)
  const mutationInFlight = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const loadStatus = async () => {
      setLoading(true)
      setStatusLoaded(false)
      setError('')
      try {
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : { 'X-Visitor-ID': getVisitorId() }
        const { data } = await axios.get<unknown>(
          `${API_URL}/artworks/${encodeURIComponent(artworkId)}/like`,
          { headers, signal: controller.signal }
        )
        if (!isLikeStatus(data, artworkId)) throw new Error('The server returned an invalid like status.')
        if (active) {
          setIsLiked(data.isLiked)
          setLikeCount(data.likeCount)
          setStatusLoaded(true)
        }
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) return
        setError(getErrorMessage(requestError, 'Could not load likes.'))
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadStatus()
    return () => {
      active = false
      controller.abort()
    }
  }, [artworkId, statusRetry, token])

  const toggleLike = async () => {
    if (loading || mutationInFlight.current) return
    mutationInFlight.current = true
    const previousIsLiked = isLiked
    const previousLikeCount = likeCount
    const nextIsLiked = statusLoaded ? !previousIsLiked : true

    setLoading(true)
    setError('')
    setIsLiked(nextIsLiked)
    if (statusLoaded) {
      setLikeCount(Math.max(0, previousLikeCount + (nextIsLiked ? 1 : -1)))
    }
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { 'X-Visitor-ID': getVisitorId() }
      const { data } = await axios.request<unknown>({
        url: `${API_URL}/artworks/${encodeURIComponent(artworkId)}/like`,
        method: nextIsLiked ? 'POST' : 'DELETE',
        headers,
      })
      if (!isLikeStatus(data, artworkId)) throw new Error('The server returned an invalid like status.')
      setIsLiked(data.isLiked)
      setLikeCount(data.likeCount)
    } catch (requestError) {
      setIsLiked(previousIsLiked)
      setLikeCount(previousLikeCount)
      setError(getErrorMessage(requestError, 'Could not update like.'))
    } finally {
      mutationInFlight.current = false
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void toggleLike()}
        disabled={loading}
        title={!statusLoaded ? 'Click to check or like this artwork.' : undefined}
        aria-label={`${isLiked ? 'Unlike' : 'Like'} artwork; ${likeCount} likes`}
        aria-pressed={isLiked}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:text-rose-500 disabled:cursor-wait disabled:opacity-60"
      >
        <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
        <span>{likeCount}</span>
      </button>
      {error && (
        <div className="mt-1 flex items-center gap-2">
          <p role="alert" className="text-[10px] text-red-400">{error}</p>
          {!statusLoaded && !loading && (
            <button
              type="button"
              onClick={() => setStatusRetry((attempt) => attempt + 1)}
              className="shrink-0 text-[10px] text-cyan-400 underline underline-offset-2"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}
