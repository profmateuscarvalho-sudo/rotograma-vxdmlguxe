import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  calculateSegmentScore,
  getRiskLevel,
  getRiskColorHex,
  getRiskWeightStyles,
} from '@/lib/risk-utils'
import { ArrowLeft, MapPin, Printer, Mic, FileText, Camera } from 'lucide-react'
import { IconRenderer } from '@/components/icons'
import { RiskEvent, RiskType } from '@/types'

export default function RouteReport() {
  const { id } = useParams()
  const { state } = useAppStore()

  const route = state.routes.find((r) => r.id === id)
  const segments = state.segments
    .filter((s) => s.routeId === id)
    .sort((a, b) => a.number - b.number)
  const events = state.events
    .filter((e) => e.routeId === id)
    .sort((a, b) => a.timestamp - b.timestamp)

  if (!route) return <div className="p-8 text-center">Rota não encontrada.</div>

  const segmentScores = segments.map((segment) => {
    const score = calculateSegmentScore(segment.id, events, state.catalog)
    return { ...segment, score, level: getRiskLevel(score) }
  })

  const totalRouteWeight = events.reduce((acc, e) => {
    const risk = state.catalog.find((r) => r.id === e.riskTypeId)
    return acc + (risk ? risk.baseWeight : 0)
  }, 0)

  const avgRouteLevelNum =
    segments.length > 0 ? (totalRouteWeight / segments.length).toFixed(1) : '0.0'

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10 print:w-full print:max-w-none print:m-0 print:p-0 print:space-y-4">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{route.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" /> {route.origin} → {route.destination}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Gerar Relatório PDF
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b pb-6 mb-8 print:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2 print:flex hidden">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <span className="font-bold text-slate-800 text-sm">Rotograma Pro</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Relatório de Risco Viário
            </h1>
            <h2 className="text-xl font-semibold text-slate-600 mt-1">{route.name}</h2>
          </div>
          <div className="text-right space-y-1 text-sm text-slate-500">
            <p>
              <strong>Avaliador:</strong> {route.evaluator}
            </p>
            <p>
              <strong>Data:</strong> {new Date(route.date).toLocaleDateString('pt-BR')}
            </p>
            <p>
              <strong>Trajeto:</strong> {route.origin} → {route.destination}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 print:grid-cols-4 print:gap-2">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:border-slate-300">
            <p className="text-sm text-slate-500 mb-1">Total de Eventos</p>
            <p className="text-2xl font-black text-slate-900">{events.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:border-slate-300">
            <p className="text-sm text-slate-500 mb-1">Total de Trechos</p>
            <p className="text-2xl font-black text-slate-900">{segments.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 print:bg-slate-50 print:border-slate-300">
            <p className="text-sm text-blue-600 mb-1 font-semibold print:text-slate-600">
              Nível de Risco da Rota
            </p>
            <p className="text-2xl font-black text-blue-900 print:text-slate-900">
              {totalRouteWeight} <span className="text-sm font-normal">pts</span>
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 print:bg-slate-50 print:border-slate-300">
            <p className="text-sm text-amber-700 mb-1 font-semibold print:text-slate-600">
              Média de Nível de Risco
            </p>
            <p className="text-2xl font-black text-amber-900 print:text-slate-900">
              {avgRouteLevelNum} <span className="text-sm font-normal">pts/trecho</span>
            </p>
          </div>
        </div>

        <Card className="border-none shadow-none print:hidden mb-8">
          <div className="bg-slate-50 p-6 border rounded-lg">
            <h3 className="text-lg font-bold mb-4">
              Scoreboard Visual (Trechos 1 a {segments.length})
            </h3>
            <div className="flex h-12 w-full rounded-lg overflow-hidden ring-1 ring-slate-200">
              {segmentScores.map((seg) => (
                <div
                  key={seg.id}
                  className="flex-1 flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: getRiskColorHex(seg.level) }}
                  title={`Trecho ${seg.number}: ${seg.level} (${seg.score} pts)`}
                >
                  <span className="text-white font-bold text-sm drop-shadow-md">{seg.number}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {segmentScores.map((seg) => {
            const segEvents = events.filter((e) => e.segmentId === seg.id)
            const segObservations = state.observations?.filter((o) => o.segmentId === seg.id) || []

            if (segEvents.length === 0 && segObservations.length === 0) return null

            const groupedEvents = Object.values(
              segEvents.reduce(
                (acc, event) => {
                  if (!acc[event.riskTypeId]) {
                    acc[event.riskTypeId] = {
                      events: [],
                      risk: state.catalog.find((r) => r.id === event.riskTypeId)!,
                    }
                  }
                  acc[event.riskTypeId].events.push(event)
                  return acc
                },
                {} as Record<string, { events: RiskEvent[]; risk: RiskType }>,
              ),
            )

            return (
              <div key={seg.id} className="print:break-inside-avoid">
                <h3 className="text-xl font-bold bg-slate-100 px-4 py-2 rounded-t-lg border-b-2 border-slate-300 print:bg-slate-200 print:border-slate-400 flex justify-between items-center">
                  <span>
                    Trecho {seg.number}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      (KM {seg.startKm} - KM {seg.endKm})
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-600">
                      Nível de Risco por Trecho: {seg.score} pts
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      {segEvents.length} eventos
                    </span>
                  </div>
                </h3>

                <div className="border border-t-0 border-slate-200 rounded-b-lg p-4 space-y-6 print:border-x-0 print:border-b print:rounded-none print:pt-4">
                  {groupedEvents.map((group) => {
                    const { risk, events: groupEvents } = group
                    if (!risk) return null
                    const groupWeightSum = groupEvents.length * risk.baseWeight

                    return (
                      <div
                        key={risk.id}
                        className="flex gap-4 border-b border-slate-100 last:border-0 pb-6 last:pb-0 print:border-slate-300 print:last:border-0"
                      >
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getRiskWeightStyles(risk.baseWeight, true)}`}
                          >
                            <IconRenderer name={risk.iconName} className="w-6 h-6 text-current" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                            <h4 className="font-bold text-lg text-slate-900">{risk.name}</h4>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                Ocorrências: {groupEvents.length}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`border ${getRiskWeightStyles(risk.baseWeight, false)} bg-transparent border-current`}
                              >
                                Peso Total: {groupWeightSum}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {groupEvents.map((event) => (
                              <div
                                key={event.id}
                                className="bg-slate-50 rounded-md p-3 border border-slate-100 print:border-slate-200 flex flex-col"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold font-mono text-slate-500">
                                    {new Date(event.timestamp).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {event.audioUrl && (
                                    <div className="flex items-center gap-1 text-xs font-medium text-blue-600 print:text-slate-500">
                                      <Mic className="w-3 h-3" /> Áudio
                                    </div>
                                  )}
                                </div>
                                {event.note && (
                                  <p className="text-sm text-slate-700 leading-relaxed mb-2 flex-1">
                                    {event.note}
                                  </p>
                                )}
                                <div className="mt-auto h-32 w-full bg-slate-100 rounded-md overflow-hidden border border-slate-200 print:h-40 print:border-slate-300 flex items-center justify-center">
                                  {event.photoUrl ? (
                                    <img
                                      src={event.photoUrl}
                                      alt="Evidência fotográfica"
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-slate-400 text-sm flex items-center gap-2">
                                      <Camera className="w-4 h-4" /> Sem registro fotográfico
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {segObservations.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 print:bg-slate-100 print:border-slate-300">
                      <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3 print:text-slate-800">
                        <FileText className="w-4 h-4" /> Observações do Trecho
                      </h4>
                      <div className="space-y-3">
                        {segObservations.map((obs) => (
                          <div key={obs.id} className="text-sm flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-600 print:text-slate-500">
                                {new Date(obs.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {obs.audioUrl && (
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full print:bg-slate-200 print:text-slate-600">
                                  <Mic className="w-3 h-3" /> Áudio anexado
                                </span>
                              )}
                            </div>
                            {obs.note && (
                              <span className="text-slate-700 leading-relaxed">{obs.note}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {events.length === 0 && (state.observations || []).length === 0 && (
            <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">
              Nenhum risco ou observação registrado nesta rota.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
