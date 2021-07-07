const routes = require('./routes')
const apis = require('./apis')
const auth = require('./modules/auth')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
  app.use('/auth', auth)
}