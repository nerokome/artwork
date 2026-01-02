import Features from "./components/Features";
import Footers from "./components/Footers";
import Hero from "./components/Hero";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen text-white bg-gray-950">
      <div 
        className="relative z-30 rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Main Wrapper */}
        <div className="bg-black/80 backdrop-blur-lg px-4 sm:px-12 py-8 min-h-screen flex flex-col">
          
          {/* Top Section - Navbar isolated with margin */}
          <header className="mb-16 sm:mb-24">
            <Navbar />
          </header>
          
          {/* Content Section - Pushed down and spaced out */}
          <main className="flex-1 flex flex-col gap-32 sm:gap-48">
            <Hero />
            <Features />
          </main>
          
          {/* Footer Section */}
          <div className="mt-20 sm:mt-32">
            <Footers />
          </div>
          
        </div>
      </div>
    </div>
  );
}