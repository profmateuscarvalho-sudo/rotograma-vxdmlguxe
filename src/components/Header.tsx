import React from 'react'
import { useSync } from '@/hooks/useSync'
import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

export const Header = ({ className }: { className?: string }) => {
  const { isOnline, isSyncing, pendingCount } = useSync()

  return (
    <header
      className={cn(
        'h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0',
        className,
      )}
    >
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          R
        </div>
        <span className="font-bold text-slate-800 text-lg">Rotograma</span>
      </div>
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-slate-800">Sistema de Risco Viário</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {!isOnline ? (
            <Badge
              variant="secondary"
              className="flex gap-1 items-center bg-slate-100 text-slate-600"
            >
              <CloudOff className="w-3 h-3" /> Offline
            </Badge>
          ) : isSyncing ? (
            <Badge
              variant="outline"
              className="flex gap-1 items-center border-blue-200 text-blue-600"
            >
              <RefreshCw className="w-3 h-3 animate-spin" /> Sincronizando...
            </Badge>
          ) : pendingCount > 0 ? (
            <Badge
              variant="outline"
              className="flex gap-1 items-center border-amber-200 text-amber-600"
            >
              <RefreshCw className="w-3 h-3" /> {pendingCount} pendentes
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="flex gap-1 items-center bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle2 className="w-3 h-3" /> Sincronizado
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
