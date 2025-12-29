'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreed: false
  });

  return (
    <div className="min-h-screen bg-gray-950 relative px-4">
     <Link href="/">
      <div className="fixed top-0 left-0 z-50">
        <Image
          src="/rarrr.png"
          alt="Artfolio Logo"
          width={150}
          height={150}
          priority
        />
      </div>
      </Link>

      {/* CENTER CONTENT */}
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="relative z-30 rounded-xl overflow-hidden w-full max-w-2xl"
          style={{
            backgroundImage: "url('/fotos.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* 🔥 ANIMATED BORDER WRAPPER */}
          <div className="animated-border p-[1px] rounded-xl">
            {/* CONTENT ABOVE BORDER */}
            <div className="relative z-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

              <div className="mb-8">
                <h1 className="text-3xl font-light text-white mb-6">
                  Join Artfolio
                </h1>
                <h2 className="text-xl font-semibold text-white">
                  Sign Up
                </h2>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 transition-colors"
                />

                <div className="flex items-start gap-3 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 leading-tight">
                    I agree to the{" "}
                    <span className="underline cursor-pointer">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </label>
                </div>

                <p className="text-sm text-gray-400">
                  Have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-cyan-400 underline"
                  >
                    Login
                  </Link>
                </p>
<Link href="/dashboard">
  <button
    type="button"
    className="mt-6 w-1/2 mx-auto py-3 rounded-2xl border-2 border-cyan-400/60 text-white font-medium
               hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]
               transition-all duration-300"
  >
    Sign Up
  </button>
</Link>
  
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
