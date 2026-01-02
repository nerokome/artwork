'use client'

import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store/store'
import { uploadArtwork } from '@/app/redux/store/uploadslice'
import { UploadCloud, FileText, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function Page() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.artwork)

  const [title, setTitle] = useState('')
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
            title: title || file.name,
            file,
          })
        ).unwrap()
        
        setProgress(Math.round(((i + 1) / files.length) * 100))
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    setSuccessMessage('Artwork uploaded successfully!') 
    setTitle('')
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div
        className="relative rounded-2xl overflow-hidden min-h-[85vh]"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/90 sm:bg-black/90" />
        <div className="relative z-10 p-6 sm:p-10">
          
        
          <div className="mb-10">
            <h1 className="text-3xl text-zinc-200 font-bold mb-2 uppercase tracking-tighter">
              Media <span className="text-cyan-400">Upload Studio</span>
            </h1>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-cyan-400" />
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                Portfolio Ingestion Active
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
           
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-black/60 backdrop-blur-md rounded-xl p-8 border border-white/5">
                
                <div className="space-y-8">
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-white text-sm font-bold uppercase tracking-widest">
                        01. Set Artwork Title
                      </h2>
                      {!title && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase animate-pulse">
                          <AlertCircle size={12} /> Mandatory field
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title for your art..."
                      className={`w-full p-4 rounded-xl bg-neutral-900/50 border transition-all text-white focus:outline-none 
                        ${title ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'border-neutral-700'}`}
                    />
                  </div>

                  
                  <div
                    className={`border-2 border-dashed rounded-xl p-14 flex flex-col items-center justify-center text-center transition-all
                      ${title ? 'border-neutral-500 hover:border-cyan-400 cursor-pointer bg-white/5' : 'border-neutral-800 opacity-30 cursor-not-allowed'}`}
                    onClick={() => title && inputRef.current?.click()}
                  >
                    <UploadCloud size={48} className={title ? "text-cyan-400 mb-4" : "text-neutral-500 mb-4"} />
                    <p className="text-white font-bold uppercase tracking-tight text-lg">
                      {title ? "Select Art Files" : "Input Name First"}
                    </p>
                    <p className="text-sm text-neutral-400 mt-2">
                      {title ? "Drag & Drop assets or click to browse" : "You must provide a title before uploading"}
                    </p>

                    <input
                      ref={inputRef}
                      type="file"
                      multiple
                      hidden
                      disabled={!title}
                      onChange={(e) => {
                        if (e.target.files) handleUpload(e.target.files)
                      }}
                    />
                  </div>

                  {(loading || successMessage) && (
                    <div className="pt-6 border-t border-white/5">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-2">
                          {successMessage && <CheckCircle2 size={18} className="text-cyan-400" />}
                          <p className="text-sm font-bold uppercase tracking-wide">
                            {loading ? `Uploading ${filesCount} items...` : successMessage}
                          </p>
                        </div>
                        {loading && <span className="text-2xl font-black text-cyan-400">{progress}%</span>}
                      </div>
                      
                      {loading && (
                        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-cyan-400 rounded-xl p-8 text-black h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/10">
                  <FileText size={24} />
                  <h2 className="text-xl font-black uppercase tracking-tighter">Instructions</h2>
                </div>

                <div className="space-y-8 flex-grow">
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Critical Requirement</p>
                    <h4 className="font-bold text-lg leading-none uppercase">01. Input Name First</h4>
                    <p className="text-xs font-bold mt-2 leading-tight uppercase opacity-80">
                      The upload tunnel is locked until a title is provided. This ensures your artwork is correctly indexed.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Compatibility</p>
                    <h4 className="font-bold text-lg leading-none uppercase">02. File Specs</h4>
                    <p className="text-xs font-bold mt-2 leading-tight uppercase opacity-80">
                      Supports PNG, JPG, and WEBP. Maximum file size allowed is 20MB per asset.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Portfolio Rights</p>
                    <h4 className="font-bold text-lg leading-none uppercase">03. Verification</h4>
                    <p className="text-xs font-bold mt-2 leading-tight uppercase opacity-80">
                      By uploading, you certify that you own all legal rights to the creative content.
                    </p>
                  </div>
                </div>

                <div className="mt-10 p-4 bg-black/10 rounded-lg">
                  <p className="text-[10px] font-black uppercase text-center leading-none">
                    Files are optimized for global delivery upon completion.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}