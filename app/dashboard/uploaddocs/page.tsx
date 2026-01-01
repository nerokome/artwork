'use client'

import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store/store'
import { uploadArtwork } from '@/app/redux/store/uploadslice'
import { UploadCloud, Lock, ImageIcon } from 'lucide-react'

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.artwork)

  const [title, setTitle] = useState('') // <-- new state for title
  const [progress, setProgress] = useState(0)
  const [filesCount, setFilesCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    setFilesCount(files.length)
    setProgress(0)
    setSuccessMessage('') 

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        await dispatch(
          uploadArtwork({
            title: title || file.name, // use user input or fallback to file name
            file,
          })
        ).unwrap()
        
        setProgress(Math.round(((i + 1) / files.length) * 100))
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    setSuccessMessage('Artwork uploaded successfully!') 
    setTitle('') // reset title after upload
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/90 sm:bg-black/90" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl text-zinc-200 font-bold mb-4">
              Upload Your Artwork
            </h1>
            <p className="text-zinc-300 max-w-xl">
              Easily upload and manage your digital art files.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/5">
              <h2 className="text-white text-lg font-semibold mb-4">
                Upload Your Creations
              </h2>

              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter artwork title"
                className="w-full mb-4 p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-cyan-400"
              />

              <div
                className="border-2 border-dashed border-neutral-700 rounded-xl p-10
                           flex flex-col items-center justify-center text-center
                           hover:border-cyan-400 transition cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud size={48} className="text-neutral-400 mb-4" />
                <p className="text-white font-medium">Drag & Drop your files</p>
                <p className="text-sm text-neutral-400 mt-1">
                  PNG, JPG, WEBP up to 20MB
                </p>

                <button
                  type="button"
                  className="mt-6 px-6 py-2 rounded-lg
                             bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition"
                >
                  Browse Files
                </button>

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) handleUpload(e.target.files)
                  }}
                />
              </div>

              {successMessage && (
                <p className="mt-4 text-cyan-400 font-medium">{successMessage}</p>
              )}
            </div>

            <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/5 flex flex-col justify-between">
              <div>
                <h2 className="text-white text-lg font-semibold mb-6">
                  Processing Options
                </h2>

                <Option icon={<Lock size={18} />} title="Automatically apply watermark" />
                <Option icon={<ImageIcon size={18} />} title="Generate preview thumbnails" />
              </div>

              {loading && (
                <div className="mt-6">
                  <p className="text-sm text-neutral-400 mb-2">
                    Uploading {filesCount} file{filesCount > 1 ? 's' : ''} — {progress}%
                  </p>

                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-2 bg-cyan-400 transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Option({ icon, title }: { icon: React.ReactNode; title: string }) {
  const [enabled, setEnabled] = useState(false)

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg mb-3
                 hover:bg-white/5 transition cursor-pointer"
      onClick={() => setEnabled(!enabled)}
    >
      <div className="flex items-center gap-3 text-neutral-300">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <div
        className={`w-10 h-5 rounded-full relative transition-colors
                   ${enabled ? 'bg-cyan-400' : 'bg-neutral-700'}`}
      >
        <div
          className={`absolute w-3 h-3 bg-black rounded-full transition-all
                     ${enabled ? 'right-1' : 'left-1'} top-1`}
        />
      </div>
    </div>
  )
}
