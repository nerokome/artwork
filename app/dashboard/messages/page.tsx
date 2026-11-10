'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { MessageCircle, Search, UserRound } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/redux/store/store'
import ArtistChat from '@/app/components/ArtistChat'
import DashboardBackLink from '@/app/components/DashboardBackLink'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface Artist {
  id: string
  name: string
  profilePictureUrl: string
}

interface ArtistResponse {
  id?: string
  _id?: string
  name?: string
  full_name?: string
  profilePictureUrl?: string
}

export default function MessagesPage() {
  const token = useSelector((state: RootState) => state.user.token)
  const user = useSelector((state: RootState) => state.user.user)
  const [contacts, setContacts] = useState<Artist[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadContacts = async () => {
      if (!token) {
        setError('Sign in to browse artists and start a conversation.')
        setLoading(false)
        return
      }

      try {
        const { data } = await axios.get<{ artists: ArtistResponse[] }>(
          `${BASE_URL}/portfolio/artists`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        )
        const nextContacts = (data.artists ?? []).flatMap((artist) => {
          const id = artist.id || artist._id
          if (!id || id === user?.id) return []
          return [{
            id,
            name: artist.name || artist.full_name || 'Artist',
            profilePictureUrl: artist.profilePictureUrl || '',
          }]
        })
        setContacts(nextContacts)
      } catch (requestError) {
        if (axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load artists.'
            : 'Could not load artists.'
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadContacts()
    return () => controller.abort()
  }, [token, user?.id])

  useEffect(() => {
    const requestedArtistId = new URLSearchParams(window.location.search).get('artistId')
    if (requestedArtistId && contacts.some((contact) => contact.id === requestedArtistId)) {
      setSelectedId(requestedArtistId)
    }
  }, [contacts])

  const visibleContacts = useMemo(
    () => contacts.filter((contact) => contact.name.toLowerCase().includes(search.trim().toLowerCase())),
    [contacts, search]
  )
  const selectedContact = contacts.find((contact) => contact.id === selectedId)

  return (
    <main className="portfolio-background flex h-full min-h-0 flex-col px-2 py-2 text-zinc-100 sm:px-6 sm:py-5">
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <header className="mb-3 shrink-0 sm:mb-4">
          <DashboardBackLink />
          <h1 className="page-heading text-3xl font-black tracking-tighter uppercase sm:text-4xl">Messages</h1>
        </header>

        <div className="grid min-h-[360px] flex-1 grid-rows-[minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl md:min-h-0 md:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] md:grid-rows-1">
          <section
            className={`min-h-0 flex-col border-b border-white/10 md:flex md:border-b-0 md:border-r ${
              selectedContact ? 'hidden' : 'flex'
            }`}
            aria-label="Artist contacts"
          >
            <div className="border-b border-white/10 p-4">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
                <Search size={16} className="shrink-0 text-zinc-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search artists"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </label>
            </div>

            {loading ? (
              <p role="status" className="p-6 text-center text-sm text-zinc-400">Loading artists…</p>
            ) : error ? (
              <p role="alert" className="p-5 text-sm text-red-300">{error}</p>
            ) : visibleContacts.length === 0 ? (
              <p className="p-6 text-center text-sm text-zinc-400">No artists found.</p>
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto md:max-h-[calc(65vh-4rem)]">
                {visibleContacts.map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(contact.id)}
                      className={`flex w-full items-center gap-3 border-b border-white/5 p-4 text-left transition ${
                        selectedId === contact.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-zinc-400">
                        {contact.profilePictureUrl ? (
                          <Image src={contact.profilePictureUrl} alt="" fill unoptimized sizes="44px" className="object-cover" />
                        ) : (
                          <UserRound size={20} />
                        )}
                      </div>
                      <span className="truncate text-sm font-semibold text-white">{contact.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className={`min-h-0 flex-col md:flex ${
              selectedContact ? 'flex' : 'hidden'
            }`}
            aria-label="Conversation"
          >
            {selectedContact ? (
              <ArtistChat
                key={selectedContact.id}
                artistId={selectedContact.id}
                artistName={selectedContact.name}
                onBack={() => setSelectedId('')}
              />
            ) : (
              <div className="m-auto hidden p-8 text-center text-sm text-zinc-400 md:block">
                <MessageCircle size={32} className="mx-auto mb-3 opacity-60" />
                Choose an artist to open a conversation.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
