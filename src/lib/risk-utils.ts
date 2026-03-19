import { RiskEvent, RiskLevel, RiskType } from '@/types'
import { LEVEL_THRESHOLDS } from './constants'

export const calculateEventScore = (event: RiskEvent, catalog: RiskType[]): number => {
  const riskType = catalog.find((r) => r.id === event.riskTypeId)
  if (!riskType) return 0
  // Score = weight * quantity (quantity is 1 per event in this model, as each tap is an event)
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
