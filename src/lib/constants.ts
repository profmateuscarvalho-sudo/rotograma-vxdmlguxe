import { RiskType } from '@/types'

export const DEFAULT_CATALOG: RiskType[] = [
  { id: '1', name: 'Buracos', iconName: 'CircleDashed', baseWeight: 3, category: 'Via' },
  { id: '2', name: 'Pista escorregadia', iconName: 'Waves', baseWeight: 4, category: 'Via' },
  { id: '3', name: 'Animais na pista', iconName: 'Bird', baseWeight: 4, category: 'Fauna' },
  {
    id: '4',
    name: 'Falta de sinalização horizontal',
    iconName: 'Minus',
    baseWeight: 3,
    category: 'Sinalização',
  },
  {
    id: '5',
    name: 'Falta de sinalização vertical',
    iconName: 'Signpost',
    baseWeight: 3,
    category: 'Sinalização',
  },
  {
    id: '6',
    name: 'Vegetação obstruindo placa',
    iconName: 'Leaf',
    baseWeight: 2,
    category: 'Sinalização',
  },
  {
    id: '7',
    name: 'Acostamento inexistente',
    iconName: 'ArrowRightToLine',
    baseWeight: 3,
    category: 'Infraestrutura',
  },
  {
    id: '8',
    name: 'Acostamento em mau estado',
    iconName: 'TriangleAlert',
    baseWeight: 2,
    category: 'Infraestrutura',
  },
  { id: '9', name: 'Curva perigosa', iconName: 'TrendingUp', baseWeight: 4, category: 'Via' },
  {
    id: '10',
    name: 'Trecho com neblina freqüente',
    iconName: 'CloudFog',
    baseWeight: 3,
    category: 'Clima',
  },
  {
    id: '11',
    name: 'Iluminação pública deficiente',
    iconName: 'LightbulbOff',
    baseWeight: 2,
    category: 'Infraestrutura',
  },
  { id: '12', name: 'Pista estreita', iconName: 'Minimize2', baseWeight: 3, category: 'Via' },
  {
    id: '13',
    name: 'Pontes/Viadutos sem proteção',
    iconName: 'Waypoints',
    baseWeight: 4,
    category: 'Infraestrutura',
  },
  { id: '14', name: 'Obras na pista', iconName: 'HardHat', baseWeight: 3, category: 'Via' },
  {
    id: '15',
    name: 'Travessia de pedestres perigosa',
    iconName: 'User',
    baseWeight: 4,
    category: 'Trânsito',
  },
  {
    id: '16',
    name: 'Velocidade incompatível',
    iconName: 'Gauge',
    baseWeight: 4,
    category: 'Trânsito',
  },
  {
    id: '17',
    name: 'Drenagem obstruída',
    iconName: 'Droplets',
    baseWeight: 2,
    category: 'Infraestrutura',
  },
  { id: '18', name: 'Erosão na pista', iconName: 'Mountain', baseWeight: 4, category: 'Via' },
]

export const LEVEL_THRESHOLDS = {
  BAIXO: 10,
  MEDIO: 30,
  ALTO: 60,
}
