'use client'

import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store/store'
import { uploadArtwork } from '@/app/redux/store/uploadslice'
import { UploadCloud, FileText, AlertCircle, CheckCircle2, Image as ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import DashboardBackLink from '@/app/components/DashboardBackLink'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.artwork)
  const [title, setTitle] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const addFiles = (incoming: FileList | File[]) => {
    const valid: File[] = []
    const seenFiles = new Set(files.map((file) => `${file.name}:${file.size}:${file.lastModified}`))
    let rejected = 0
    Array.from(incoming).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        rejected += 1
      } else {
        const fileKey = `${file.name}:${file.size}:${file.lastModified}`
        if (seenFiles.has(fileKey)) return
        seenFiles.add(fileKey)
        valid.push(file)
      }
    })
    if (rejected) toast.error(`${rejected} file${rejected === 1 ? '' : 's'} skipped. Choose PNG, JPG, or WEBP files up to 20 MB.`)
    if (valid.length) {
      setFiles((current) => [...current, ...valid])
      setSuccessMessage('')
    }
  }

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error('Enter an artwork name before uploading.')
      return
    }
    if (!files.length || loading) return
    setProgress(0)
    setCompletedCount(0)
    setSuccessMessage('')
    let uploadedCount = 0
    let failedCount = 0
    const failedFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        await dispatch(uploadArtwork({ title: title.trim(), file })).unwrap()
        uploadedCount += 1
      } catch (err) {
        console.error('Upload failed:', err)
        failedCount += 1
        failedFiles.push(file)
      } finally {
        setCompletedCount(i + 1)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }
    }

    if (uploadedCount > 0) {
      setSuccessMessage(`${uploadedCount} artwork${uploadedCount === 1 ? '' : 's'} uploaded successfully.`)
      toast.success(`${uploadedCount} artwork${uploadedCount === 1 ? '' : 's'} uploaded.`)
    }
    if (failedCount > 0) toast.error(`${failedCount} artwork${failedCount === 1 ? '' : 's'} could not be uploaded.`)
    if (uploadedCount === files.length) {
      setFiles([])
      setTitle('')
      if (inputRef.current) inputRef.current.value = ''
    } else {
      setFiles(failedFiles)
    }
  }

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <main className="portfolio-background min-h-full px-4 py-6 text-zinc-100 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <DashboardBackLink />
        <header className="mb-8 mt-5 max-w-2xl">
          <h1 className="page-heading text-3xl font-black tracking-tight sm:text-4xl">Add to your collection</h1>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-3xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-md sm:p-8">
            <label htmlFor="artwork-title" className="mb-2 block text-sm font-medium">Artwork name <span className="text-rose-400">*</span></label>
            <input
              id="artwork-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter an artwork name"
              disabled={loading}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-zinc-500">This name will be used for every selected image.</p>

            <div
              role="button"
              tabIndex={loading ? -1 : 0}
              aria-label="Choose or drop artwork images"
              onClick={() => !loading && inputRef.current?.click()}
              onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !loading) { event.preventDefault(); inputRef.current?.click() } }}
              onDragOver={(event) => { event.preventDefault(); if (!loading) setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => { event.preventDefault(); setIsDragging(false); if (!loading) addFiles(event.dataTransfer.files) }}
              className={`mt-7 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-8 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${isDragging ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/15 bg-white/[0.02] hover:border-cyan-400/60 hover:bg-cyan-400/[0.05]'} ${loading ? 'cursor-wait opacity-60' : ''}`}
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><UploadCloud size={23} /></span>
              <span className="text-sm font-semibold">Drop images here or <span className="text-cyan-300 underline underline-offset-4">browse files</span></span>
              <span className="mt-2 text-xs text-zinc-500">PNG, JPG, or WEBP · up to 20 MB each</span>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden disabled={loading} onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.currentTarget.value = '' }} />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-medium">Ready to upload</h2><span className="text-xs text-zinc-500">{files.length} file{files.length === 1 ? '' : 's'}</span></div>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300"><ImageIcon size={17} /></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{file.name}</span><span className="text-xs text-zinc-500">{formatSize(file.size)}</span></span>
                      <button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} disabled={loading} aria-label={`Remove ${file.name}`} className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-40"><X size={16} /></button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(loading || successMessage) && (
              <div aria-live="polite" className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium">{loading ? 'Uploading your artwork…' : <><CheckCircle2 size={17} className="text-cyan-300" />{successMessage}</>}</span>
                  {loading && <span className="shrink-0 text-xs text-zinc-500">{completedCount} of {files.length} · {progress}%</span>}
                </div>
                {loading && <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-400 transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>}
              </div>
            )}

            <button type="button" onClick={() => void handleUpload()} disabled={!files.length || !title.trim() || loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-44">
              {loading ? 'Uploading…' : `Upload ${files.length || ''} ${files.length === 1 ? 'image' : 'images'}`}
            </button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur-md sm:p-6">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><FileText size={19} /></span>
              <h2 className="font-semibold">A few helpful notes</h2>
              <ul className="mt-4 space-y-4 text-sm leading-5 text-zinc-400">
                <li><span className="font-medium text-zinc-200">Image types</span><br />PNG, JPG, and WEBP are supported.</li>
                <li><span className="font-medium text-zinc-200">File size</span><br />Each image can be up to 20 MB.</li>
                <li><span className="font-medium text-zinc-200">Your work</span><br />Please upload artwork you have the right to share.</li>
              </ul>
            </div>
            <div className="flex gap-3 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4 text-zinc-300 backdrop-blur">
              <AlertCircle size={17} className="mt-0.5 shrink-0 text-cyan-300" />
              <p className="text-xs leading-5">If one image fails, the others can still finish uploading. Failed items stay in your list so you can try again.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
