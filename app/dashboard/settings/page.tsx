'use client'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import Link from 'next/link'
import { Copy, Check, Globe, ExternalLink, Palette, ArrowLeft, LockKeyhole } from 'lucide-react'
import { useState, useMemo, useEffect, type FormEvent } from 'react'
import { toast } from 'sonner'
import ThemeToggle from '@/app/components/ThemeToggle'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function PortfolioSettings() {
  const { user, token } = useSelector((state: RootState) => state.user)
  const [copied, setCopied] = useState(false)
  const [accountEmail, setAccountEmail] = useState(user?.email || '')
  const [accountLoading, setAccountLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    if (!token) {
      setAccountLoading(false)
      return () => controller.abort()
    }

    const loadAccount = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/settings/account`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        const account = data.account || data.user || data
        setAccountEmail(account.email || '')
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          toast.error(axios.isAxiosError(requestError)
            ? requestError.response?.data?.message || 'Could not load account details.'
            : 'Could not load account details.')
        }
      } finally {
        if (!controller.signal.aborted) setAccountLoading(false)
      }
    }

    void loadAccount()
    return () => controller.abort()
  }, [token])

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newPassword.length < 6) return toast.error('Your new password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return toast.error('The new passwords do not match.')
    if (!token) return toast.error('Sign in to change your password.')

    setPasswordLoading(true)
    try {
      await axios.patch(`${BASE_URL}/settings/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated successfully.')
    } catch (requestError) {
      toast.error(axios.isAxiosError(requestError)
        ? requestError.response?.data?.message || requestError.response?.data?.error || 'Could not change your password.'
        : 'Could not change your password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://artwork-phi-swart.vercel.app'

  const portfolioUrl = useMemo(() => {
    if (!user?.name) return ''
    const slug = user.name.trim().toLowerCase().replace(/\s+/g, '-')
    return `${baseUrl}/portfolio/${slug}`
  }, [user?.name, baseUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      toast.success('Portfolio link copied.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy the portfolio link.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="portfolio-background relative overflow-hidden rounded-2xl">
        <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl space-y-8">
            <div className="mb-10">
              <Link href="/dashboard/account" className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400">
                <ArrowLeft size={16} /> Account
              </Link>
              <h1 className="page-heading text-4xl font-black tracking-tighter uppercase">
                Account <span className="text-cyan-400">Settings</span>
              </h1>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-25 blur transition duration-1000 group-hover:opacity-50" />
              <div className="relative rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="text-cyan-400" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Global URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-500">Live</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <div className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/50 px-5 py-4">
                    <span className="mr-4 truncate text-sm text-white">{portfolioUrl || 'Link logic initializing...'}</span>
                    {portfolioUrl && <a href={portfolioUrl} target="_blank" rel="noreferrer" aria-label="Open portfolio"><ExternalLink size={14} className="text-zinc-600 transition-colors hover:text-cyan-400" /></a>}
                  </div>
                  <button onClick={handleCopy} disabled={!portfolioUrl} className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-400 px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-cyan-300 active:scale-95 disabled:opacity-50 md:w-auto">
                    {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
                  </button>
                </div>
              </div>
            </div>

            <section className="flex flex-col gap-5 rounded-3xl border border-white/5 bg-black/60 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between" aria-labelledby="appearance-heading">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400"><Palette size={20} /></span>
                <div>
                  <h2 id="appearance-heading" className="font-bold">Appearance</h2>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-3 sm:justify-start">
                <span className="text-sm text-zinc-300">Switch theme</span>
                <ThemeToggle />
              </div>
            </section>

            <section className="space-y-6 rounded-3xl border border-white/5 bg-black/60 p-6 backdrop-blur-md sm:p-8" aria-labelledby="account-settings-heading">
              <div>
                <h2 id="account-settings-heading" className="text-lg font-black uppercase">Account details</h2>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email address</p>
                <p className="mt-1 break-all text-sm text-white">{accountLoading ? 'Loading account…' : accountEmail || 'Not available'}</p>
                <p className="mt-2 text-xs text-zinc-500">Email changes aren’t available yet.</p>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4" aria-labelledby="password-heading">
                <div className="flex items-center gap-2">
                  <LockKeyhole size={18} className="text-cyan-400" />
                  <h3 id="password-heading" className="font-bold">Change password</h3>
                </div>
                <label className="block text-sm text-zinc-300">Current password
                  <input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400" />
                </label>
                <label className="block text-sm text-zinc-300">New password
                  <input type="password" autoComplete="new-password" required minLength={6} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400" />
                </label>
                <label className="block text-sm text-zinc-300">Confirm new password
                  <input type="password" autoComplete="new-password" required minLength={6} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-cyan-400" />
                </label>
                <button type="submit" disabled={passwordLoading || !token} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
                  {passwordLoading ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </section>

            <div className="space-y-8 rounded-3xl border border-white/5 bg-black/60 p-8 backdrop-blur-md">
              <div>
                <h2 className="mb-1 text-lg font-black uppercase">Portfolio Metadata</h2>
              </div>
              <div className="border-l-2 border-cyan-400 pl-6">
                <p className="font-bold text-cyan-400">Portfolio | {user?.name || 'User'}</p>
                <p className="text-xs text-emerald-500">{portfolioUrl}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
