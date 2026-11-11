'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ArrowUpRight, ImagePlus, Mail, Save, ShieldCheck, UserRound, Users, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import { logoutUser, updateLocalProfile } from '@/app/redux/store/userslice'
import DashboardPageHeading from '@/app/components/DashboardPageHeading'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']

interface UserListResponse {
  users?: unknown[]
  followers?: unknown[]
  following?: unknown[]
}

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user)
  const token = useSelector((state: RootState) => state.user.token)
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState('')
  const [pictureUrl, setPictureUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [followerCount, setFollowerCount] = useState<number | null>(null)
  const [followingCount, setFollowingCount] = useState<number | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const applyProfile = useCallback((profile: { name: string; profilePictureUrl?: string }) => {
    setName(profile.name || '')
    setPictureUrl(profile.profilePictureUrl || '')
    dispatch(updateLocalProfile({ name: profile.name || '', avatarUrl: profile.profilePictureUrl }))
  }, [dispatch])

  useEffect(() => {
    if (!previewUrl) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!token) {
        await dispatch(logoutUser())
        window.location.assign('/auth/login')
        return
      }
      setLoading(true)
      setError('')
      try {
        const { data } = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (active) applyProfile(data.profile)
      } catch (requestError) {
        if (!active) return
        if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
          await dispatch(logoutUser())
          window.location.assign('/auth/login')
          return
        }
        const message = axios.isAxiosError(requestError)
          ? requestError.response?.data?.message || 'Could not load your profile. Please try again.'
          : 'Could not load your profile. Please try again.'
        setError(message)
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [token, dispatch, applyProfile])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const loadFollowStats = async () => {
      if (!token || !user?.id) {
        setStatsLoading(false)
        setStatsError('Could not identify your account to load follow statistics.')
        return
      }

      setStatsLoading(true)
      setStatsError('')
      setFollowerCount(null)
      setFollowingCount(null)

      try {
        const headers = { Authorization: `Bearer ${token}` }
        const [followersResponse, followingResponse] = await Promise.all([
          axios.get<UserListResponse>(`${BASE_URL}/users/${encodeURIComponent(user.id)}/followers`, {
            headers,
            signal: controller.signal,
          }),
          axios.get<UserListResponse>(`${BASE_URL}/users/${encodeURIComponent(user.id)}/following`, {
            headers,
            signal: controller.signal,
          }),
        ])
        const getList = (data: UserListResponse, key: 'followers' | 'following') => {
          const list = data[key] ?? data.users
          if (!Array.isArray(list)) throw new Error(`The ${key} response did not contain a list.`)
          return list
        }
        const ownFollowerCount = getList(followersResponse.data, 'followers').length
        const ownFollowingCount = getList(followingResponse.data, 'following').length

        if (active) {
          setFollowerCount(ownFollowerCount)
          setFollowingCount(ownFollowingCount)
        }
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) return
        setStatsError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load follow statistics.'
            : 'Could not load follow statistics.'
        )
      } finally {
        if (active) setStatsLoading(false)
      }
    }

    void loadFollowStats()
    return () => {
      active = false
      controller.abort()
    }
  }, [token, user?.id])

  const displayName = name.trim() || 'Artfolio Member'
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  const handleChoosePicture = (file?: File) => {
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error('Choose a JPEG, PNG, GIF, WebP, or AVIF image.')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Profile pictures must be 5 MB or smaller.')
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) return toast.error('Enter a name for your profile.')
    if (!token) return toast.error('Sign in to update your profile.')
    setSaving(true)
    try {
      const { data } = await axios.patch(`${BASE_URL}/profile`, { name: cleanName }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      applyProfile(data.profile)
      toast.success('Your name has been updated.')
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        await dispatch(logoutUser())
        window.location.assign('/auth/login')
      } else {
        toast.error(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not save your name.' : 'Could not save your name.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !token) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const { data } = await axios.put(`${BASE_URL}/profile/picture`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      applyProfile(data.profile)
      setSelectedFile(null)
      setPreviewUrl('')
      toast.success('Your profile picture has been updated.')
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        await dispatch(logoutUser())
        window.location.assign('/auth/login')
      } else {
        toast.error(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not upload your picture.' : 'Could not upload your picture.')
      }
    } finally {
      setUploading(false)
    }
  }

  const shownPicture = previewUrl || pictureUrl

  return (
    <div className="font-sans min-h-full bg-black text-white">
      <div className="portfolio-background relative min-h-full overflow-hidden rounded-2xl">
        <main className="relative z-10 mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
          <header className="mb-10 text-center">
            <DashboardPageHeading icon={UserRound}>Your Profile</DashboardPageHeading>
          </header>

          {loading ? (
            <p role="status" className="py-16 text-center text-zinc-300">Loading your profile…</p>
          ) : error ? (
            <div role="alert" className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-black/60 p-8 text-center text-red-300">
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-sm text-white">Try again</button>
            </div>
          ) : <>
            <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md sm:p-9" aria-label="Profile details">
              <div className="flex flex-col items-center gap-4 border-b border-white/10 pb-8">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 text-3xl font-black text-cyan-300">
                  {pictureUrl ? <Image src={pictureUrl} alt={`${displayName} profile picture`} width={112} height={112} unoptimized className="h-full w-full rounded-full object-cover" /> : initials || <UserRound size={30} />}
                </div>
                <div><h2 className="text-2xl font-bold">{displayName}</h2><p className="mt-1 text-sm text-zinc-400">{user?.role || 'Artist'}</p></div>
              </div>
              <div className="mx-auto grid max-w-xl grid-cols-2 gap-4 py-6">
                <Link href="/dashboard/followers" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]">
                  <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Users size={15} className="text-cyan-400" /> Followers
                  </p>
                  <p className="mt-2 text-2xl font-bold">{statsLoading ? '…' : followerCount ?? '—'}</p>
                </Link>
                <Link href="/dashboard/following" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]">
                  <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <UserPlus size={15} className="text-cyan-400" /> Following
                  </p>
                  <p className="mt-2 text-2xl font-bold">{statsLoading ? '…' : followingCount ?? '—'}</p>
                </Link>
              </div>
              {statsError && <p role="alert" className="mb-5 text-sm text-red-300">{statsError}</p>}
              <dl className="mx-auto grid max-w-xl gap-4 py-8 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500"><Mail size={15} className="text-cyan-400" /> Email address</dt><dd className="mt-3 break-all text-sm text-white">{user?.email || 'Not available'}</dd></div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500"><ShieldCheck size={15} className="text-cyan-400" /> Account type</dt><dd className="mt-3 text-sm capitalize text-white">{user?.role || 'Artist'}</dd></div>
              </dl>
              <Link href="/dashboard/settings" className="mx-auto inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-300">Portfolio settings <ArrowUpRight size={16} /></Link>
            </section>

            <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md sm:p-9" aria-label="Edit profile">
              <div className="mb-7"><h2 className="text-xl font-bold">Edit profile</h2></div>
              <div className="flex flex-col items-center gap-5">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 text-3xl font-bold text-cyan-300">
                  {shownPicture ? <Image src={shownPicture} alt="Profile picture preview" width={128} height={128} unoptimized className="h-full w-full rounded-full object-cover" /> : initials || <UserRound size={30} />}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/50 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10">
                    <ImagePlus size={17} /> Choose picture
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" className="sr-only" disabled={uploading} onChange={(event) => { handleChoosePicture(event.currentTarget.files?.[0]); event.currentTarget.value = '' }} />
                  </label>
                  {selectedFile && <button type="button" disabled={uploading} onClick={() => { setSelectedFile(null); setPreviewUrl('') }} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 disabled:opacity-50">Discard selection</button>}
                  <button type="button" onClick={() => void handleUpload()} disabled={!selectedFile || uploading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{uploading ? 'Uploading…' : 'Upload picture'}</button>
                </div>
                <p className="text-xs text-zinc-500">JPEG, PNG, GIF, WebP, or AVIF. Maximum 5 MB.</p>
              </div>
              <form onSubmit={handleSave} className="mt-8 flex flex-col items-center gap-6">
                <label className="block w-full max-w-xl text-left"><span className="mb-2 block text-center text-sm font-semibold text-zinc-300">Display name</span><input type="text" value={name} maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-white outline-none transition focus:border-cyan-400" required /></label>
                <button type="submit" disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"><Save size={17} /> {saving ? 'Saving…' : 'Save name'}</button>
              </form>
            </section>
          </>}
        </main>
      </div>
    </div>
  )
}
