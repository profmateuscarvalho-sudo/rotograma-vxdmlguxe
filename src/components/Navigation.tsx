import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, Settings, LayoutDashboard, TriangleAlert, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

export const DesktopSidebar = ({ className }: { className?: string }) => {
  const { user, signOut } = useAuth()

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/routes/new', icon: PlusCircle, label: 'Nova Rota' },
    { to: '/catalog', icon: TriangleAlert, label: 'Cadastro de Riscos' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ]

  return (
    <aside className={cn('w-64 bg-slate-900 text-slate-300 flex flex-col py-6', className)}>
      <div className="px-6 mb-8 flex items-center gap-2 text-white font-bold text-xl">
        <Home className="w-6 h-6 text-blue-500" />
        Rotograma
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white',
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center justify-start gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  )
}

export const MobileBottomNav = ({ className }: { className?: string }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/routes/new', icon: PlusCircle, label: 'Nova Rota' },
    { to: '/catalog', icon: TriangleAlert, label: 'Cadastro de Riscos' },
  ]

  return (
    <nav
      className={cn(
        'bg-white border-t border-slate-200 flex items-center justify-around pb-safe',
        className,
      )}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center p-3 min-w-[70px] transition-colors',
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900',
            )
          }
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
