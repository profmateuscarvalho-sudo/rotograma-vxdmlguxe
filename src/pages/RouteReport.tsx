import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  calculateSegmentScore,
  getRiskLevel,
  getRiskColorHex,
  getRiskWeightStyles,
} from '@/lib/risk-utils'
import { ArrowLeft, MapPin, Printer, Mic } from 'lucide-react'
import { IconRenderer } from '@/components/icons'

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

        <Card className="border-none shadow-none print:hidden mb-8">
          <div className="bg-slate-50 p-6 border rounded-lg">
            <h3 className="text-lg font-bold mb-4">Scoreboard Visual (Trechos 1 a 10)</h3>
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
            if (segEvents.length === 0) return null

            return (
              <div key={seg.id} className="print:break-inside-avoid">
                <h3 className="text-xl font-bold bg-slate-100 px-4 py-2 rounded-t-lg border-b-2 border-slate-300 print:bg-slate-200 print:border-slate-400 flex justify-between items-center">
                  <span>
                    Trecho {seg.number}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      (KM {seg.startKm} - KM {seg.endKm})
                    </span>
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {segEvents.length} eventos
                  </span>
                </h3>
                <div className="border border-t-0 border-slate-200 rounded-b-lg p-4 space-y-6 print:border-x-0 print:border-b print:rounded-none print:pt-4">
                  {segEvents.map((event) => {
                    const risk = state.catalog.find((r) => r.id === event.riskTypeId)
                    if (!risk) return null
                    const timeStr = new Date(event.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    return (
                      <div
                        key={event.id}
                        className="flex gap-4 border-b border-slate-100 last:border-0 pb-6 last:pb-0 print:border-slate-300 print:last:border-0"
                      >
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getRiskWeightStyles(risk.baseWeight, true)}`}
                          >
                            <IconRenderer name={risk.iconName} className="w-6 h-6 text-current" />
                          </div>
                          <span className="text-xs font-bold font-mono text-slate-500">
                            {timeStr}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-lg text-slate-900">{risk.name}</h4>
                            <Badge
                              variant="outline"
                              className={`border ${getRiskWeightStyles(risk.baseWeight, false)} bg-transparent border-current`}
                            >
                              Peso {risk.baseWeight}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                            {event.note || risk.description || 'Nenhuma observação adicional.'}
                          </p>

                          <div className="flex flex-wrap gap-3 mt-3">
                            <div className="h-24 w-32 bg-slate-100 rounded-md border border-slate-200 overflow-hidden relative flex items-center justify-center">
                              <img
                                src={
                                  event.photoUrl ||
                                  `https://img.usecurling.com/p/200/150?q=${encodeURIComponent(risk.name.split(' ')[0])}&color=gray`
                                }
                                alt="Evidência"
                                className={`object-cover w-full h-full ${!event.photoUrl && 'opacity-70 saturate-50'}`}
                              />
                            </div>

                            {event.audioUrl && (
                              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 h-10 self-end text-sm font-medium text-slate-600 shadow-sm print:bg-white">
                                <Mic className="w-4 h-4 text-blue-500" /> Áudio Anexado
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {events.length === 0 && (
            <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">
              Nenhum risco foi registrado nesta rota.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
