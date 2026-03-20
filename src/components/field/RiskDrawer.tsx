import React, { useState, useEffect, useRef } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Camera, Mic, Square } from 'lucide-react'
import { useAppStore } from '@/store/AppContext'
import { toast } from '@/hooks/use-toast'

interface RiskDrawerProps {
  eventId: string | null
  onClose: () => void
  riskName?: string
}

export function RiskDrawer({ eventId, onClose, riskName }: RiskDrawerProps) {
  const { state, updateEvent } = useAppStore()
  const [note, setNote] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [timestamp, setTimestamp] = useState<number>(Date.now())

  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (eventId) {
      const event = state.events.find((e) => e.id === eventId)
      setNote(event?.note || '')
      setAudioUrl(event?.audioUrl || '')
      setTimestamp(event?.timestamp || Date.now())
    }
  }, [eventId, state.events])

  const handleToggleAudio = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        const chunks: Blob[] = []
        recorder.ondataavailable = (e) => chunks.push(e.data)
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' })
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          stream.getTracks().forEach((t) => t.stop())
        }
        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
      } catch (err) {
        console.error(err)
        toast({
          title: 'Microfone indisponível',
          description: 'Simulando gravação de áudio...',
          duration: 2000,
        })
        setIsRecording(true)
        setTimeout(() => {
          setIsRecording(false)
          setAudioUrl('simulated_audio.webm')
        }, 2000)
      }
    }
  }

  const handleSave = () => {
    if (eventId) {
      updateEvent(eventId, { note, audioUrl, timestamp })
      toast({ title: 'Detalhes salvos', duration: 2000 })
    }
    onClose()
  }

  return (
    <Drawer open={!!eventId} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Detalhes: {riskName}</DrawerTitle>
            <DrawerDescription>
              Anexe fotos, áudios e observações para o relatório.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário da Ocorrência</label>
              <Input
                value={new Date(timestamp).toLocaleString('pt-BR')}
                disabled
                className="bg-slate-50 text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nota de Áudio</label>
              <div className="flex items-center gap-2">
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  className={`flex gap-2 transition-all ${audioUrl && !isRecording ? 'w-auto px-3' : 'w-full'}`}
                  onClick={handleToggleAudio}
                >
                  {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Parar Gravação' : audioUrl ? 'Regravar' : 'Gravar Áudio'}
                </Button>
                {audioUrl && !isRecording && (
                  <audio controls src={audioUrl} className="h-10 flex-1 max-w-full" />
                )}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-24 flex flex-col gap-2 bg-slate-50 border-dashed border-2"
            >
              <Camera className="w-8 h-8 text-slate-400" />
              <span className="text-slate-500">Tirar Foto do Local</span>
            </Button>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações Escritas</label>
              <Textarea
                placeholder="Descreva a gravidade ou detalhes específicos..."
                className="resize-none h-24"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSave} className="w-full h-12 text-lg">
              Salvar Contexto
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
