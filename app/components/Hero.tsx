"use client";

import React from "react";
import { ArrowRight, BarChart3, Layout, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative mx-auto mt-6 sm:mt-10 max-w-6xl rounded-2xl p-[1px] animated-border overflow-hidden shadow-2xl">
      <div
        className="relative z-30 overflow-hidden rounded-2xl"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
     
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black via-black/80 to-transparent sm:to-black/20" />
        
        <div className="relative z-10 px-6 py-12 sm:p-20 text-center sm:text-left">
          
          

          <h2 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tighter text-white animate-fadeIn uppercase italic">
            Artfolio: <br className="hidden sm:block" />
            Showcase <span className="bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">Genius.</span>
          </h2>
          
          <h3 className="mt-2 text-xl sm:text-2xl font-bold text-zinc-400 tracking-tight italic">
            Track Your Legacy
          </h3>

          <p className="mt-6 mx-auto sm:mx-0 max-w-md sm:max-w-xl text-sm sm:text-base text-zinc-400 font-medium leading-relaxed animate-slideUp">
            The premium portfolio & real-time telemetry engine built specifically 
            for the next generation of digital creators and visual architects.
          </p>

          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <button className="group w-full sm:w-auto rounded-xl bg-cyan-400 px-8 py-4 text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-300 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20">
              Launch Portfolio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95">
              Learn More
            </button>
          </div>

          
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-zinc-200">
            <FeatureCard 
                icon={<BarChart3 size={18} />} 
                title="Live Analytics" 
                desc="Deep engagement heatmaps and traffic source intelligence." 
            />
            <FeatureCard 
                icon={<Layout size={18} />} 
                title="Showcase" 
                desc="Immersive galleries designed for high-resolution impact." 
            />
            <FeatureCard 
                icon={<Users size={18} />} 
                title="Network" 
                desc="Direct connection to global collectors and agencies." 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border-t border-white/10 hover:border-cyan-500/30 transition-all group">
            <div className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform origin-left">
                {icon}
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                {title}
            </h3>
            <p className="text-[11px] leading-relaxed mt-2 text-zinc-500 font-medium">
                {desc}
            </p>
        </div>
    )
}

export default Hero;