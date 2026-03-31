migrate(
  (app) => {
    const riskTypes = app.findCollectionByNameOrId('risk_types')

    if (!riskTypes.fields.getByName('road_context')) {
      riskTypes.fields.add(
        new SelectField({
          name: 'road_context',
          values: ['urbana', 'rodoviaria'],
          required: false,
        }),
      )
    }
    app.save(riskTypes)

    // Set default context to existing records
    try {
      const records = app.findRecordsByFilter('risk_types', '')
      for (let record of records) {
        if (!record.get('road_context')) {
          record.set('road_context', 'rodoviaria')
          app.saveNoValidate(record)
        }
      }
    } catch (err) {
      // ignore if no records found
    }

    const risks = app.findCollectionByNameOrId('risks')
    const photosField = risks.fields.getByName('photos')
    if (photosField) {
      photosField.maxSelect = 5
      app.save(risks)
    }
  },
  (app) => {
    const riskTypes = app.findCollectionByNameOrId('risk_types')
    if (riskTypes.fields.getByName('road_context')) {
      riskTypes.fields.removeByName('road_context')
      app.save(riskTypes)
    }

    const risks = app.findCollectionByNameOrId('risks')
    const photosField = risks.fields.getByName('photos')
    if (photosField) {
      photosField.maxSelect = 1
      app.save(risks)
    }
  },
)
