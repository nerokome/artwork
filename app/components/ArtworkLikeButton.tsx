'use client'

import { useEffect, useState } from 'react'
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

function getVisitorId() {
  let visitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY)
  if (!visitorId) {
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

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const loadStatus = async () => {
      try {
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : { 'X-Visitor-ID': getVisitorId() }
        const { data } = await axios.get<LikeStatus>(
          `${API_URL}/artworks/${encodeURIComponent(artworkId)}/like`,
          { headers, signal: controller.signal }
        )
        if (active) {
          setIsLiked(data.isLiked)
          setLikeCount(data.likeCount)
          setError('')
        }
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load likes.'
            : 'Could not load likes.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    setLoading(true)
    void loadStatus()
    return () => {
      active = false
      controller.abort()
    }
  }, [artworkId, token])

  const toggleLike = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { 'X-Visitor-ID': getVisitorId() }
      const { data } = await axios.request<LikeStatus>({
        url: `${API_URL}/artworks/${encodeURIComponent(artworkId)}/like`,
        method: isLiked ? 'DELETE' : 'POST',
        headers,
      })
      setIsLiked(data.isLiked)
      setLikeCount(data.likeCount)
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not update like.'
          : 'Could not update like.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void toggleLike()}
        disabled={loading}
        aria-label={`${isLiked ? 'Unlike' : 'Like'} artwork; ${likeCount} likes`}
        aria-pressed={isLiked}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:text-rose-500 disabled:cursor-wait disabled:opacity-60"
      >
        <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
        <span>{likeCount}</span>
      </button>
      {error && <p role="alert" className="text-[10px] text-red-400">{error}</p>}
    </div>
  )
}
