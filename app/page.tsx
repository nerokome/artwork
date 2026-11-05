import Features from "./components/Features";
import Footers from "./components/Footers";
import Hero from "./components/Hero";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="portfolio-background min-h-screen text-white">
      <div className="relative z-10 px-4 sm:px-12 py-8 min-h-screen flex flex-col">
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
  );
}
