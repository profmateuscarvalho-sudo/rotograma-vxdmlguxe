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
import { Camera, Mic, Square, Video } from 'lucide-react'
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
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [videoTimestamp, setVideoTimestamp] = useState('')
  const [timestamp, setTimestamp] = useState<number>(Date.now())

  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (eventId) {
      const event = state.events.find((e) => e.id === eventId)
      setNote(event?.note || '')
      setAudioUrl(event?.audioUrl || '')
      setPhotoUrls(event?.photoUrls || (event?.photoUrl ? [event.photoUrl] : []))
      setVideoTimestamp(event?.videoTimestamp || '')
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
          const reader = new FileReader()
          reader.onloadend = () => {
            setAudioUrl(reader.result as string)
          }
          reader.readAsDataURL(blob)
          stream.getTracks().forEach((t) => t.stop())
        }
        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
      } catch (err) {
        console.error(err)
        toast({
          title: 'Microfone indisponível',
          description: 'Não foi possível acessar o microfone.',
          duration: 2000,
        })
      }
    }
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    let allowedFiles = files

    if (photoUrls.length + files.length > 5) {
      toast({
        title: 'Limite de 5 fotos',
        description: 'Apenas as fotos que couberem no limite foram adicionadas.',
        variant: 'destructive',
        duration: 3000,
      })
      allowedFiles = files.slice(0, 5 - photoUrls.length)
    }

    allowedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoUrls((prev) => {
          if (prev.length >= 5) return prev
          return [...prev, reader.result as string]
        })
      }
      reader.readAsDataURL(file)
    })

    if (e.target) e.target.value = ''
  }

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (eventId) {
      updateEvent(eventId, {
        note,
        audioUrl,
        timestamp,
        photoUrls,
        photoUrl: photoUrls[0] || '',
        videoTimestamp,
      })
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
              <label className="text-sm font-medium">Sincronização de Vídeo</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-50"
                  onClick={() => {
                    setVideoTimestamp(new Date().toISOString())
                    toast({ title: 'Marcador de vídeo registrado!', duration: 2000 })
                  }}
                >
                  <Video className="w-4 h-4 mr-2 text-slate-600" />
                  {videoTimestamp ? 'Atualizar Marcador' : 'Ver no Vídeo'}
                </Button>
                {videoTimestamp && (
                  <span className="text-xs font-mono font-medium text-slate-500 whitespace-nowrap px-2">
                    {new Date(videoTimestamp).toLocaleTimeString('pt-BR')}
                  </span>
                )}
              </div>
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex justify-between">
                <span>Fotos do Local</span>
                <span className="text-slate-500">{photoUrls.length}/5</span>
              </label>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoCapture}
              />

              {photoUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                  {photoUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 shrink-0 snap-start">
                      <img
                        src={url}
                        className="w-full h-full object-cover rounded-md border border-slate-200"
                        alt={`Captured ${i}`}
                      />
                      <button
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md z-10"
                        onClick={() => handleRemovePhoto(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photoUrls.length < 5 && (
                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-center gap-2 bg-slate-50 border-dashed border-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-5 h-5" />
                  <span>Adicionar Foto</span>
                </Button>
              )}
            </div>

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
