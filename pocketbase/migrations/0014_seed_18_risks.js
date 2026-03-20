migrate(
  (app) => {
    const obsCol = app.findCollectionByNameOrId('route_observations')
    if (!obsCol.fields.getByName('timestamp')) {
      obsCol.fields.add(new NumberField({ name: 'timestamp' }))
    }
    app.save(obsCol)

    const risksCol = app.findCollectionByNameOrId('risks')
    if (!risksCol.fields.getByName('timestamp')) {
      risksCol.fields.add(new NumberField({ name: 'timestamp' }))
    }
    app.save(risksCol)

    const riskTypesCol = app.findCollectionByNameOrId('risk_types')
    const existing = app.findRecordsByFilter('risk_types', '1=1', '', 1000, 0)
    for (let record of existing) {
      app.delete(record)
    }

    const newRisks = [
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

    for (const r of newRisks) {
      const record = new Record(riskTypesCol)
      record.set('name', r.name)
      record.set('icon', r.icon)
      record.set('baseWeight', r.baseWeight)
      record.set('category', r.category)
      app.save(record)
    }
  },
  (app) => {
    // Rollback deletes the fields if needed, but keeping them is safe
  },
)
