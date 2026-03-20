import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { RiskButton } from '@/components/field/RiskButton'
import { RiskDrawer } from '@/components/field/RiskDrawer'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChevronRight, ChevronLeft, Flag, ArrowLeft, Mic, Square, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { RiskType, RiskEvent } from '@/types'

export default function FieldOperation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, addEvent, removeEvent, completeRoute, addObservation } = useAppStore()
  const { toast } = useToast()

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [flash, setFlash] = useState(false)
  const [drawerEventId, setDrawerEventId] = useState<string | null>(null)
  const [drawerRiskName, setDrawerRiskName] = useState('')

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
          setObsAudioUrl(URL.createObjectURL(blob))
          stream.getTracks().forEach((t) => t.stop())
        }
        recorder.start()
        obsMediaRecorderRef.current = recorder
        setIsRecordingObs(true)
      } catch (err) {
        toast({ title: 'Microfone indisponível', description: 'Simulando gravação...' })
        setIsRecordingObs(true)
        setTimeout(() => {
          setIsRecordingObs(false)
          setObsAudioUrl('simulated_audio.webm')
        }, 2000)
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
      <div className="bg-white px-4 py-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Menu
          </Button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Trecho {currentSegment.number}{' '}
              <span className="text-xl text-slate-400 font-medium">/ {segments.length}</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              KM {currentSegment.startKm} ao KM {currentSegment.endKm}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevSegment}
              disabled={currentSegmentIndex === 0}
              className="h-14 px-4 rounded-xl shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleNextSegment}
              size="lg"
              className="h-14 px-6 rounded-xl shadow-md"
            >
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

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3 mt-8">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Observação do Trecho
          </label>
          <Textarea
            placeholder="Adicione notas gerais sobre as condições deste trecho..."
            className="resize-none h-20 bg-slate-50 border-slate-200"
            value={segmentObservation}
            onChange={(e) => setSegmentObservation(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant={isRecordingObs ? 'destructive' : 'secondary'}
              className="flex-1"
              onClick={handleToggleObsAudio}
            >
              {isRecordingObs ? (
                <Square className="w-4 h-4 mr-2" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isRecordingObs ? 'Parar Gravação' : obsAudioUrl ? 'Regravar Áudio' : 'Gravar Áudio'}
            </Button>
            <Button
              onClick={handleRegisterObservation}
              className="flex-1"
              disabled={!segmentObservation.trim() && !obsAudioUrl}
            >
              Registrar
            </Button>
          </div>
          {obsAudioUrl && !isRecordingObs && (
            <audio controls src={obsAudioUrl} className="w-full h-10 mt-2" />
          )}
        </div>

        {segmentObservations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Registros de Observação:</h3>
            {segmentObservations.map((obs) => (
              <div
                key={obs.id}
                className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm"
              >
                <div className="text-xs text-slate-500 mb-1 font-mono">
                  {new Date(obs.timestamp).toLocaleString('pt-BR')}
                </div>
                {obs.note && <p className="text-slate-700">{obs.note}</p>}
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
