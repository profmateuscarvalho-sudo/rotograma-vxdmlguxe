import React from 'react'
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
import { AlertCircle } from 'lucide-react'
import { LEVEL_THRESHOLDS } from '@/lib/constants'

export default function Catalog() {
  const { state } = useAppStore()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Catálogo de Riscos & Matriz</h2>
        <p className="text-muted-foreground">
          Configuração dos parâmetros de cálculo do rotograma.
        </p>
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
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <p>
              O score do trecho é a soma dos pesos de todos os eventos registrados nele.{' '}
              <br className="hidden md:block" />
              Formula: <code className="bg-white px-1 rounded">Score = Σ (Peso do Risco)</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riscos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ícone</TableHead>
                <TableHead>Nome do Risco</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Probabilidade</TableHead>
                <TableHead className="text-right">Peso (Impacto no Trecho)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.catalog.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <div className="p-2 bg-slate-100 rounded-md inline-flex text-slate-700">
                      <IconRenderer name={risk.iconName} className="w-5 h-5" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{risk.name}</TableCell>
                  <TableCell>{risk.defaultSeverity}</TableCell>
                  <TableCell>{risk.defaultProbability}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="font-bold bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {risk.baseWeight} pts
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
