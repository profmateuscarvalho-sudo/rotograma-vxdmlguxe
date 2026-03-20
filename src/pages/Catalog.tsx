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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { RiskType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { RiskFormDialog } from '@/components/catalog/RiskFormDialog'
import { DeleteRiskDialog } from '@/components/catalog/DeleteRiskDialog'
import { getRiskWeightStyles, getRiskWeightLevelName } from '@/lib/risk-utils'
import { RiskLevelLegend } from '@/components/RiskLevelLegend'

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
          <h2 className="text-3xl font-bold tracking-tight">Cadastro de Riscos</h2>
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

      <RiskLevelLegend />

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
                <TableHead className="text-center">Peso / Nível</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.catalog.map((risk) => (
                <TableRow key={risk.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md hidden sm:flex border ${getRiskWeightStyles(risk.baseWeight, false)}`}
                      >
                        <IconRenderer name={risk.iconName} className="w-5 h-5 text-current" />
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
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge
                        variant="outline"
                        className={`font-bold px-3 py-1 ${getRiskWeightStyles(risk.baseWeight, true)}`}
                      >
                        Peso {risk.baseWeight}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                        {getRiskWeightLevelName(risk.baseWeight)}
                      </span>
                    </div>
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
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
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
