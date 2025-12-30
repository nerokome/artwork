import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IoAnalytics } from "react-icons/io5";
import { RiSlideshow3Fill } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";

const Hero = () => {
  return (
    <section className="relative mx-auto mt-6 sm:mt-10 max-w-6xl rounded-2xl p-[1px] animated-border">
      <div
        className="relative z-30 overflow-hidden rounded-2xl"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="relative z-10 px-6 py-10 sm:p-16 text-center sm:text-left">
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white animate-fadeIn">
            Artfolio: Showcase Your Genius
            <br />
            <span className="text-cyan-400">Track Your Legacy</span>
          </h2>

          <p className="mt-4 mx-auto sm:mx-0 max-w-md sm:max-w-xl text-sm sm:text-base text-gray-300 animate-slideUp">
            The ultimate portfolio & analytics platform for artists, designers,
            and photographers.
          </p>

          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Link href="/auth/signup">
      <button className="w-full sm:w-auto rounded-md bg-cyan-400 px-6 py-3 text-black font-semibold hover:bg-cyan-300 transition flex items-center justify-center gap-2">
        Sign Up Free <ArrowRight size={18} />
      </button>
    </Link>

            <button className="w-full sm:w-auto rounded-md border border-cyan-400 px-6 py-3 text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
              Learn More
            </button>
          </div>

          
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-gray-200">
            <div className="p-4 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/60 transition">
            <div className="flex flex-row items-center gap-2">
               <IoAnalytics size={30} color="#67E8F9" /> <h3 className="text-base font-semibold text-cyan-400"> Analytics</h3> 
            </div>
              
              <p className="text-sm mt-1">
                Track views, likes, and engagement across your portfolio.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/60 transition">
            <div className="flex flex-row items-center gap-2"><RiSlideshow3Fill size={30} color="#67E8F9" /> <h3 className="text-base font-semibold text-cyan-400"> Showcase</h3> </div>
              
              <p className="text-sm mt-1">
                Display your best work in a stunning, customizable gallery.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/60 transition">
            <div className="flex flex-row items-center gap-2"><TbWorld size={30} color="#67E8F9" /> <h3 className="text-base font-semibold text-cyan-400"> Community</h3> </div>
              <p className="text-sm mt-1">
                Connect with fellow creators and grow your audience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
