"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className=" w-full backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-10 sm:py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/rarrr.png"
            alt="Artfolio Logo"
            width={120}
            height={120}
            priority
            className="h-10 w-auto sm:h-20"
          />
        </Link>

        <div className="hidden sm:flex items-center gap-4 text-sm">
          <Link href="/auth/login">
            <button className="rounded-md border border-cyan-400 px-4 py-2 text-cyan-400 transition hover:bg-cyan-400 hover:text-black">
              Login
            </button>
          </Link>

          <Link href="/auth/signup">
            <button className="rounded-md bg-cyan-400 px-4 py-2 font-semibold text-black transition hover:bg-cyan-300">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-cyan-400"
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden border-t border-white/10 bg-black/90 backdrop-blur-md">
          <div className="flex flex-col gap-4 px-6 py-6">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-md border border-cyan-400 py-3 text-center text-cyan-400 transition hover:bg-cyan-400 hover:text-black"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              onClick={() => setOpen(false)}
              className="rounded-md bg-cyan-400 py-3 text-center font-semibold text-black transition hover:bg-cyan-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
