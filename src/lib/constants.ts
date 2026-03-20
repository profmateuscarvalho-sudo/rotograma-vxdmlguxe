import { RiskType } from '@/types'

export const DEFAULT_CATALOG: RiskType[] = [
  // Weight 4 (Critical)
  { id: '1', name: 'Pista escorregadia', iconName: 'Waves', baseWeight: 4, category: 'Via' },
  { id: '2', name: 'Aquaplanagem', iconName: 'Droplets', baseWeight: 4, category: 'Via' },
  { id: '3', name: 'Curvas fechadas', iconName: 'CornerUpRight', baseWeight: 4, category: 'Via' },
  {
    id: '4',
    name: 'Interseções e retornos perigosos',
    iconName: 'Split',
    baseWeight: 4,
    category: 'Via',
  },
  {
    id: '5',
    name: 'Ultrapassagens perigosas',
    iconName: 'ZapOff',
    baseWeight: 4,
    category: 'Trânsito',
  },
  { id: '6', name: 'Animais na pista', iconName: 'Dog', baseWeight: 4, category: 'Fauna' },
  {
    id: '7',
    name: 'Proibido Ultrapassar',
    iconName: 'Ban',
    baseWeight: 4,
    category: 'Sinalização',
  },

  // Weight 3 (High)
  {
    id: '8',
    name: 'Buracos e deformações no pavimento',
    iconName: 'Activity',
    baseWeight: 3,
    category: 'Via',
  },
  {
    id: '9',
    name: 'Sinalização horizontal apagada',
    iconName: 'Eraser',
    baseWeight: 3,
    category: 'Sinalização',
  },
  {
    id: '10',
    name: 'Sinalização vertical insuficiente',
    iconName: 'EyeOff',
    baseWeight: 3,
    category: 'Sinalização',
  },
  { id: '11', name: 'Trechos com neblina', iconName: 'Cloud', baseWeight: 3, category: 'Clima' },
  {
    id: '12',
    name: 'Acostamento inexistente ou estreito',
    iconName: 'ArrowLeftRight',
    baseWeight: 3,
    category: 'Infraestrutura',
  },
  {
    id: '13',
    name: 'Acostamento degradado',
    iconName: 'TrendingDown',
    baseWeight: 3,
    category: 'Infraestrutura',
  },
  {
    id: '14',
    name: 'Entradas e saídas de veículos pesados',
    iconName: 'Truck',
    baseWeight: 3,
    category: 'Trânsito',
  },
  {
    id: '15',
    name: 'Travessia de pedestres',
    iconName: 'User',
    baseWeight: 3,
    category: 'Trânsito',
  },
  {
    id: '16',
    name: 'Ponte Estreita',
    iconName: 'Shrink',
    baseWeight: 3,
    category: 'Infraestrutura',
  },
  { id: '17', name: 'Trabalhadores na Pista', iconName: 'HardHat', baseWeight: 3, category: 'Via' },
  { id: '18', name: 'Pista Irregular/Ondulada', iconName: 'Wind', baseWeight: 3, category: 'Via' },

  // Weight 2 (Medium)
  {
    id: '19',
    name: 'Declives e aclives acentuados',
    iconName: 'TrendingUp',
    baseWeight: 2,
    category: 'Via',
  },
  { id: '20', name: 'Pontes', iconName: 'Bridge', baseWeight: 2, category: 'Infraestrutura' },
  {
    id: '21',
    name: 'Áreas urbanizadas',
    iconName: 'Building2',
    baseWeight: 2,
    category: 'Infraestrutura',
  },
  {
    id: '22',
    name: 'Área Escolar',
    iconName: 'GraduationCap',
    baseWeight: 2,
    category: 'Trânsito',
  },
  { id: '23', name: 'Vento Lateral Forte', iconName: 'Wind', baseWeight: 2, category: 'Clima' },

  // Weight 1 (Low)
  {
    id: '24',
    name: 'Falha de comunicação (sinal de celular)',
    iconName: 'SignalLow',
    baseWeight: 1,
    category: 'Infraestrutura',
  },
]

export const LEVEL_THRESHOLDS = {
  BAIXO: 15,
  MEDIO: 30,
  ALTO: 50,
}

export const ROUTE_LEVEL_THRESHOLDS = {
  BAIXO: 15,
  MEDIO: 30,
  ALTO: 50,
}
