'use client'

import React, { useEffect } from 'react'
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
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store/store'
import {
  fetchViewsOverTime,
  fetchEngagementSplit,
  fetchMostViewedArtworks,
} from '@/app/redux/store/analysisslice'
import Image from 'next/image'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  ArcElement
)

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { viewsOverTime, engagementSplit, mostViewed } = useSelector(
    (state: RootState) => state.analytics
  )

  useEffect(() => {
    dispatch(fetchViewsOverTime())
    dispatch(fetchEngagementSplit())
    dispatch(fetchMostViewedArtworks())
  }, [dispatch])

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const viewsByDay = weekDays.map((day) => {
    const match = viewsOverTime.data.find((v) => {
      const date = new Date(v._id)
      return date.toLocaleDateString('en-US', { weekday: 'long' }) === day
    })
    return match ? match.views : 0
  })

  const lineData = {
    labels: weekDays,
    datasets: [
      {
        label: 'Profile Views',
        data: viewsByDay,
        fill: true,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.12)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#22d3ee',
      },
    ],
  }

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        ticks: { stepSize: 20, color: 'rgba(255,255,255,0.5)' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.5)' },
        grid: { display: false }
      }
    },
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-4">
              Analytics <span className="text-cyan-400">Dashboard</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-sm font-medium uppercase tracking-widest">
              Performance telemetry and audience engagement metrics.
            </p>
          </div>

          {(viewsOverTime.loading || engagementSplit.loading || mostViewed.loading) && (
            <p className="text-center text-zinc-400 animate-pulse">Synchronizing Data...</p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 text-center sm:text-left">
                  01. Traffic Volume (7-Day Cycle)
                </h2>
                <div className="h-[500px] w-full">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-10 text-center sm:text-left">
                  02. Engagement Split (Top 3)
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-12 sm:gap-16">
                  {(() => {
                    const top3 = engagementSplit.data.slice(0, 3)
                    const total = top3.reduce((acc, item) => acc + item.views, 0) || 1
                    return top3.map((item) => {
                      const percent = Math.round((item.views / total) * 100)
                      return <DonutStat key={item._id} label={item.title} value={percent} />
                    })
                  })()}
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-4 bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl h-fit">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                03. Top Performing Pieces
              </h2>
              <div className="space-y-6">
                {mostViewed.data.slice(0, 3).map((art, idx) => (
                  <div
                    key={art.id}
                    className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 hover:bg-cyan-400 group transition-all duration-500 cursor-pointer"
                  >
                    <div className="w-20 h-16 relative rounded-xl overflow-hidden bg-zinc-800 border border-white/5">
                      
                      {art.url ? (
                        <Image
                          src={art.url}
                          alt={art.title || 'Artwork'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-black/60 mb-1">
                        Rank {idx + 1}
                      </p>
                      <p className="text-sm font-bold truncate group-hover:text-black">
                        {art.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}

function DonutStat({ label, value }: { label: string; value: number }) {
  const normalizedValue = Math.min(value, 100)
  return (
    <div className="text-center group">
      <div className="relative w-32 h-32 mx-auto transition-transform duration-500 group-hover:scale-110">
        <Doughnut
          data={{
            datasets: [
              {
                data: [normalizedValue, 100 - normalizedValue],
                backgroundColor: ['#22d3ee', 'rgba(255,255,255,0.05)'],
                borderWidth: 0,
              },
            ],
          }}
          options={{ 
            cutout: '80%', 
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            events: [] 
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-black tracking-tighter">
          {normalizedValue}%
        </span>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate w-32 mx-auto">
        {label}
      </p>
    </div>
  )
}