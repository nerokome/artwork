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
        }}>
          <div className="bg-black/80 backdrop-blur-lg p-12">
           <Navbar />
      <Hero />
      <Features/>
      <Footers/>
          </div>
       
      </div>
      
    </div>
  );
}
