'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { ArrowLeft, UserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/redux/store/store'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface FollowedUser {
  id: string
  name: string
  profilePictureUrl: string
}

interface ApiUser {
  id?: string
  _id?: string
  name?: string
  full_name?: string
  profilePictureUrl?: string
  avatarUrl?: string
}

function parseUsers(data: unknown, type: 'followers' | 'following') {
  if (!data || typeof data !== 'object') {
    throw new Error(`The ${type} response was invalid.`)
  }
  const response = data as Record<string, unknown>
  const list = response[type] ?? response.users
  if (!Array.isArray(list)) {
    throw new Error(`The ${type} response did not contain a user list.`)
  }

  return list.flatMap((item): FollowedUser[] => {
    if (!item || typeof item !== 'object') return []
    const user = item as ApiUser
    const id = user.id || user._id
    if (!id) return []
    return [{
      id,
      name: user.name || user.full_name || 'Artist',
      profilePictureUrl: user.profilePictureUrl || user.avatarUrl || '',
    }]
  })
}

export default function FollowList({ type }: { type: 'followers' | 'following' }) {
  const user = useSelector((state: RootState) => state.user.user)
  const token = useSelector((state: RootState) => state.user.token)
  const [users, setUsers] = useState<FollowedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const title = type === 'followers' ? 'Followers' : 'Following'

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const loadUsers = async () => {
      if (!token || !user?.id) {
        setError('Sign in to view this list.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const { data } = await axios.get(
          `${API_URL}/users/${encodeURIComponent(user.id)}/${type}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        )
        if (active) setUsers(parseUsers(data, type))
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || `Could not load ${title.toLowerCase()}.`
            : requestError instanceof Error ? requestError.message : `Could not load ${title.toLowerCase()}.`
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadUsers()
    return () => {
      active = false
      controller.abort()
    }
  }, [token, type, title, user?.id])

  return (
    <main className="portfolio-background min-h-full px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard/profile" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} /> Profile
        </Link>
        <h1 className="page-heading mb-8 text-4xl font-black tracking-tighter uppercase">{title}</h1>
        {loading ? (
          <p role="status" className="py-12 text-center text-sm text-zinc-400">Loading {title.toLowerCase()}…</p>
        ) : error ? (
          <p role="alert" className="rounded-2xl border border-red-400/20 bg-black/40 p-6 text-center text-sm text-red-300">{error}</p>
        ) : users.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
            {type === 'followers' ? 'You do not have any followers yet.' : 'You are not following any artists yet.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {users.map((person) => (
              <li key={person.id}>
                <Link
                  href={`/dashboard/artists/${encodeURIComponent(person.id)}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]"
                >
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-zinc-400">
                    {person.profilePictureUrl
                      ? <Image src={person.profilePictureUrl} alt="" fill unoptimized sizes="48px" className="object-cover" />
                      : <UserRound size={22} />}
                  </span>
                  <span className="font-semibold text-white">{person.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
