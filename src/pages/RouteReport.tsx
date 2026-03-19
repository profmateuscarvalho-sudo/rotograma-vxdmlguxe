import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { calculateSegmentScore, getRiskLevel, getRiskColorHex } from '@/lib/risk-utils'
import { Download, ArrowLeft, MapPin } from 'lucide-react'
import { IconRenderer } from '@/components/icons'

export default function RouteReport() {
  const { id } = useParams()
  const { state } = useAppStore()

  const route = state.routes.find((r) => r.id === id)
  const segments = state.segments
    .filter((s) => s.routeId === id)
    .sort((a, b) => a.number - b.number)
  const events = state.events.filter((e) => e.routeId === id)

  if (!route) return <div className="p-8 text-center">Rota não encontrada.</div>

  const segmentScores = segments.map((segment) => {
    const score = calculateSegmentScore(segment.id, events, state.catalog)
    return { ...segment, score, level: getRiskLevel(score) }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-6">
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
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="bg-slate-50 p-6 border-b">
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
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Baixo
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Médio
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div> Alto
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div> Crítico
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold px-2">Detalhamento por Trecho</h3>
        {segmentScores.map((seg) => {
          const segEvents = events.filter((e) => e.segmentId === seg.id)
          // Group events by risk type for summary
          const grouped = segEvents.reduce(
            (acc, curr) => {
              acc[curr.riskTypeId] = (acc[curr.riskTypeId] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )

          return (
            <Card key={seg.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white shadow-sm"
                    style={{ backgroundColor: getRiskColorHex(seg.level) }}
                  >
                    {seg.number}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">
                      KM {seg.startKm} - KM {seg.endKm}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {segEvents.length} eventos registrados
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-base px-3 py-1 font-bold"
                  style={{
                    color: getRiskColorHex(seg.level),
                    borderColor: getRiskColorHex(seg.level),
                  }}
                >
                  Score: {seg.score}
                </Badge>
              </div>
              {segEvents.length > 0 && (
                <CardContent className="p-0">
                  <div className="bg-slate-50 p-4 grid gap-3">
                    {Object.entries(grouped).map(([riskId, count]) => {
                      const risk = state.catalog.find((r) => r.id === riskId)
                      if (!risk) return null
                      return (
                        <div
                          key={riskId}
                          className="flex items-center justify-between bg-white p-3 rounded-md border shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-md text-slate-600">
                              <IconRenderer name={risk.iconName} className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-slate-800">{risk.name}</span>
                            {segEvents.some((e) => e.riskTypeId === riskId && e.note) && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                Contém obs.
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-slate-500">{count}x</span>
                            <span className="font-bold text-blue-600 min-w-[60px] text-right">
                              +{count * risk.baseWeight} pts
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
