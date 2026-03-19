import React, { createContext, useContext, useEffect, useState } from 'react'
import { AppState, RiskEvent, RiskType, Route, Segment } from '@/types'
import { DEFAULT_CATALOG } from '@/lib/constants'

interface AppContextType {
  state: AppState
  addRoute: (route: Route, segments: Segment[]) => void
  addEvent: (event: RiskEvent) => void
  updateEvent: (id: string, updates: Partial<RiskEvent>) => void
  removeEvent: (id: string) => void
  completeRoute: (id: string) => void
  updateCatalog: (catalog: RiskType[]) => void
  addCatalogRisk: (risk: RiskType) => void
  updateCatalogRisk: (id: string, updates: Partial<RiskType>) => void
  removeCatalogRisk: (id: string) => void
  markAsSynced: (eventIds: string[]) => void
  clearData: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialState: AppState = {
  routes: [],
  segments: [],
  events: [],
  catalog: DEFAULT_CATALOG,
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('rotograma_state')
      if (saved) return JSON.parse(saved)
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
        addEvent,
        updateEvent,
        removeEvent,
        completeRoute,
        updateCatalog,
        addCatalogRisk,
        updateCatalogRisk,
        removeCatalogRisk,
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
