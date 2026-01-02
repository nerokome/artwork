"use client";

import React from "react";
import { FaCamera, FaPalette, FaShieldAlt } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { IconType } from "react-icons"; 

interface FeatureItem {
  title: string;
  description: string;
  icon: IconType; 
  gridClass: string;
}

const Features = () => {
  const features: FeatureItem[] = [
    {
      title: "Intelligence & Insights",
      description: "Proprietary telemetry tracking views, engagement heatmaps, and audience growth with surgical precision.",
      icon: FaChartSimple,
      gridClass: "md:col-span-2",
    },
    {
      title: "Cloud Archive",
      description: "High-fidelity storage for your masterworks. Structured, secure, and ready for global delivery.",
      icon: FaCamera,
      gridClass: "md:col-span-1",
    },
    {
      title: "Social Distribution",
      description: "One-click deployment to global creative networks and talent acquisition agencies.",
      icon: IoShareSocialSharp,
      gridClass: "md:col-span-1",
    },
    {
      title: "Visual Branding",
      description: "Aggressive customization. Tailor your interface to reflect your unique creative DNA.",
      icon: FaPalette,
      gridClass: "md:col-span-1",
    },
    {
      title: "Encryption Standard",
      description: "Military-grade privacy controls. Your intellectual property stays protected and under your control.",
      icon: FaShieldAlt,
      gridClass: "md:col-span-1",
    },
  ];

  return (
    <section className="mx-auto mt-24 mb-20 max-w-6xl px-4 sm:px-6">
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-2">
           <div className="h-[2px] w-8 bg-cyan-400"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Core Capabilities</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white uppercase italic tracking-tighter">
          Engineered for <span className="text-zinc-500">Impact.</span>
        </h2>
        <p className="mt-4 text-zinc-500 max-w-xl text-sm font-medium leading-relaxed">
          The Artfolio suite provides the technical infrastructure required to scale your creative presence globally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-8 transition-all duration-500 hover:border-cyan-400/30 ${f.gridClass}`}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
            
            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-cyan-400 transition-all duration-500 group-hover:bg-cyan-400 group-hover:text-black shadow-inner shadow-white/5">
             
                <f.icon size={24} />
              </div>
              
              <h3 className="text-lg font-black uppercase tracking-tighter text-white italic transition-colors group-hover:text-cyan-400">
                {f.title}
              </h3>
              
              <p className="mt-3 text-sm leading-relaxed text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
                {f.description}
              </p>
            </div>

            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-700 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;