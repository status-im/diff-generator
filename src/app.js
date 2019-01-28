const log = require('loglevel')
const Koa = require('koa')
const mount = require('koa-mount')
const GraphQL = require('koa-graphql')
const JSON = require('koa-json')
const Logger = require('koa-logger')
const JsonError = require('koa-json-error')
const JoiRouter = require('koa-joi-router')
const BodyParser = require('koa-bodyparser')

const DB = require('./db')
const Schema = require('./schema')

const App = (domain, diff, gQLschema) => {
  const app = new Koa()
  const router = new JoiRouter()
  
  app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
  })

  app.use(Logger((str, args) => log.info(str)))
     .use(JSON({pretty: true}))
     .use(JsonError())
     .use(BodyParser({onerror:console.error}))
     .use(router.middleware())

  /* Declare the GraphQL endpoint */
  app.use(mount('/graphql', GraphQL({schema: gQLschema, graphiql: true})))

  /* Prefix for all paths defined below */
  router.prefix('/api')

  /* Static healthcheck response */
  router.get('/health', (ctx) => { ctx.body = 'OK' })

  router.get('/builds', async (ctx) => {
    const builds = await DB.Build.query().eager('diffs')
    ctx.body = { count: builds.length, data: builds }
  })

  router.get('/diffs', async (ctx) => {
    const diffs = await DB.Diff.query().eager('builds')
    ctx.body = { count: diffs.length, data: diffs }
  })

  router.post('/builds', async (ctx) => {
    const rval = await DB.Build.query().insert(ctx.request.body)
    ctx.body = { status: 'ok' }
  })

  router.route({
    method: 'post',
    path: '/manual',
    validate: { type: 'json', body: Schema.manual },
    handler: async (ctx) => {
      const rval = await diff.manual(ctx.request.body)
      ctx.status = 201
      ctx.body = { status:'ok', url: `${domain}/${rval.name}` }
    },
  })

  return app
}

module.exports = App
