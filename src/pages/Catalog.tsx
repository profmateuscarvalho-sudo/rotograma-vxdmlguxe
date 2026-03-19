import React, { useState } from 'react'
import { useAppStore } from '@/store/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconRenderer } from '@/components/icons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { RiskType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { RiskFormDialog } from '@/components/catalog/RiskFormDialog'
import { DeleteRiskDialog } from '@/components/catalog/DeleteRiskDialog'

export default function Catalog() {
  const { state, addCatalogRisk, updateCatalogRisk, removeCatalogRisk } = useAppStore()
  const { toast } = useToast()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<RiskType | null>(null)
  const [deletingRisk, setDeletingRisk] = useState<RiskType | null>(null)

  const handleSaveRisk = (data: Omit<RiskType, 'id'>) => {
    if (selectedRisk) {
      updateCatalogRisk(selectedRisk.id, data)
      toast({ title: 'Risco atualizado com sucesso' })
    } else {
      addCatalogRisk({ ...data, id: crypto.randomUUID() } as RiskType)
      toast({ title: 'Risco adicionado com sucesso' })
    }
    setIsFormOpen(false)
  }

  const handleConfirmDelete = () => {
    if (deletingRisk) {
      removeCatalogRisk(deletingRisk.id)
      toast({ title: 'Risco excluído' })
      setDeletingRisk(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Riscos</h2>
          <p className="text-muted-foreground">
            Configuração e gestão dos parâmetros de risco utilizados no rotograma.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedRisk(null)
            setIsFormOpen(true)
          }}
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Risco
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Limites de Matriz de Risco (Score do Trecho)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="font-bold text-emerald-700 text-lg">Risco Baixo</div>
              <div className="text-emerald-600 font-mono mt-1">
                0 a {LEVEL_THRESHOLDS.BAIXO} pontos
              </div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="font-bold text-yellow-700 text-lg">Risco Médio</div>
              <div className="text-yellow-600 font-mono mt-1">
                {LEVEL_THRESHOLDS.BAIXO + 1} a {LEVEL_THRESHOLDS.MEDIO} pontos
              </div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="font-bold text-amber-700 text-lg">Risco Alto</div>
              <div className="text-amber-600 font-mono mt-1">
                {LEVEL_THRESHOLDS.MEDIO + 1} a {LEVEL_THRESHOLDS.ALTO} pontos
              </div>
            </div>
            <div className="flex-1 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="font-bold text-red-700 text-lg">Risco Crítico</div>
              <div className="text-red-600 font-mono mt-1">{LEVEL_THRESHOLDS.ALTO + 1}+ pontos</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-slate-100 p-3 rounded-md">
            <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <p>
              O score do trecho é a soma dos pesos de todos os eventos registrados nele. Formula:{' '}
              <code className="bg-white px-1 rounded">Score = Σ (Peso do Risco)</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riscos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risco</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Sev/Prob</TableHead>
                <TableHead className="text-right">Peso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.catalog.map((risk) => (
                <TableRow key={risk.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-md text-slate-600 hidden sm:flex">
                        <IconRenderer name={risk.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{risk.name}</div>
                        {risk.description && (
                          <div className="text-xs text-slate-500 max-w-[180px] sm:max-w-[250px] truncate">
                            {risk.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700">
                      {risk.category || 'Geral'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <span className="text-slate-600 text-sm">
                      S:{risk.defaultSeverity} / P:{risk.defaultProbability}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="font-bold bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {risk.baseWeight} pts
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-blue-600"
                        onClick={() => {
                          setSelectedRisk(risk)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-red-600"
                        onClick={() => setDeletingRisk(risk)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {state.catalog.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum risco cadastrado. Adicione um novo risco para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RiskFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        risk={selectedRisk}
        onSave={handleSaveRisk}
      />

      <DeleteRiskDialog
        open={!!deletingRisk}
        onOpenChange={(open) => !open && setDeletingRisk(null)}
        riskName={deletingRisk?.name}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
