import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/AppContext'

export const useSync = () => {
  const { state, markAsSynced } = useAppStore()
  const [isSyncing, setIsSyncing] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isOnline) return

    const pendingEvents = state.events.filter((e) => !e.synced)
    if (pendingEvents.length === 0) return

    const interval = setInterval(() => {
      setIsSyncing(true)
      // Simulate network request
      setTimeout(() => {
        const idsToSync = pendingEvents.map((e) => e.id)
        markAsSynced(idsToSync)
        setIsSyncing(false)
      }, 1500)
    }, 10000) // Check every 10s

    return () => clearInterval(interval)
  }, [state.events, isOnline, markAsSynced])

  const pendingCount = state.events.filter((e) => !e.synced).length

  return { isSyncing, isOnline, pendingCount }
}
