import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { RiskButton } from '@/components/field/RiskButton'
import { RiskDrawer } from '@/components/field/RiskDrawer'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronRight, Flag } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { RiskType, RiskEvent } from '@/types'

export default function FieldOperation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, addEvent, removeEvent, completeRoute, updateSegment } = useAppStore()
  const { toast } = useToast()

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [flash, setFlash] = useState(false)
  const [drawerEventId, setDrawerEventId] = useState<string | null>(null)
  const [drawerRiskName, setDrawerRiskName] = useState('')
  const [segmentObservation, setSegmentObservation] = useState('')

  const route = state.routes.find((r) => r.id === id)
  const segments = state.segments
    .filter((s) => s.routeId === id)
    .sort((a, b) => a.number - b.number)
  const currentSegment = segments[currentSegmentIndex]

  const currentEvents = state.events.filter((e) => e.segmentId === currentSegment?.id)

  useEffect(() => {
    if (!route) navigate('/')
    if (route?.status === 'concluido') navigate(`/routes/${id}/report`)
  }, [route, navigate, id])

  useEffect(() => {
    setSegmentObservation(currentSegment?.observation || '')
  }, [currentSegment?.id, currentSegment?.observation])

  if (!route || !currentSegment) return null

  const handleObservationBlur = () => {
    if (currentSegment && currentSegment.observation !== segmentObservation) {
      updateSegment(currentSegment.id, { observation: segmentObservation })
    }
  }

  const handleLogRisk = (risk: RiskType) => {
    if (navigator.vibrate) navigator.vibrate(50)
    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    const eventId = crypto.randomUUID()
    const newEvent: RiskEvent = {
      id: eventId,
      routeId: id!,
      segmentId: currentSegment.id,
      riskTypeId: risk.id,
      timestamp: Date.now(),
      synced: false,
    }

    addEvent(newEvent)

    toast({
      title: `${risk.name} registrado`,
      duration: 5000,
      action: (
        <Button variant="outline" size="sm" onClick={() => removeEvent(eventId)}>
          Desfazer
        </Button>
      ),
    })

    return eventId
  }

  const handleLongPress = (risk: RiskType) => {
    const eventId = handleLogRisk(risk)
    setDrawerRiskName(risk.name)
    setDrawerEventId(eventId)
  }

  const handleNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex((prev) => prev + 1)
    } else {
      completeRoute(id!)
      navigate(`/routes/${id}/report`)
    }
  }

  const progress = ((currentSegmentIndex + 1) / segments.length) * 100
  const isLastSegment = currentSegmentIndex === segments.length - 1

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-200 ${flash ? 'bg-blue-100' : 'bg-slate-100'}`}
    >
      <div className="bg-white px-4 py-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Trecho {currentSegment.number}{' '}
              <span className="text-xl text-slate-400 font-medium">/ 10</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              KM {currentSegment.startKm} ao KM {currentSegment.endKm}
            </p>
          </div>
          <Button onClick={handleNextSegment} size="lg" className="h-14 px-6 rounded-xl shadow-md">
            {isLastSegment ? (
              <>
                <Flag className="mr-2" /> Finalizar
              </>
            ) : (
              <>
                <ChevronRight className="mr-2" /> Próximo
              </>
            )}
          </Button>
        </div>
        <Progress value={progress} className="h-3 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-12 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {state.catalog.map((risk) => {
            const count = currentEvents.filter((e) => e.riskTypeId === risk.id).length
            return (
              <RiskButton
                key={risk.id}
                risk={risk}
                count={count}
                onTap={handleLogRisk}
                onLongPressRisk={handleLongPress}
              />
            )
          })}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Observações do Trecho</label>
          <Textarea
            placeholder="Adicione notas gerais sobre as condições deste trecho..."
            className="resize-none h-24 bg-white shadow-sm"
            value={segmentObservation}
            onChange={(e) => setSegmentObservation(e.target.value)}
            onBlur={handleObservationBlur}
          />
        </div>
      </div>

      <RiskDrawer
        eventId={drawerEventId}
        onClose={() => setDrawerEventId(null)}
        riskName={drawerRiskName}
      />
    </div>
  )
}
