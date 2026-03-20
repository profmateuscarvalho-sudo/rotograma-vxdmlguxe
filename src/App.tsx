import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/store/AppContext'
import { AuthProvider } from '@/hooks/use-auth'
import { AuthGuard, PublicGuard } from '@/components/auth/guards'

import Layout from './components/Layout'
import Index from './pages/Index'
import NewRoute from './pages/NewRoute'
import FieldOperation from './pages/FieldOperation'
import RouteReport from './pages/RouteReport'
import Catalog from './pages/Catalog'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Login from './pages/Login'

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<PublicGuard />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
            </Route>

            <Route element={<AuthGuard />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/routes/new" element={<NewRoute />} />
                <Route path="/routes/:id/field" element={<FieldOperation />} />
                <Route path="/routes/:id/report" element={<RouteReport />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
