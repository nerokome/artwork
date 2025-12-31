'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store/store'
import { Copy, Check, Globe, Share2 } from 'lucide-react'
import { useState } from 'react'

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

  const portfolioUrl = user?.name
    ? `http://localhost:3000/portfolio/${user.name.replace(" ", "-")}`
    : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0])
      setPreviewPic(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <div className="min-h-screen p-6 bg-black">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Portfolio Link */}
        <div className="bg-black/50 rounded-2xl p-4 flex items-center gap-3">
          <Globe className="text-cyan-400" />
          <span className="text-white truncate flex-1">{portfolioUrl}</span>
          <button
            onClick={handleCopy}
            className="bg-cyan-400 hover:bg-cyan-300 text-black px-3 py-2 rounded-xl flex items-center justify-center"
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        {/* Profile Info */}
        <div className="bg-black/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-lg font-bold">Profile Info</h2>

          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-zinc-900 flex items-center justify-center">
              {previewPic ? (
                <img src={previewPic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-400 text-sm">No Image</span>
              )}
            </div>
            <label className="bg-cyan-400 hover:bg-cyan-300 text-black px-3 py-2 rounded-xl cursor-pointer text-sm">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          </div>

          <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Bio
            </label>
            <textarea
              rows={4}
              placeholder="Tell the world about your creative process..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 transition resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-black/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-lg font-bold">Privacy & Security</h2>
          <select
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Private</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowIndexing}
              onChange={(e) => setAllowIndexing(e.target.checked)}
              className="mt-1"
            />
            <span className="text-white text-sm">Allow search engines to index my portfolio</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button className="flex-1 sm:flex-none text-zinc-400 hover:text-white text-sm font-semibold transition">
            Cancel
          </button>
          <button className="flex-1 sm:flex-none bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
      />
    </div>
  )
}
