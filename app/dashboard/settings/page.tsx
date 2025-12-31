'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { Copy, Check, Globe } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function PortfolioSettings() {
  const { user } = useSelector((state: RootState) => state.user)

  const [copied, setCopied] = useState(false)
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewPic, setPreviewPic] = useState<string | null>(null)
  const [name, setName] = useState(user?.name || '')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [visibility, setVisibility] = useState('Public')
  const [allowIndexing, setAllowIndexing] = useState(true)

  
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://artwork-phi-swart.vercel.app'

  
  const portfolioUrl = useMemo(() => {
    if (!user?.name) return ''

    const slug = user.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')

    return `${baseUrl}/portfolio/${slug}`
  }, [user?.name, baseUrl])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    setProfilePic(file)
    setPreviewPic(URL.createObjectURL(file))
  }

  return (
    <div className="min-h-screen bg-black px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-3xl space-y-6">

        {/* Portfolio URL */}
        <div className="bg-black/50 rounded-2xl p-3 sm:p-4 flex gap-3 items-center">
          <Globe className="text-cyan-400 shrink-0" />
          <span className="text-white text-sm sm:text-base break-all flex-1">
            {portfolioUrl || 'Portfolio URL unavailable'}
          </span>
          <button
            onClick={handleCopy}
            disabled={!portfolioUrl}
            className="bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black px-3 py-2 rounded-xl flex items-center justify-center"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* Profile Info */}
        <div className="bg-black/50 rounded-2xl p-4 sm:p-5 md:p-6 space-y-4">
          <h2 className="text-white text-base sm:text-lg font-bold">
            Profile Info
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-zinc-900 flex items-center justify-center">
              {previewPic ? (
                <img
                  src={previewPic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-zinc-400 text-xs">No Image</span>
              )}
            </div>

            <label className="bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 rounded-xl cursor-pointer text-sm w-fit">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          </div>

          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Location"
            value={location}
            placeholder="City, Country"
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Bio
            </label>
            <textarea
              rows={4}
              placeholder="Tell the world about your creative process..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-black/50 rounded-2xl p-4 sm:p-5 md:p-6 space-y-4">
          <h2 className="text-white text-base sm:text-lg font-bold">
            Privacy & Security
          </h2>

          <select
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Private</option>
          </select>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allowIndexing}
              onChange={(e) => setAllowIndexing(e.target.checked)}
              className="mt-1"
            />
            <span className="text-white text-sm">
              Allow search engines to index my portfolio
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="text-zinc-400 hover:text-white text-sm font-semibold">
            Cancel
          </button>
          <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 active:scale-95">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
      />
    </div>
  )
}
