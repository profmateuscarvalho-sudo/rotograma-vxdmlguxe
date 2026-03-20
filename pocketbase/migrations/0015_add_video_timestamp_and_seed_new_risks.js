migrate(
  (app) => {
    // Add video_timestamp to risks
    const risksCol = app.findCollectionByNameOrId('risks')
    if (!risksCol.fields.getByName('video_timestamp')) {
      risksCol.fields.add(new TextField({ name: 'video_timestamp' }))
      app.save(risksCol)
    }

    // Add video_timestamp to route_observations
    const obsCol = app.findCollectionByNameOrId('route_observations')
    if (!obsCol.fields.getByName('video_timestamp')) {
      obsCol.fields.add(new TextField({ name: 'video_timestamp' }))
      app.save(obsCol)
    }

    // Seed the 18 new risk types
    const riskTypesCol = app.findCollectionByNameOrId('risk_types')
    const newRisks = [
      { name: 'Buracos', icon: 'CircleDashed', baseWeight: 3, category: 'Via' },
      { name: 'Pista escorregadia', icon: 'Waves', baseWeight: 4, category: 'Via' },
      { name: 'Animais na pista', icon: 'Bird', baseWeight: 4, category: 'Fauna' },
      {
        name: 'Falta de sinalização horizontal',
        icon: 'Minus',
        baseWeight: 3,
        category: 'Sinalização',
      },
      {
        name: 'Falta de sinalização vertical',
        icon: 'Signpost',
        baseWeight: 3,
        category: 'Sinalização',
      },
      { name: 'Vegetação obstruindo placa', icon: 'Leaf', baseWeight: 2, category: 'Sinalização' },
      {
        name: 'Acostamento inexistente',
        icon: 'ArrowRightToLine',
        baseWeight: 3,
        category: 'Infraestrutura',
      },
      {
        name: 'Acostamento em mau estado',
        icon: 'TriangleAlert',
        baseWeight: 2,
        category: 'Infraestrutura',
      },
      { name: 'Curva perigosa', icon: 'TrendingUp', baseWeight: 4, category: 'Via' },
      { name: 'Trecho com neblina freqüente', icon: 'CloudFog', baseWeight: 3, category: 'Clima' },
      {
        name: 'Iluminação pública deficiente',
        icon: 'LightbulbOff',
        baseWeight: 2,
        category: 'Infraestrutura',
      },
      { name: 'Pista estreita', icon: 'Minimize2', baseWeight: 3, category: 'Via' },
      {
        name: 'Pontes/Viadutos sem proteção',
        icon: 'Waypoints',
        baseWeight: 4,
        category: 'Infraestrutura',
      },
      { name: 'Obras na pista', icon: 'HardHat', baseWeight: 3, category: 'Via' },
      {
        name: 'Travessia de pedestres perigosa',
        icon: 'User',
        baseWeight: 4,
        category: 'Trânsito',
      },
      { name: 'Velocidade incompatível', icon: 'Gauge', baseWeight: 4, category: 'Trânsito' },
      { name: 'Drenagem obstruída', icon: 'Droplets', baseWeight: 2, category: 'Infraestrutura' },
      { name: 'Erosão na pista', icon: 'Mountain', baseWeight: 4, category: 'Via' },
    ]

    newRisks.forEach((risk) => {
      try {
        const existing = app.findFirstRecordByData('risk_types', 'name', risk.name)
        existing.set('icon', risk.icon)
        existing.set('baseWeight', risk.baseWeight)
        existing.set('category', risk.category)
        app.save(existing)
      } catch {
        const record = new Record(riskTypesCol)
        record.set('name', risk.name)
        record.set('icon', risk.icon)
        record.set('baseWeight', risk.baseWeight)
        record.set('category', risk.category)
        app.save(record)
      }
    })
  },
  (app) => {
    const risksCol = app.findCollectionByNameOrId('risks')
    if (risksCol.fields.getByName('video_timestamp')) {
      risksCol.fields.removeByName('video_timestamp')
      app.save(risksCol)
    }

    const obsCol = app.findCollectionByNameOrId('route_observations')
    if (obsCol.fields.getByName('video_timestamp')) {
      obsCol.fields.removeByName('video_timestamp')
      app.save(obsCol)
    }
  },
)
