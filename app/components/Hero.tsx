"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { IoAnalytics } from "react-icons/io5";
import { RiSlideshow3Fill } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";

const Hero = () => {
  return (
    <section className="relative mx-auto mt-10 sm:mt-20 max-w-7xl px-4 sm:px-6">
      {/* Decorative background glow */}
      <div className="absolute -top-24 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div
        className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 hover:border-cyan-500/30"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-cyan-900/20" />

        <div className="relative z-10 px-8 py-16 sm:p-24">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium tracking-wide text-cyan-400">
            <Sparkles size={14} />
            <span>Join 5,000+ Digital Artists</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-7xl">
            Showcase Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Genius.</span>
            <br />
            Track Your Legacy.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            The premium portfolio & real-time analytics engine built specifically for the next generation of 
            <span className="text-white"> digital creators</span>.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
            <Link href="/auth/signup" className="group/btn relative w-full sm:w-auto">
              <button className="relative w-full overflow-hidden rounded-full bg-cyan-400 px-8 py-4 font-bold text-black transition-all hover:scale-105 hover:bg-cyan-300 active:scale-95">
                <span className="flex items-center justify-center gap-2">
                  Start Your Journey <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
                </span>
              </button>
            </Link>

            <button className="w-full rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10 sm:w-auto">
             Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: <IoAnalytics size={28} />, title: "Live Analytics", desc: "Real-time engagement heatmaps and traffic sources." },
              { icon: <RiSlideshow3Fill size={28} />, title: "Luxury Gallery", desc: "Ultra-fast, high-resolution immersive work displays." },
              { icon: <TbWorld size={28} />, title: "Global Reach", desc: "Connect with agencies and collectors worldwide." }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group/card rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:-translate-y-2 hover:bg-white/[0.07] hover:border-cyan-500/20"
              >
                <div className="mb-4 inline-block rounded-xl bg-cyan-400/10 p-3 text-cyan-400 group-hover/card:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;