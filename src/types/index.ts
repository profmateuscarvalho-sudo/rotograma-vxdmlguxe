export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico'

export interface RiskType {
  id: string
  name: string
  iconName: string
  baseWeight: number
  defaultSeverity: number
  defaultProbability: number
  category?: string
  description?: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  driver: string
  vehicle: string
  kmPerSegment: number
  status: 'em_andamento' | 'concluido'
  date: string
}

export interface Segment {
  id: string
  routeId: string
  number: number
  startKm: number
  endKm: number
}

export interface RiskEvent {
  id: string
  routeId: string
  segmentId: string
  riskTypeId: string
  timestamp: number
  note?: string
  photoUrl?: string
  synced: boolean
}

export interface AppState {
  routes: Route[]
  segments: Segment[]
  events: RiskEvent[]
  catalog: RiskType[]
}
