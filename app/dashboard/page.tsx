'use client';

import { Star, Heart, Eye, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';

const Dashboard = () => {
  type Artwork = {
    id: number;
    title: string;
    imageUrl: string;
    views: number;
    likes: number;
    favorites: number;
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const artworks: Artwork[] = [
    { id: 1, title: 'Vibrant Sunset Over Mountains', imageUrl: '/art.jpg', views: 245, likes: 42, favorites: 42 },
    { id: 2, title: 'Serene Ocean Cliff at Dusk', imageUrl: '/fotos.jpg', views: 189, likes: 31, favorites: 31 },
    { id: 3, title: 'Neon City Nights', imageUrl: '/art.jpg', views: 312, likes: 64, favorites: 51 },
    { id: 4, title: 'Quiet Horizon', imageUrl: '/fotos.jpg', views: 144, likes: 21, favorites: 18 },
     { id: 1, title: 'Vibrant Sunset Over Mountains', imageUrl: '/art.jpg', views: 245, likes: 42, favorites: 42 },
    { id: 2, title: 'Serene Ocean Cliff at Dusk', imageUrl: '/fotos.jpg', views: 189, likes: 31, favorites: 31 },
    { id: 3, title: 'Neon City Nights', imageUrl: '/art.jpg', views: 312, likes: 64, favorites: 51 },
    { id: 4, title: 'Quiet Horizon', imageUrl: '/fotos.jpg', views: 144, likes: 21, favorites: 18 },
     { id: 1, title: 'Vibrant Sunset Over Mountains', imageUrl: '/art.jpg', views: 245, likes: 42, favorites: 42 },
    { id: 2, title: 'Serene Ocean Cliff at Dusk', imageUrl: '/fotos.jpg', views: 189, likes: 31, favorites: 31 },
    { id: 3, title: 'Neon City Nights', imageUrl: '/art.jpg', views: 312, likes: 64, favorites: 51 },
    { id: 4, title: 'Quiet Horizon', imageUrl: '/fotos.jpg', views: 144, likes: 21, favorites: 18 },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        <div className="absolute inset-0 bg-black/90 sm:bg-black/90" />

      
        <div className="relative z-10">
        
          <div className="flex flex-col items-center text-center py-12 px-4">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              My Collection
            </h1>
            <p className="text-neutral-300 text-lg max-w-xl">
              Manage and showcase your collection of digital artworks with style.
            </p>
          </div>

          
          <div className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="group bg-black/60 backdrop-blur-md rounded-xl overflow-hidden
                border border-white/5 shadow-lg hover:shadow-2xl
                transition transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedImage(art.imageUrl)}
              >
                <div className="relative">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-white text-base font-semibold truncate">
                    {art.title}
                  </h3>
                  <div className="flex items-center gap-4 text-neutral-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-cyan-400" /> {art.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={16} className="text-cyan-400" /> {art.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-cyan-400" /> {art.favorites}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="flex items-center gap-2 px-3 py-2 bg-black/70 backdrop-blur-md
              text-white rounded-lg border border-white/10 hover:bg-black/90 transition"
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <Image
            src={selectedImage}
            alt="Full artwork"
            width={1200}
            height={800}
            className="max-h-[85%] max-w-[90%] rounded-lg shadow-2xl border border-white/10"
          />

          <div className="mt-4 text-neutral-300 text-sm">
            Click <span className="font-semibold">Back</span> to return to gallery
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
