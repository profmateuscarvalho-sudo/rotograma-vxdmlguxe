import React, { useState, useEffect } from 'react'
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
import { Camera } from 'lucide-react'
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

  useEffect(() => {
    if (eventId) {
      const event = state.events.find((e) => e.id === eventId)
      setNote(event?.note || '')
    }
  }, [eventId, state.events])

  const handleSave = () => {
    if (eventId) {
      updateEvent(eventId, { note })
      toast({ title: 'Observação salva', duration: 2000 })
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
              Adicione informações extras ou fotos para este risco.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 space-y-4">
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col gap-2 bg-slate-50 border-dashed border-2"
            >
              <Camera className="w-8 h-8 text-slate-400" />
              <span className="text-slate-500">Tirar Foto (Simulado)</span>
            </Button>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
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
