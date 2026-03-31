import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { RiskButton } from '@/components/field/RiskButton'
import { RiskDrawer } from '@/components/field/RiskDrawer'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronRight,
  ChevronLeft,
  Flag,
  ArrowLeft,
  Mic,
  Square,
  FileText,
  Video,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { RiskType, RiskEvent } from '@/types'
import { getRiskLevel, getRiskColor } from '@/lib/risk-utils'
import { cn } from '@/lib/utils'

export default function FieldOperation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, addEvent, removeEvent, completeRoute, addObservation } = useAppStore()
  const { toast } = useToast()

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [flash, setFlash] = useState(false)
  const [drawerEventId, setDrawerEventId] = useState<string | null>(null)
  const [drawerRiskName, setDrawerRiskName] = useState('')
  const [roadContext, setRoadContext] = useState<'urbana' | 'rodoviaria'>('rodoviaria')

  const [segmentObservation, setSegmentObservation] = useState('')
  const [isRecordingObs, setIsRecordingObs] = useState(false)
  const [obsAudioUrl, setObsAudioUrl] = useState('')
  const obsMediaRecorderRef = useRef<MediaRecorder | null>(null)

  const route = state.routes.find((r) => r.id === id)
  const segments = state.segments
    .filter((s) => s.routeId === id)
    .sort((a, b) => a.number - b.number)
  const currentSegment = segments[currentSegmentIndex]

  const currentEvents = state.events.filter((e) => e.segmentId === currentSegment?.id)
  const segmentObservations =
    state.observations?.filter((o) => o.segmentId === currentSegment?.id) || []

  // Dynamic Segment Total Score Calculation (Only for the current stretch)
  const currentSegmentScore = currentEvents.reduce((acc, e) => {
    const risk = state.catalog.find((r) => r.id === e.riskTypeId)
    return acc + (risk ? risk.baseWeight : 0)
  }, 0)

  const segmentLevel = getRiskLevel(currentSegmentScore)
  const segmentLevelColor = getRiskColor(segmentLevel)

  useEffect(() => {
    if (!route) navigate('/')
    if (route?.status === 'concluido') navigate(`/routes/${id}/report`)
  }, [route, navigate, id])

  if (!route || !currentSegment) return null

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
      duration: 1500,
    })

    return eventId
  }

  const handleRemoveRisk = (risk: RiskType) => {
    const eventsOfType = currentEvents.filter((e) => e.riskTypeId === risk.id)
    if (eventsOfType.length > 0) {
      // Find the most recently added event of this specific risk type
      const lastEvent = eventsOfType.sort((a, b) => b.timestamp - a.timestamp)[0]
      removeEvent(lastEvent.id)
      if (navigator.vibrate) navigator.vibrate([30, 30])
      toast({
        title: `${risk.name} removido`,
        duration: 1500,
      })
    }
  }

  const handleLongPress = (risk: RiskType) => {
    const eventId = handleLogRisk(risk)
    setDrawerRiskName(risk.name)
    setDrawerEventId(eventId)
  }

  const handlePrevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex((prev) => prev - 1)
    }
  }

  const handleNextSegment = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex((prev) => prev + 1)
    } else {
      completeRoute(id!)
      navigate(`/routes/${id}/report`)
    }
  }

  const handleVideoMarker = () => {
    if (navigator.vibrate) navigator.vibrate(50)
    addObservation({
      id: crypto.randomUUID(),
      routeId: id!,
      segmentId: currentSegment.id,
      note: 'Marcador de Vídeo',
      videoTimestamp: new Date().toISOString(),
      timestamp: Date.now(),
      synced: false,
    })
    toast({ title: 'Marcador de vídeo registrado', duration: 3000 })
  }

  const handleToggleObsAudio = async () => {
    if (isRecordingObs) {
      obsMediaRecorderRef.current?.stop()
      setIsRecordingObs(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        const chunks: Blob[] = []
        recorder.ondataavailable = (e) => chunks.push(e.data)
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const reader = new FileReader()
          reader.onloadend = () => {
            setObsAudioUrl(reader.result as string)
          }
          reader.readAsDataURL(blob)
          stream.getTracks().forEach((t) => t.stop())
        }
        recorder.start()
        obsMediaRecorderRef.current = recorder
        setIsRecordingObs(true)
      } catch (err) {
        toast({
          title: 'Microfone indisponível',
          description: 'Não foi possível acessar o microfone.',
        })
      }
    }
  }

  const handleRegisterObservation = () => {
    if (!segmentObservation.trim() && !obsAudioUrl) return
    addObservation({
      id: crypto.randomUUID(),
      routeId: id!,
      segmentId: currentSegment.id,
      note: segmentObservation,
      audioUrl: obsAudioUrl,
      timestamp: Date.now(),
      synced: false,
    })
    setSegmentObservation('')
    setObsAudioUrl('')
    toast({ title: 'Observação registrada' })
  }

  const progress = ((currentSegmentIndex + 1) / segments.length) * 100
  const isLastSegment = currentSegmentIndex === segments.length - 1

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-200 ${flash ? 'bg-blue-100' : 'bg-slate-100'}`}
    >
      <div className="bg-white px-3 py-3 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="-ml-2 h-8 font-semibold text-slate-600 px-2 mb-1 self-start"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-baseline gap-2">
              Trecho {currentSegment.number}
              <span className="text-sm text-slate-400 font-medium">/ {segments.length}</span>
            </h1>
            <p className="text-xs font-medium text-slate-500">
              KM {currentSegment.startKm} ao KM {currentSegment.endKm}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevSegment}
              disabled={currentSegmentIndex === 0}
              className="h-10 w-10 rounded-xl shadow-sm text-slate-700 shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleNextSegment}
              size="sm"
              className="h-10 px-4 rounded-xl shadow-md font-semibold shrink-0"
            >
              {isLastSegment ? (
                <>
                  <Flag className="w-4 h-4 mr-1" /> Fim
                </>
              ) : (
                <>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-12">
        <Button
          variant="default"
          className="w-full h-12 text-sm bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md rounded-xl transition-all active:scale-[0.98] mb-4"
          onClick={handleVideoMarker}
        >
          <Video className="w-4 h-4 mr-2" />
          Marcar Tempo de Vídeo
        </Button>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-row items-center justify-between mb-4">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Pontuação do Trecho
            </h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {currentSegmentScore}
              </span>
              <span className="text-xs font-medium text-slate-500 mb-0.5">pts</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Nível
            </h3>
            <Badge
              variant="outline"
              className={cn('text-xs px-2 py-0.5 font-bold border-transparent', segmentLevelColor)}
            >
              {segmentLevel}
            </Badge>
          </div>
        </div>

        <Tabs
          value={roadContext}
          onValueChange={(v) => setRoadContext(v as 'urbana' | 'rodoviaria')}
          className="w-full mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-12 shadow-sm rounded-xl">
            <TabsTrigger value="urbana" className="rounded-lg font-bold">
              Via Urbana
            </TabsTrigger>
            <TabsTrigger value="rodoviaria" className="rounded-lg font-bold">
              Via Rodoviária
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {state.catalog
            .filter(
              (risk) =>
                risk.roadContext === roadContext ||
                (!risk.roadContext && roadContext === 'rodoviaria'),
            )
            .map((risk) => {
              const count = currentEvents.filter((e) => e.riskTypeId === risk.id).length
              return (
                <RiskButton
                  key={risk.id}
                  risk={risk}
                  count={count}
                  onAdd={handleLogRisk}
                  onRemove={handleRemoveRisk}
                  onLongPressRisk={handleLongPress}
                />
              )
            })}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 mt-6">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Observação do Trecho
          </label>
          <Textarea
            placeholder="Adicione notas gerais sobre as condições deste trecho..."
            className="resize-none h-20 bg-slate-50 border-slate-200 text-sm"
            value={segmentObservation}
            onChange={(e) => setSegmentObservation(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant={isRecordingObs ? 'destructive' : 'secondary'}
              className="flex-1 font-semibold text-xs h-10"
              onClick={handleToggleObsAudio}
            >
              {isRecordingObs ? (
                <Square className="w-3 h-3 mr-1.5" />
              ) : (
                <Mic className="w-3 h-3 mr-1.5" />
              )}
              {isRecordingObs ? 'Parar Gravação' : obsAudioUrl ? 'Regravar Áudio' : 'Gravar Áudio'}
            </Button>
            <Button
              onClick={handleRegisterObservation}
              className="flex-1 font-semibold text-xs h-10"
              disabled={!segmentObservation.trim() && !obsAudioUrl}
            >
              Registrar
            </Button>
          </div>
          {obsAudioUrl && !isRecordingObs && (
            <audio controls src={obsAudioUrl} className="w-full h-8 mt-2" />
          )}
        </div>

        {segmentObservations.length > 0 && (
          <div className="space-y-2 mt-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Registros do Trecho:</h3>
            {segmentObservations.map((obs) => (
              <div
                key={obs.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(obs.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                  {obs.videoTimestamp && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                      <Video className="w-3 h-3" /> Marcador
                    </span>
                  )}
                </div>
                {obs.note && <p className="text-slate-700 font-medium text-sm">{obs.note}</p>}
                {obs.audioUrl && <audio controls src={obs.audioUrl} className="w-full h-8 mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <RiskDrawer
        eventId={drawerEventId}
        onClose={() => setDrawerEventId(null)}
        riskName={drawerRiskName}
      />
    </div>
  )
}
