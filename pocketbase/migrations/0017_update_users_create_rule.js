migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('users')
    collection.createRule = "@request.auth.role = 'admin'"
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('users')
    collection.createRule = ''
    app.save(collection)
  },
)
