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

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const fullWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const viewsByDay = fullWeekDays.map((day) => {
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
        pointRadius: (context: { chart: { width: number } }) => context.chart.width < 420 ? 3 : 5,
        pointHoverRadius: 7,
        borderWidth: 2,
        pointBackgroundColor: '#22d3ee',
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
    layout: { padding: { top: 4, right: 4, bottom: 0, left: 0 } },
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        ticks: { stepSize: 20, maxTicksLimit: 5, padding: 6, color: 'rgba(255,255,255,0.5)', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.5)', maxRotation: 0, autoSkip: false, padding: 6, font: (context: { chart: { width: number } }) => ({ size: context.chart.width < 360 ? 8 : context.chart.width < 520 ? 9 : 11 }) },
        grid: { display: false }
      }
    },
  }

  return (
    <div className="min-h-full bg-black text-white">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/fotos.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/90 sm:bg-black/90" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-3 text-3xl font-black tracking-tighter uppercase italic sm:mb-4 sm:text-4xl">
              Analytics <span className="text-cyan-400">Dashboard</span>
            </h1>
            <p className="max-w-xl text-xs font-medium uppercase tracking-[0.16em] text-zinc-400 sm:text-sm sm:tracking-widest">
              Performance telemetry and audience engagement metrics.
            </p>
          </div>

          {(viewsOverTime.loading || engagementSplit.loading || mostViewed.loading) && (
            <p className="text-center text-zinc-400 animate-pulse">Synchronizing Data...</p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           
            <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-8">
              <div className="rounded-2xl border border-white/5 bg-black/60 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 lg:p-8">
                <h2 className="mb-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 sm:mb-8 sm:text-left sm:text-xs sm:tracking-[0.3em]">
                   Traffic Volume (7-Day Cycle)
                </h2>
                <div className="relative h-[220px] w-full min-w-0 sm:h-[320px] lg:h-[400px]">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/60 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 lg:p-8">
                <h2 className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 sm:mb-8 sm:text-left sm:text-xs sm:tracking-[0.3em]">
                   Engagement Split 
                </h2>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 sm:justify-start sm:gap-x-10 lg:gap-x-16">
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

            
            <div className="h-fit rounded-2xl border border-white/5 bg-black/60 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-6 lg:col-span-4 lg:p-8">
              <h2 className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 sm:mb-8 sm:text-left sm:text-xs sm:tracking-[0.3em]">
                03. Top Performing Pieces
              </h2>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {mostViewed.data.slice(0, 3).map((art, idx) => (
                  <div
                    key={art.id}
                    className="flex min-w-0 items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors duration-300 group hover:bg-cyan-400 sm:gap-5 sm:rounded-2xl sm:p-4"
                  >
                    <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-white/5 bg-zinc-800 sm:h-16 sm:w-20 sm:rounded-xl">
                      
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
      <div className="relative mx-auto h-24 w-24 transition-transform duration-500 group-hover:scale-105 sm:h-32 sm:w-32">
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
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', 
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            events: [] 
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-black tracking-tighter">
          {normalizedValue}%
        </span>
      </div>
      <p className="mx-auto mt-3 w-24 truncate text-[9px] font-black uppercase tracking-widest text-zinc-500 sm:mt-4 sm:w-32 sm:text-[10px]">
        {label}
      </p>
    </div>
  )
}
