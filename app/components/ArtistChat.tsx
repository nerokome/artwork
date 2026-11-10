'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ArrowLeft, MessageCircle, Palette, Send } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/redux/store/store'
import { fetchNotifications } from '@/app/redux/store/messagingslice'
import { useTheme } from '@/app/components/ThemeProvider'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
const configuredWebSocketUrl = process.env.NEXT_PUBLIC_WS_BASE_URL

interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  text: string
  createdAt: string
}

interface ChatColors {
  sent: string
  received: string
  background?: string
}

const CHAT_COLORS_STORAGE_KEY = 'artfolio-chat-colors'

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value)
}

function isChatColors(value: unknown): value is ChatColors {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sent' in value &&
    isHexColor(value.sent) &&
    'received' in value &&
    isHexColor(value.received) &&
    (!('background' in value) || isHexColor(value.background))
  )
}

function getWebSocketBaseUrl() {
  if (configuredWebSocketUrl) return configuredWebSocketUrl.replace(/\/+$/, '')
  try {
    const apiUrl = new URL(API_URL)
    if (apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1') {
      return 'ws://localhost:5005'
    }
    return apiUrl.origin.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:')
  } catch {
    return ''
  }
}

function mergeMessages(...groups: ChatMessage[][]) {
  const messages = new Map<string, ChatMessage>()
  for (const message of groups.flat()) {
    messages.set(message.id, message)
  }
  return [...messages.values()].sort(
    (first, second) => Date.parse(first.createdAt) - Date.parse(second.createdAt)
  )
}

export default function ArtistChat({
  artistId,
  artistName,
  onBack,
}: {
  artistId: string
  artistName: string
  onBack?: () => void
}) {
  const dispatch = useDispatch<AppDispatch>()
  const { theme } = useTheme()
  const token = useSelector((state: RootState) => state.user.token)
  const userId = useSelector((state: RootState) => state.user.user?.id)
  const socketRef = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const [sendError, setSendError] = useState('')
  const [chatColors, setChatColors] = useState<ChatColors | null>(null)
  const [showColorSettings, setShowColorSettings] = useState(false)
  const defaultChatColors: ChatColors = theme === 'light'
    ? { sent: '#ffffff', received: '#f8fafc' }
    : { sent: '#27272a', received: '#18181b' }

  useEffect(() => {
    try {
      const savedColors = localStorage.getItem(CHAT_COLORS_STORAGE_KEY)
      if (!savedColors) return
      const parsedColors: unknown = JSON.parse(savedColors)
      if (isChatColors(parsedColors)) setChatColors(parsedColors)
    } catch {
      toast.error('Could not load saved chat colors.')
    }
  }, [])

  const updateChatColor = (key: keyof ChatColors, color: string) => {
    const updated = { ...(chatColors ?? defaultChatColors), [key]: color }
    setChatColors(updated)
    try {
      localStorage.setItem(CHAT_COLORS_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      toast.error('Chat color changed, but could not be saved.')
    }
  }

  const resetChatColors = () => {
    setChatColors(null)
    try {
      localStorage.removeItem(CHAT_COLORS_STORAGE_KEY)
    } catch {
      toast.error('Could not remove saved chat colors.')
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    let socket: WebSocket | null = null

    setMessages([])
    setError('')
    setLoading(true)
    setConnected(false)

    if (!token) {
      setError('Sign in to chat with this artist.')
      setLoading(false)
      return () => controller.abort()
    }

    const wsBaseUrl = getWebSocketBaseUrl()
    if (!wsBaseUrl) {
      setError('Chat is unavailable because the WebSocket URL is not configured.')
      setLoading(false)
      return () => controller.abort()
    }

    try {
      socket = new WebSocket(
        `${wsBaseUrl}/chat/ws/${encodeURIComponent(artistId)}?token=${encodeURIComponent(token)}`
      )
      socketRef.current = socket

      socket.onopen = () => {
        if (active) setConnected(true)
      }

      socket.onmessage = (event: MessageEvent<string>) => {
        if (!active) return
        let message: ChatMessage
        try {
          message = JSON.parse(event.data) as ChatMessage
        } catch {
          setError('Received an unreadable chat message from the server.')
          return
        }

        if (
          !message.id ||
          !message.senderId ||
          typeof message.text !== 'string' ||
          !message.createdAt
        ) {
          setError('Received an invalid chat message from the server.')
          return
        }

        setMessages((current) => mergeMessages(current, [message]))
        if (message.senderId !== userId) {
          void dispatch(fetchNotifications(token))
        }
      }

      socket.onerror = () => {
        if (active) setError('Could not connect to chat. Check your connection and try again.')
      }

      socket.onclose = () => {
        if (active) setConnected(false)
      }
    } catch {
      setError('Could not open a chat connection. Check the WebSocket URL configuration.')
      setLoading(false)
      return () => controller.abort()
    }

    const loadHistory = async () => {
      try {
        const { data } = await axios.get<{ messages: ChatMessage[] }>(
          `${API_URL}/chat/${encodeURIComponent(artistId)}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        )
        if (active) setMessages((current) => mergeMessages(data.messages ?? [], current))
      } catch (requestError) {
        if (!active || axios.isCancel(requestError)) return
        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load chat history.'
            : 'Could not load chat history.'
        )
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadHistory()

    return () => {
      active = false
      controller.abort()
      socketRef.current = null
      socket?.close()
    }
  }, [artistId, artistName, dispatch, token, userId])

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    const socket = socketRef.current
    if (!text || !socket) return
    if (socket.readyState !== WebSocket.OPEN) {
      setSendError('Chat is not connected yet. Please try again in a moment.')
      return
    }

    try {
      socket.send(JSON.stringify({ text }))
      setDraft('')
      setSendError('')
    } catch {
      setSendError('Message could not be sent. Please try again.')
    }
  }

  return (
    <section
      className="artist-chat flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent backdrop-blur-xl"
      style={{ backgroundColor: chatColors?.background }}
      aria-label={`Chat with ${artistName}`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="shrink-0 rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white md:hidden"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className="flex min-w-0 items-center gap-2 font-semibold text-white">
            <MessageCircle size={18} className="shrink-0" />
            <span className="truncate">{artistName}</span>
          </h2>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setShowColorSettings((visible) => !visible)}
            aria-expanded={showColorSettings}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 transition hover:text-white sm:gap-2"
          >
            <Palette size={16} /> <span className="hidden sm:inline">Customize</span>
          </button>
          <span className="flex items-center gap-2 text-xs text-zinc-400">
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
            <span className="hidden sm:inline">{connected ? 'Connected' : 'Connecting'}</span>
          </span>
        </div>
      </header>

      {showColorSettings && (
        <div className="flex flex-wrap items-center justify-center gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            My messages
            <input
              type="color"
              value={chatColors?.sent ?? defaultChatColors.sent}
              onChange={(event) => updateChatColor('sent', event.target.value)}
              className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            Other messages
            <input
              type="color"
              value={chatColors?.received ?? defaultChatColors.received}
              onChange={(event) => updateChatColor('received', event.target.value)}
              className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            Chat page
            <input
              type="color"
              value={chatColors?.background ?? (theme === 'light' ? '#ffffff' : '#18181b')}
              onChange={(event) => updateChatColor('background', event.target.value)}
              className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
            />
          </label>
          <button
            type="button"
            onClick={resetChatColors}
            className="text-xs text-zinc-400 underline underline-offset-2 transition hover:text-white"
          >
            Reset colors
          </button>
        </div>
      )}

      {error && <p role="alert" className="border-b border-white/10 px-5 py-3 text-sm text-red-300">{error}</p>}

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3 sm:p-4" aria-live="polite">
        {loading ? (
          <p role="status" className="m-auto text-sm text-zinc-400">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="m-auto text-sm text-zinc-400">No messages yet. Say hello to start the conversation.</p>
        ) : messages.map((message) => {
          const ownMessage = message.senderId === userId
          return (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                ownMessage
                  ? 'self-end rounded-br-sm text-white'
                  : 'self-start rounded-bl-sm text-zinc-100'
              }`}
              style={{ backgroundColor: ownMessage
                ? chatColors?.sent ?? defaultChatColors.sent
                : chatColors?.received ?? defaultChatColors.received }}
            >
              <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
              <time className="mt-1 block text-right text-[10px] text-zinc-400">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </time>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="shrink-0 border-t border-white/10 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <label htmlFor={`chat-${artistId}`} className="sr-only">Write a message</label>
          <input
            id={`chat-${artistId}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={2000}
            disabled={!token}
            placeholder={`Message ${artistName}`}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-white/25 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!draft.trim() || !connected}
            aria-label="Send message"
            className="rounded-xl bg-white px-4 py-3 text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>
        {sendError && <p role="alert" className="mt-2 text-xs text-red-300">{sendError}</p>}
      </form>
    </section>
  )
}
