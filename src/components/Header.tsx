import React from 'react'
import { useSync } from '@/hooks/useSync'
import { useAuth } from '@/hooks/use-auth'
import { CloudOff, RefreshCw, CheckCircle2, LogOut } from 'lucide-react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Header = ({ className }: { className?: string }) => {
  const { isOnline, isSyncing, pendingCount } = useSync()
  const { user, signOut } = useAuth()

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

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          {!isOnline ? (
            <Badge
              variant="secondary"
              className="flex gap-1 items-center bg-slate-100 text-slate-600"
            >
              <CloudOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </Badge>
          ) : isSyncing ? (
            <Badge
              variant="outline"
              className="flex gap-1 items-center border-blue-200 text-blue-600"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Sincronizando...</span>
            </Badge>
          ) : pendingCount > 0 ? (
            <Badge
              variant="outline"
              className="flex gap-1 items-center border-amber-200 text-amber-600"
            >
              <RefreshCw className="w-3 h-3" /> {pendingCount}
              <span className="hidden sm:inline"> pendentes</span>
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="flex gap-1 items-center bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Sincronizado</span>
            </Badge>
          )}
        </div>

        {/* Mobile User Menu */}
        <div className="md:hidden flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 border border-slate-200 focus:outline-none hover:bg-slate-200 transition-colors">
                <span className="text-sm font-bold text-slate-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={signOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
