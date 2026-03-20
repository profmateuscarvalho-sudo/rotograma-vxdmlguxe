migrate(
  (app) => {
    const obsCol = new Collection({
      name: 'route_observations',
      type: 'base',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      fields: [
        {
          name: 'route_id',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('routes').id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'note', type: 'text', required: false },
        { name: 'audio', type: 'file', required: false, maxSelect: 1, maxSize: 52428800 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(obsCol)

    const riskTypesCol = app.findCollectionByNameOrId('risk_types')
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
    const obsCol = app.findCollectionByNameOrId('route_observations')
    app.delete(obsCol)
  },
)
