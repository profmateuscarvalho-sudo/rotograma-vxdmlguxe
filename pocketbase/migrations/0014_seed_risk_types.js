migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('risk_types')

    const risks = [
      {
        name: 'Buracos e deformações no pavimento',
        icon: 'CircleDashed',
        baseWeight: 3,
        category: 'Via',
      },
      { name: 'Pista escorregadia', icon: 'Waves', baseWeight: 4, category: 'Via' },
      {
        name: 'Sinalização horizontal apagada',
        icon: 'Minus',
        baseWeight: 2,
        category: 'Sinalização',
      },
      {
        name: 'Sinalização vertical insuficiente',
        icon: 'Signpost',
        baseWeight: 2,
        category: 'Sinalização',
      },
      { name: 'Curvas fechadas', icon: 'TrendingUp', baseWeight: 3, category: 'Via' },
      {
        name: 'Declives e aclives acentuados',
        icon: 'TrendingDown',
        baseWeight: 3,
        category: 'Via',
      },
      { name: 'Trechos com neblina', icon: 'CloudFog', baseWeight: 3, category: 'Clima' },
      { name: 'Aquaplanagem', icon: 'Droplets', baseWeight: 4, category: 'Clima' },
      {
        name: 'Acostamento inexistente ou estreito',
        icon: 'ArrowRightToLine',
        baseWeight: 3,
        category: 'Infraestrutura',
      },
      {
        name: 'Acostamento degradado',
        icon: 'TriangleAlert',
        baseWeight: 2,
        category: 'Infraestrutura',
      },
      { name: 'Pontes', icon: 'Waypoints', baseWeight: 2, category: 'Infraestrutura' },
      { name: 'Interseções e retornos perigosos', icon: 'Shuffle', baseWeight: 4, category: 'Via' },
      {
        name: 'Entradas e saídas de veículos pesados',
        icon: 'Truck',
        baseWeight: 3,
        category: 'Trânsito',
      },
      { name: 'Ultrapassagens perigosas', icon: 'CarFront', baseWeight: 4, category: 'Trânsito' },
      { name: 'Animais na pista', icon: 'Bird', baseWeight: 4, category: 'Fauna' },
      { name: 'Travessia de pedestres', icon: 'User', baseWeight: 3, category: 'Trânsito' },
      { name: 'Áreas urbanizadas', icon: 'Building', baseWeight: 2, category: 'Trânsito' },
      {
        name: 'Falha de comunicação (sinal de celular)',
        icon: 'WifiOff',
        baseWeight: 2,
        category: 'Infraestrutura',
      },
    ]

    risks.forEach((risk) => {
      try {
        const existing = app.findFirstRecordByData('risk_types', 'name', risk.name)
        existing.set('icon', risk.icon)
        existing.set('baseWeight', risk.baseWeight)
        existing.set('category', risk.category)
        app.save(existing)
      } catch {
        const record = new Record(collection)
        record.set('name', risk.name)
        record.set('icon', risk.icon)
        record.set('baseWeight', risk.baseWeight)
        record.set('category', risk.category)
        app.save(record)
      }
    })
  },
  (app) => {
    // Empty down migration to prevent accidental data loss in risk_types which might be referenced by risks
  },
)
