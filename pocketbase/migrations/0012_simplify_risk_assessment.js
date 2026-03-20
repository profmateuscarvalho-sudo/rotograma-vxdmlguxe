migrate(
  (app) => {
    const risksCol = app.findCollectionByNameOrId('risks')

    if (!risksCol.fields.getByName('weight')) {
      risksCol.fields.add(new NumberField({ name: 'weight', min: 1, max: 4 }))
    }
    if (!risksCol.fields.getByName('audio')) {
      risksCol.fields.add(new FileField({ name: 'audio', maxSelect: 1, maxSize: 52428800 }))
    }
    app.save(risksCol)
  },
  (app) => {
    const risksCol = app.findCollectionByNameOrId('risks')
    risksCol.fields.removeByName('weight')
    risksCol.fields.removeByName('audio')
    app.save(risksCol)
  },
)
