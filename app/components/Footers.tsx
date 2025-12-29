import React from "react";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footers = () => {
  return (
    <footer className="mt-24 border-t border-white/10 px-6 sm:px-10 py-10 text-sm text-gray-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        
        <div className="text-center sm:text-left">
          <span className="block text-white font-semibold text-lg">Artfolio</span>
          <p className="text-xs text-gray-500">Showcase your genius. Track your legacy.</p>
          <span className="block mt-2 text-xs">© 2025 Artfolio. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition">About</a>
          <a href="#" className="hover:text-cyan-400 transition">Contact</a>
          <a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition">Terms</a>
        </div>

        
        <div className="flex gap-4 justify-center">
          <a href="#" className="hover:text-cyan-400 transition">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="hover:text-cyan-400 transition">
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footers;