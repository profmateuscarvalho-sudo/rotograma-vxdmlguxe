export type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico'

export type RouteRiskLevel = 'Sem Riscos' | 'Baixo' | 'Médio' | 'Alto' | 'Crítico'

export interface RiskType {
  id: string
  name: string
  iconName: string
  baseWeight: number
  category?: string
  description?: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  evaluator: string
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
  observation?: string
}

export interface RiskEvent {
  id: string
  routeId: string
  segmentId: string
  riskTypeId: string
  timestamp: number
  note?: string
  videoTimestamp?: string
  photoUrl?: string
  audioUrl?: string
  synced: boolean
}

export interface Observation {
  id: string
  routeId: string
  segmentId: string
  note: string
  audioUrl?: string
  videoTimestamp?: string
  timestamp: number
  synced: boolean
}

export interface AppState {
  routes: Route[]
  segments: Segment[]
  events: RiskEvent[]
  catalog: RiskType[]
  observations?: Observation[]
}
