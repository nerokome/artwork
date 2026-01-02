"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a scroll listener to change background opacity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/60 border-b border-white/10 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center transition-transform active:scale-95">
          <Image
            src="/rarrr.png"
            alt="Artfolio Logo"
            width={120}
            height={80}
            priority
            className="h-16 w-auto sm:h-30 brightness-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link 
            href="/auth/login" 
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Login
          </Link>

          <Link href="/auth/signup">
            <button className="relative inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-400 hover:shadow-cyan-500/50 active:scale-95">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-cyan-400 p-2 hover:bg-white/5 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (Animated Slide-Down) */}
      <div 
        className={`sm:hidden absolute w-full bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-8 py-8">
          <Link
            href="/auth/login"
            onClick={() => setOpen(false)}
            className="text-center text-lg text-slate-300 hover:text-cyan-400"
          >
            Login
          </Link>

          <Link
            href="/auth/signup"
            onClick={() => setOpen(false)}
            className="rounded-full bg-cyan-500 py-3 text-center font-bold text-black shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}