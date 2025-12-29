'use client';

import React, { useState } from 'react';
import { Copy, Check, Globe, Share2 } from 'lucide-react';

const Page = () => {
  const [copied, setCopied] = useState(false);
  const portfolioUrl = 'portfolio.creator.com/jane-doe';

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6">
      {/* Background section */}
      <div
        className="relative min-h-screen rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-black/90 sm:bg-black/90" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-3xl px-2 sm:px-0">
          <div className="bg-black/65 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Header */}
            <header className="mb-8 sm:mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Public Profile
              </h1>
              <p className="text-zinc-400 mt-2 text-sm">
                Manage your presence and share your work.
              </p>
            </header>

            <div className="space-y-6 sm:space-y-8">
              {/* Portfolio link */}
              <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4 text-cyan-400">
                  <Globe size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Your Live Portfolio
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 text-sm font-mono truncate">
                    {portfolioUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 mt-3 ml-1">
                  Anyone with this link can view your published creative pieces.
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Display Name" defaultValue="Creative Mind" />
                <Input label="Location" placeholder="New York, NY" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell the world about your creative process..."
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition resize-none"
                />
              </div>

              {/* Privacy */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-bold text-white mb-4">
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <select className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 transition">
                    <option>Portfolio visibility: Public</option>
                    <option>Portfolio visibility: Private</option>
                  </select>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-zinc-300">
                      Allow search engines to index your profile
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition">
                  <Share2 size={16} />
                  Share Stats
                </button>

                <div className="flex w-full sm:w-auto gap-4">
                  <button className="flex-1 sm:flex-none text-zinc-400 hover:text-white text-sm font-semibold transition">
                    Cancel
                  </button>
                  <button className="flex-1 sm:flex-none bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-2xl font-bold shadow-lg shadow-cyan-500/10 transition active:scale-95">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

function Input({
  label,
  defaultValue,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-400 transition"
      />
    </div>
  );
}
