import React from 'react'
import { useAppStore } from '@/store/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Route as RouteIcon, AlertTriangle, FileText, CheckCircle, Trash2 } from 'lucide-react'
import {
  calculateSegmentScore,
  getRiskLevel,
  getRiskColor,
  calculateEventScore,
  getRouteRiskLevel,
  getRouteRiskColor,
} from '@/lib/risk-utils'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

export default function Index() {
  const navigate = useNavigate()
  const { state, removeRoute } = useAppStore()
  const { routes, segments, events, catalog } = state

  const totalRoutes = routes.length
  const inProgress = routes.filter((r) => r.status === 'em_andamento').length

  const completedRoutes = routes.filter((r) => r.status === 'concluido')
  let totalScore = 0
  let totalSegmentsCalculated = 0
  completedRoutes.forEach((route) => {
    const routeSegments = segments.filter((s) => s.routeId === route.id)
    routeSegments.forEach((segment) => {
      totalScore += calculateSegmentScore(segment.id, events, catalog)
      totalSegmentsCalculated++
    })
  })
  const avgScore = totalSegmentsCalculated ? totalScore / totalSegmentsCalculated : 0
  const avgRiskLevel = getRiskLevel(avgScore)

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeRoute(id)
    toast({ title: 'Rota excluída com sucesso' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral dos levantamentos viários.</p>
        </div>
        <Button asChild className="hidden md:flex gap-2">
          <Link to="/routes/new">
            <RouteIcon className="w-4 h-4" /> Iniciar Rota
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rotas Totais</CardTitle>
            <RouteIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <p className="text-xs text-muted-foreground">{inProgress} em andamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risco Médio (Global)</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Badge className={getRiskColor(avgRiskLevel)}>{avgRiskLevel}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {totalSegmentsCalculated} trechos analisados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eventos Registrados</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => !e.synced).length} pendentes de sync
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Minhas Rotas</h3>
        {routes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <RouteIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Nenhuma rota registrada</h3>
            <p className="text-slate-500 mt-1 mb-4">
              Comece seu primeiro levantamento de risco viário.
            </p>
            <Button asChild>
              <Link to="/routes/new">Criar Nova Rota</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {routes.map((route) => {
              const routeEvents = events.filter((e) => e.routeId === route.id)
              const routeScore = routeEvents.reduce(
                (total, event) => total + calculateEventScore(event, catalog),
                0,
              )
              const routeSegments = segments.filter((s) => s.routeId === route.id)
              const segmentCount = Math.max(routeSegments.length, 1)
              const avgRouteScore = routeScore / segmentCount
              const routeRiskLevel = getRouteRiskLevel(avgRouteScore)

              return (
                <Card
                  key={route.id}
                  onClick={() =>
                    navigate(
                      route.status === 'em_andamento'
                        ? `/routes/${route.id}/field`
                        : `/routes/${route.id}/report`,
                    )
                  }
                  className="hover:border-blue-300 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {route.name}
                        </h4>
                      </div>
                      <div className="text-sm text-slate-500 flex flex-wrap gap-2 items-center">
                        <span>
                          {route.origin} → {route.destination}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>{new Date(route.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                      <Badge
                        variant="outline"
                        className={getRouteRiskColor(routeRiskLevel)}
                        title={`Média: ${avgRouteScore.toFixed(1)} pts/trecho`}
                      >
                        Nível: {routeRiskLevel} ({avgRouteScore.toFixed(1)} pts/méd)
                      </Badge>

                      <div className="flex items-center gap-2">
                        {route.status === 'em_andamento' ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                          >
                            Em Andamento
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-emerald-600 border-emerald-200 flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Concluído
                          </Badge>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Rota?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação é irreversível. A rota e todos os seus eventos registrados
                                serão apagados permanentemente do sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={(e) => handleDelete(e, route.id)}
                              >
                                Excluir Rota
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
