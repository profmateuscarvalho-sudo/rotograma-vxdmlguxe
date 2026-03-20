migrate(
  (app) => {
    const riskTypesCol = app.findCollectionByNameOrId('risk_types')
    const newRisks = [
      // Weight 4 (Critical)
      { name: 'Pista escorregadia', icon: 'Waves', baseWeight: 4, category: 'Via' },
      { name: 'Aquaplanagem', icon: 'Droplets', baseWeight: 4, category: 'Via' },
      { name: 'Curvas fechadas', icon: 'CornerUpRight', baseWeight: 4, category: 'Via' },
      { name: 'Interseções e retornos perigosos', icon: 'Split', baseWeight: 4, category: 'Via' },
      { name: 'Ultrapassagens perigosas', icon: 'ZapOff', baseWeight: 4, category: 'Trânsito' },
      { name: 'Animais na pista', icon: 'Dog', baseWeight: 4, category: 'Fauna' },
      { name: 'Proibido Ultrapassar', icon: 'Ban', baseWeight: 4, category: 'Sinalização' },

      // Weight 3 (High)
      {
        name: 'Buracos e deformações no pavimento',
        icon: 'Activity',
        baseWeight: 3,
        category: 'Via',
      },
      {
        name: 'Sinalização horizontal apagada',
        icon: 'Eraser',
        baseWeight: 3,
        category: 'Sinalização',
      },
      {
        name: 'Sinalização vertical insuficiente',
        icon: 'EyeOff',
        baseWeight: 3,
        category: 'Sinalização',
      },
      { name: 'Trechos com neblina', icon: 'Cloud', baseWeight: 3, category: 'Clima' },
      {
        name: 'Acostamento inexistente ou estreito',
        icon: 'ArrowLeftRight',
        baseWeight: 3,
        category: 'Infraestrutura',
      },
      {
        name: 'Acostamento degradado',
        icon: 'TrendingDown',
        baseWeight: 3,
        category: 'Infraestrutura',
      },
      {
        name: 'Entradas e saídas de veículos pesados',
        icon: 'Truck',
        baseWeight: 3,
        category: 'Trânsito',
      },
      { name: 'Travessia de pedestres', icon: 'User', baseWeight: 3, category: 'Trânsito' },
      { name: 'Ponte Estreita', icon: 'Shrink', baseWeight: 3, category: 'Infraestrutura' },
      { name: 'Trabalhadores na Pista', icon: 'HardHat', baseWeight: 3, category: 'Via' },
      { name: 'Pista Irregular/Ondulada', icon: 'Wind', baseWeight: 3, category: 'Via' },

      // Weight 2 (Medium)
      { name: 'Declives e aclives acentuados', icon: 'TrendingUp', baseWeight: 2, category: 'Via' },
      { name: 'Pontes', icon: 'Bridge', baseWeight: 2, category: 'Infraestrutura' },
      { name: 'Áreas urbanizadas', icon: 'Building2', baseWeight: 2, category: 'Infraestrutura' },
      { name: 'Área Escolar', icon: 'GraduationCap', baseWeight: 2, category: 'Trânsito' },
      { name: 'Vento Lateral Forte', icon: 'Wind', baseWeight: 2, category: 'Clima' },

      // Weight 1 (Low)
      {
        name: 'Falha de comunicação (sinal de celular)',
        icon: 'SignalLow',
        baseWeight: 1,
        category: 'Infraestrutura',
      },
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
    // Optionally remove the seeded items if migrating down
  },
)
