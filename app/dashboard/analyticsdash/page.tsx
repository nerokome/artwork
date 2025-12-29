'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  ArcElement
);

export default function Page() {
  const viewsOverTime = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Profile Views',
        data: [12, 18, 25, 40, 32, 55, 48],
        fill: true,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.12)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white ">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        <div className="absolute inset-0 bg-black/90 sm:bg-black/90" />

      
        <div className="relative z-10 p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-zinc-300 max-w-xl">
              Track your artwork performance and audience engagement over time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-medium mb-6">
                  Views Over Time
                </h2>
                <div className="h-64">
                  <Line data={viewsOverTime} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                <h2 className="text-xl font-medium mb-6">
                  Engagement Split
                </h2>
                <div className="flex flex-wrap gap-10">
                  <DonutStat label="Artwork A" value={45} />
                  <DonutStat label="Artwork B" value={30} />
                  <DonutStat label="Artwork C" value={25} />
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-4 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
              <h2 className="text-xl font-medium mb-6">
                Most Viewed Pieces
              </h2>
              <div className="space-y-4">
                {['Neon Portrait', 'Night Cityscape', 'Urban Loneliness'].map((title) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <div className="w-16 h-12 bg-zinc-700 rounded-lg" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-xs text-zinc-400">Digital Art</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonutStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto">
        <Doughnut
          data={{
            datasets: [
              {
                data: [value, 100 - value],
                backgroundColor: ['#22d3ee', '#2d2d2d'],
                borderWidth: 0,
              },
            ],
          }}
          options={{ cutout: '75%', plugins: { legend: { display: false } } }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {value}%
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{label}</p>
    </div>
  );
}
