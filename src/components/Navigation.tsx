import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, PlusCircle, Settings, LayoutDashboard, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DesktopSidebar = ({ className }: { className?: string }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/routes/new', icon: PlusCircle, label: 'Nova Rota' },
    { to: '/catalog', icon: TriangleAlert, label: 'Cadastro de Riscos' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
  ]

  return (
    <aside className={cn('w-64 bg-slate-900 text-slate-300 flex-col py-6', className)}>
      <div className="px-6 mb-8 flex items-center gap-2 text-white font-bold text-xl">
        <Home className="w-6 h-6 text-blue-500" />
        Rotograma
      </div>
      <nav className="flex-1 px-4 space-y-2">
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
