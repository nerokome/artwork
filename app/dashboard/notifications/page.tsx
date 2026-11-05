'use client'

import { useState } from 'react'
import { Bell, CheckCheck, CircleCheck, Inbox, RefreshCw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/app/redux/store/store'
import { fetchNotifications, markNotificationRead } from '@/app/redux/store/messagingslice'

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((state: RootState) => state.user.token)
  const { notifications, notificationsLoading, notificationsError } = useSelector(
    (state: RootState) => state.messaging
  )
  const [actionError, setActionError] = useState('')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const unreadNotifications = notifications.filter((notification) => !notification.isRead)

  const handleMarkRead = async (id: string) => {
    if (!token) return
    setActionError('')
    setMarkingId(id)
    try {
      await dispatch(markNotificationRead({ id, token })).unwrap()
    } catch (error) {
      setActionError(typeof error === 'string' ? error : 'Could not mark notification as read.')
    } finally {
      setMarkingId(null)
    }
  }

  const handleMarkAllRead = async () => {
    if (!token) return
    setActionError('')
    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          dispatch(markNotificationRead({ id: notification.id, token })).unwrap()
        )
      )
    } catch (error) {
      setActionError(typeof error === 'string' ? error : 'Some notifications could not be marked as read.')
    }
  }

  return (
    <main className="portfolio-background min-h-full px-4 py-8 text-zinc-100 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="page-heading text-3xl font-black uppercase tracking-tight sm:text-4xl">Notifications</h1>
          <p className="mt-3 text-center text-sm text-zinc-400">
            {unreadNotifications.length
              ? `${unreadNotifications.length} unread notification${unreadNotifications.length === 1 ? '' : 's'}`
              : 'You’re all caught up.'}
          </p>
        </header>

        <div className="mb-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => token && void dispatch(fetchNotifications(token))}
            disabled={!token || notificationsLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw size={16} className={notificationsLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={!token || unreadNotifications.length === 0 || markingId !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>

        {(notificationsError || actionError) && (
          <p role="alert" className="mb-4 text-center text-sm text-red-300">
            {actionError || notificationsError}
          </p>
        )}

        {notificationsLoading && notifications.length === 0 ? (
          <p role="status" className="py-12 text-center text-sm text-zinc-400">Loading notifications…</p>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-14 text-center">
            <Inbox size={32} className="mx-auto mb-3 text-zinc-500" />
            <h2 className="font-semibold text-white">No notifications yet</h2>
            <p className="mt-2 text-sm text-zinc-400">New follows and messages will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-start gap-4 rounded-2xl border p-4 ${
                  notification.isRead ? 'border-white/10 bg-white/[0.03]' : 'border-white/20 bg-white/[0.08]'
                }`}
              >
                <div className="mt-0.5 rounded-full bg-white/10 p-2 text-zinc-300">
                  {notification.isRead ? <CircleCheck size={18} /> : <Bell size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold capitalize text-white">
                      {notification.type === 'follow' ? 'New follower' : notification.type === 'message' ? 'New message' : notification.type}
                    </h2>
                    {!notification.isRead && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black">UNREAD</span>}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{notification.content}</p>
                  <time className="mt-2 block text-xs text-zinc-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </time>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => void handleMarkRead(notification.id)}
                    disabled={markingId === notification.id}
                    className="shrink-0 rounded-lg px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    {markingId === notification.id ? 'Saving…' : 'Mark read'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
