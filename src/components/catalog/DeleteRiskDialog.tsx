import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteRiskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  riskName?: string
  onConfirm: () => void
}

export function DeleteRiskDialog({
  open,
  onOpenChange,
  riskName,
  onConfirm,
}: DeleteRiskDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Risco</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o risco <strong>"{riskName}"</strong>? Esta ação não pode
            ser desfeita e removerá esta opção das futuras avaliações de trecho.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Excluir Permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
