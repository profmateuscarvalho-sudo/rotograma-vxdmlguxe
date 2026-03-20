import { RiskEvent, RiskLevel, RiskType, RouteRiskLevel } from '@/types'
import { LEVEL_THRESHOLDS, ROUTE_LEVEL_THRESHOLDS } from './constants'

export const calculateEventScore = (event: RiskEvent, catalog: RiskType[]): number => {
  const riskType = catalog.find((r) => r.id === event.riskTypeId)
  if (!riskType) return 0
  return riskType.baseWeight
}

export const calculateSegmentScore = (
  segmentId: string,
  events: RiskEvent[],
  catalog: RiskType[],
): number => {
  const segmentEvents = events.filter((e) => e.segmentId === segmentId)
  return segmentEvents.reduce((total, event) => total + calculateEventScore(event, catalog), 0)
}

export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= LEVEL_THRESHOLDS.BAIXO) return 'Baixo'
  if (score <= LEVEL_THRESHOLDS.MEDIO) return 'Médio'
  if (score <= LEVEL_THRESHOLDS.ALTO) return 'Alto'
  return 'Crítico'
}

export const getRouteRiskLevel = (score: number): RouteRiskLevel => {
  if (score === 0) return 'Sem Riscos'
  if (score <= ROUTE_LEVEL_THRESHOLDS.BAIXO) return 'Baixo'
  if (score <= ROUTE_LEVEL_THRESHOLDS.MEDIO) return 'Médio'
  if (score <= ROUTE_LEVEL_THRESHOLDS.ALTO) return 'Alto'
  return 'Crítico'
}

export const getRouteRiskColor = (level: RouteRiskLevel): string => {
  switch (level) {
    case 'Sem Riscos':
      return 'bg-slate-100 text-slate-600 border-slate-200'
    case 'Baixo':
      return 'bg-green-500 text-white border-green-600'
    case 'Médio':
      return 'bg-yellow-500 text-white border-yellow-600'
    case 'Alto':
      return 'bg-orange-500 text-white border-orange-600'
    case 'Crítico':
      return 'bg-red-600 text-white border-red-700'
    default:
      return 'bg-slate-200 text-slate-800'
  }
}

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'Baixo':
      return 'bg-emerald-500 text-white'
    case 'Médio':
      return 'bg-yellow-500 text-white'
    case 'Alto':
      return 'bg-amber-500 text-white'
    case 'Crítico':
      return 'bg-red-600 text-white'
    default:
      return 'bg-slate-200 text-slate-800'
  }
}

export const getRiskColorHex = (level: RiskLevel): string => {
  switch (level) {
    case 'Baixo':
      return '#10b981'
    case 'Médio':
      return '#eab308'
    case 'Alto':
      return '#f59e0b'
    case 'Crítico':
      return '#dc2626'
    default:
      return '#e2e8f0'
  }
}

export const getRiskWeightStyles = (weight: number, active: boolean) => {
  switch (weight) {
    case 1:
      return active
        ? 'bg-green-500 border-green-600 text-white'
        : 'bg-green-50 border-green-200 text-green-700'
    case 2:
      return active
        ? 'bg-blue-500 border-blue-600 text-white'
        : 'bg-blue-50 border-blue-200 text-blue-700'
    case 3:
      return active
        ? 'bg-yellow-500 border-yellow-600 text-white'
        : 'bg-yellow-50 border-yellow-200 text-yellow-700'
    case 4:
      return active
        ? 'bg-red-500 border-red-600 text-white'
        : 'bg-red-50 border-red-200 text-red-700'
    default:
      return active
        ? 'bg-slate-500 border-slate-600 text-white'
        : 'bg-slate-50 border-slate-200 text-slate-700'
  }
}
