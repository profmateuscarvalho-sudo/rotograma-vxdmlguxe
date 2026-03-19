import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RiskType } from '@/types'

const riskSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  category: z.string().optional(),
  description: z.string().optional(),
  baseWeight: z.coerce.number().positive('Deve ser maior que 0'),
  defaultSeverity: z.coerce.number().min(1).max(5),
  defaultProbability: z.coerce.number().min(1).max(5),
})

type RiskFormValues = z.infer<typeof riskSchema>

interface RiskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  risk?: RiskType | null
  onSave: (data: Omit<RiskType, 'id'>) => void
}

export function RiskFormDialog({ open, onOpenChange, risk, onSave }: RiskFormDialogProps) {
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      baseWeight: 1,
      defaultSeverity: 1,
      defaultProbability: 1,
    },
  })

  useEffect(() => {
    if (open) {
      if (risk) {
        form.reset({
          name: risk.name,
          category: risk.category || '',
          description: risk.description || '',
          baseWeight: risk.baseWeight,
          defaultSeverity: risk.defaultSeverity,
          defaultProbability: risk.defaultProbability,
        })
      } else {
        form.reset({
          name: '',
          category: '',
          description: '',
          baseWeight: 1,
          defaultSeverity: 1,
          defaultProbability: 1,
        })
      }
    }
  }, [open, risk, form])

  const handleSubmit = (values: RiskFormValues) => {
    onSave({
      ...values,
      iconName: risk?.iconName || 'AlertTriangle',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{risk ? 'Editar Risco' : 'Novo Risco'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Nome do Risco</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Curva fechada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Via" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes adicionais..."
                        {...field}
                        value={field.value || ''}
                        className="resize-none h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="baseWeight"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (Score)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
                <FormField
                  name="defaultSeverity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severidade (1-5)</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="defaultProbability"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prob. (1-5)</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Risco</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
