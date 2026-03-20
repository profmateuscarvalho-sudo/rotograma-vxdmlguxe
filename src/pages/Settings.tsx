import React from 'react'
import { useAppStore } from '@/store/AppContext'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, SmartphoneNfc, LogOut, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function Settings() {
  const { clearData } = useAppStore()
  const { user, signOut } = useAuth()

  const handleClear = () => {
    if (
      confirm(
        'Tem certeza que deseja apagar todos os dados locais? Esta ação não pode ser desfeita.',
      )
    ) {
      clearData()
      toast({ title: 'Dados limpos com sucesso' })
    }
  }

  const handleLogout = () => {
    signOut()
    toast({ title: 'Sessão encerrada' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" /> Perfil do Usuário
          </CardTitle>
          <CardDescription>Gerencie sua sessão ativa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 border rounded-lg">
            <h4 className="font-semibold text-slate-800">{user?.name || 'Usuário'}</h4>
            <p className="text-sm text-slate-500">{user?.email}</p>
            {user?.role && (
              <Badge
                variant="secondary"
                className="mt-2 capitalize bg-blue-100 text-blue-700 hover:bg-blue-100"
              >
                {user.role}
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto text-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SmartphoneNfc className="w-5 h-5" /> Armazenamento Offline
          </CardTitle>
          <CardDescription>
            O Rotograma opera primariamente offline. Os dados são salvos no dispositivo e
            sincronizados automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 border rounded-lg">
            <h4 className="font-semibold text-slate-800">Uso de Armazenamento Local</h4>
            <p className="text-sm text-slate-500 mt-1">
              Estimativa:{' '}
              {Math.round((localStorage.getItem('rotograma_state')?.length || 0) / 1024)} KB
            </p>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-red-600 mb-2">Zona de Perigo</h4>
            <Button variant="destructive" onClick={handleClear} className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4 mr-2" /> Limpar Todos os Dados
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Isso apagará todas as rotas em andamento, concluídas e a lista de riscos
              personalizada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
