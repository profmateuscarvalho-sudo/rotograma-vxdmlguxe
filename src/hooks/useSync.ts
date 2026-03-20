import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import pb from '@/lib/pocketbase/client'

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

    const interval = setInterval(async () => {
      setIsSyncing(true)
      const syncedIds: string[] = []

      for (const event of pendingEvents) {
        try {
          if (pb.authStore.isValid) {
            const formData = new FormData()

            const routeRecord = await pb
              .collection('routes')
              .getFirstListItem(`id="${event.routeId}"`)
              .catch(() => null)

            const riskTypeRecord = await pb
              .collection('risk_types')
              .getFirstListItem(`id="${event.riskTypeId}"`)
              .catch(() => null)

            if (routeRecord && riskTypeRecord) {
              formData.append('route_id', routeRecord.id)
              formData.append('risk_type_id', riskTypeRecord.id)
              formData.append('description', event.note || '')

              const risk = state.catalog.find((r) => r.id === event.riskTypeId)
              formData.append('weight', (risk?.baseWeight || 1).toString())

              if (event.audioUrl && event.audioUrl.startsWith('blob:')) {
                const response = await fetch(event.audioUrl)
                const blob = await response.blob()
                formData.append('audio', blob, 'audio.webm')
              }
              if (event.photoUrl && event.photoUrl.startsWith('data:image')) {
                const response = await fetch(event.photoUrl)
                const blob = await response.blob()
                formData.append('photos', blob, 'photo.jpg')
              }

              await pb.collection('risks').create(formData)
            }
          }
          syncedIds.push(event.id)
        } catch (err) {
          console.error('Failed to sync event to backend', err)
          syncedIds.push(event.id)
        }
      }

      if (syncedIds.length > 0) {
        markAsSynced(syncedIds)
      }
      setIsSyncing(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [state.events, state.catalog, isOnline, markAsSynced])

  const pendingCount = state.events.filter((e) => !e.synced).length

  return { isSyncing, isOnline, pendingCount }
}
