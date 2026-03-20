import React, { createContext, useContext, useEffect, useState } from 'react'
import { AppState, RiskEvent, RiskType, Route, Segment, Observation } from '@/types'
import { DEFAULT_CATALOG } from '@/lib/constants'
import pb from '@/lib/pocketbase/client'

interface AppContextType {
  state: AppState
  addRoute: (route: Route, segments: Segment[]) => void
  removeRoute: (id: string) => void
  addEvent: (event: RiskEvent) => void
  updateEvent: (id: string, updates: Partial<RiskEvent>) => void
  removeEvent: (id: string) => void
  updateSegment: (id: string, updates: Partial<Segment>) => void
  completeRoute: (id: string) => void
  updateCatalog: (catalog: RiskType[]) => void
  addCatalogRisk: (risk: RiskType) => void
  updateCatalogRisk: (id: string, updates: Partial<RiskType>) => void
  removeCatalogRisk: (id: string) => void
  addObservation: (observation: Observation) => void
  markAsSynced: (eventIds: string[]) => void
  clearData: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialState: AppState = {
  routes: [],
  segments: [],
  events: [],
  catalog: DEFAULT_CATALOG,
  observations: [],
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('rotograma_state')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure catalog meets the new minimum structure requirements (at least 24 items)
        if (!parsed.catalog || parsed.catalog.length < 24) {
          parsed.catalog = DEFAULT_CATALOG
        }
        return { ...initialState, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load state', e)
    }
    return initialState
  })

  useEffect(() => {
    localStorage.setItem('rotograma_state', JSON.stringify(state))
  }, [state])

  const addRoute = (route: Route, segments: Segment[]) => {
    setState((prev) => ({
      ...prev,
      routes: [route, ...prev.routes],
      segments: [...prev.segments, ...segments],
    }))
  }

  const removeRoute = (id: string) => {
    setState((prev) => ({
      ...prev,
      routes: prev.routes.filter((r) => r.id !== id),
      segments: prev.segments.filter((s) => s.routeId !== id),
      events: prev.events.filter((e) => e.routeId !== id),
      observations: prev.observations?.filter((o) => o.routeId !== id) || [],
    }))
  }

  const addEvent = (event: RiskEvent) => {
    setState((prev) => ({ ...prev, events: [...prev.events, event] }))
  }

  const updateEvent = (id: string, updates: Partial<RiskEvent>) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...updates, synced: false } : e)),
    }))
  }

  const removeEvent = (id: string) => {
    setState((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }))
  }

  const updateSegment = (id: string, updates: Partial<Segment>) => {
    setState((prev) => ({
      ...prev,
      segments: prev.segments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
  }

  const completeRoute = (id: string) => {
    setState((prev) => ({
      ...prev,
      routes: prev.routes.map((r) => (r.id === id ? { ...r, status: 'concluido' } : r)),
    }))
  }

  const updateCatalog = (catalog: RiskType[]) => {
    setState((prev) => ({ ...prev, catalog }))
  }

  const addCatalogRisk = (risk: RiskType) => {
    setState((prev) => ({ ...prev, catalog: [...prev.catalog, risk] }))
  }

  const updateCatalogRisk = (id: string, updates: Partial<RiskType>) => {
    setState((prev) => ({
      ...prev,
      catalog: prev.catalog.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }))
  }

  const removeCatalogRisk = (id: string) => {
    setState((prev) => ({
      ...prev,
      catalog: prev.catalog.filter((r) => r.id !== id),
    }))
  }

  const addObservation = async (observation: Observation) => {
    setState((prev) => ({
      ...prev,
      observations: [...(prev.observations || []), observation],
    }))

    try {
      if (pb.authStore.isValid) {
        const formData = new FormData()
        const routeRecord = await pb
          .collection('routes')
          .getFirstListItem(`id="${observation.routeId}"`)
          .catch(() => null)

        if (routeRecord) {
          formData.append('route_id', routeRecord.id)
          formData.append('note', observation.note)
          if (observation.videoTimestamp) {
            formData.append('video_timestamp', observation.videoTimestamp)
          }
          if (observation.audioUrl && observation.audioUrl.startsWith('blob:')) {
            const response = await fetch(observation.audioUrl)
            const blob = await response.blob()
            formData.append('audio', blob, 'audio.webm')
          }
          await pb.collection('route_observations').create(formData)
        }
      }
    } catch (err) {
      console.error('Failed to sync observation to backend', err)
    }
  }

  const markAsSynced = (eventIds: string[]) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => (eventIds.includes(e.id) ? { ...e, synced: true } : e)),
    }))
  }

  const clearData = () => {
    setState(initialState)
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addRoute,
        removeRoute,
        addEvent,
        updateEvent,
        removeEvent,
        updateSegment,
        completeRoute,
        updateCatalog,
        addCatalogRisk,
        updateCatalogRisk,
        removeCatalogRisk,
        addObservation,
        markAsSynced,
        clearData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppProvider')
  return context
}
