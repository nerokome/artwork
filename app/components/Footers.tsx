"use client";

import React from "react";
import {FaLinkedin, FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const Footers = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/5 bg-black px-6 sm:px-10 py-12 text-sm text-zinc-500">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
         
          <div className="space-y-4 max-w-xs">
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl uppercase tracking-tighter italic">
                Artfolio<span className="text-cyan-400">.</span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mt-1">
                Legacy Intelligence
              </p>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              The premier infrastructure for digital architects to showcase work and track real-time engagement telemetry.
            </p>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-20">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Platform</h4>
              <ul className="space-y-2 text-xs font-bold">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Showcase</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Network</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Company</h4>
              <ul className="space-y-2 text-xs font-bold">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
            
         
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Connect</h4>
              <div className="flex gap-4">
                <SocialLink href="https://x.com/nerokome?s=21&t=9eD6yL3-XMpKGdHtbYi4TA" icon={<BsTwitterX  size={16} />} />
                <SocialLink href="https://www.linkedin.com/in/oghenero-oghenekome-997360259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" icon={<FaLinkedin size={16} />} />
                <SocialLink href="https://github.com/nerokome" icon={<FaGithub size={16} />} />
              </div>
            </div>
          </div>
        </div>

        
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              © {currentYear} Artfolio Console
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all active:scale-90"
    >
      {icon}
    </a>
  );
}

export default Footers;