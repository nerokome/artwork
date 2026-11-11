'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const updateNetworkStatus = () => setIsOffline(!navigator.onLine)

    updateNetworkStatus()
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="network-status" role="alert" aria-live="assertive">
      <WifiOff aria-hidden="true" size={18} />
      <span className="font-semibold">You&apos;re offline.</span>
      <span>Check your internet connection.</span>
    </div>
  )
}
