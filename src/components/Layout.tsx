import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar, MobileBottomNav } from './Navigation'
import { Header } from './Header'

export default function Layout() {
  const location = useLocation()
  const isFieldOperation = location.pathname.includes('/field')

  if (isFieldOperation) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-100">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans print:h-auto print:overflow-visible print:bg-white">
      <DesktopSidebar className="hidden md:flex shrink-0 print:hidden" />
      <div className="flex-1 flex flex-col min-w-0 print:block">
        <Header className="print:hidden" />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 print:p-0 print:overflow-visible print:block">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav className="md:hidden absolute bottom-0 w-full z-50 print:hidden" />
    </div>
  )
}
