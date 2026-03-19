import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Route, Segment } from '@/types'

export default function NewRoute() {
  const navigate = useNavigate()
  const { addRoute } = useAppStore()
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    driver: '',
    vehicle: '',
    kmPerSegment: '10',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const routeId = crypto.randomUUID()
    const km = parseFloat(formData.kmPerSegment) || 10

    const newRoute: Route = {
      id: routeId,
      ...formData,
      kmPerSegment: km,
      status: 'em_andamento',
      date: new Date().toISOString(),
    }

    const segments: Segment[] = Array.from({ length: 10 }).map((_, i) => ({
      id: crypto.randomUUID(),
      routeId,
      number: i + 1,
      startKm: i * km,
      endKm: (i + 1) * km,
    }))

    addRoute(newRoute, segments)
    navigate(`/routes/${routeId}/field`)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nova Rota de Levantamento</CardTitle>
          <CardDescription>
            Configure os dados da viagem antes de iniciar o rotograma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Rota</Label>
              <Input
                id="name"
                required
                placeholder="Ex: BR-116 Trecho Sul"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Input
                  id="origin"
                  required
                  placeholder="Cidade A"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  required
                  placeholder="Cidade B"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driver">Nome do Motorista</Label>
                <Input
                  id="driver"
                  required
                  placeholder="João Silva"
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Placa do Veículo</Label>
                <Input
                  id="vehicle"
                  required
                  placeholder="ABC-1234"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2 pb-4">
              <Label htmlFor="kmPerSegment">KM por Trecho</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="kmPerSegment"
                  type="number"
                  min="1"
                  required
                  value={formData.kmPerSegment}
                  onChange={(e) => setFormData({ ...formData, kmPerSegment: e.target.value })}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  Serão gerados 10 trechos automaticamente.
                </span>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              Iniciar Levantamento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
