const log = require('loglevel')
const Koa = require('koa')
const mount = require('koa-mount')
const serve = require('koa-static')
const GraphQL = require('koa-graphql')
const JSON = require('koa-json')
const Logger = require('koa-logger')
const JsonError = require('koa-json-error')
const JoiRouter = require('koa-joi-router')
const BodyParser = require('koa-bodyparser')

const DB = require('./db')
const conf = require('./config')
const Schema = require('./schema')

const App = (diffmgr, gQLschema) => {
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

  /* host the public folder */
  app.use(serve('public'))
  /* Host location of the diffs */
  app.use(mount('/view', serve(conf.DIFFS_PATH)))

  /* Declare the GraphQL endpoint */
  app.use(mount('/graphql', GraphQL({schema: gQLschema, graphiql: true})))

  /* Prefix for all paths defined below */
  router.prefix('/api')

  /* Static healthcheck response */
  router.get('/health', (ctx) => { ctx.body = 'OK' })

  /* Diffs */
  router.get('/diffs', async (ctx) => {
    const diffs = await DB.Diff.query().eager('builds')
    ctx.body = { count: diffs.length, data: diffs }
  })

  router.get('/diffs/:name', async (ctx) => {
    ctx.body = await DB.Diff.query().eager('builds')
      .where('name', ctx.request.params.name)
  })

  /* Builds */
  router.get('/builds', async (ctx) => {
    builds = await DB.Build.query().eager('diffs')
    ctx.body = { count: builds.length, data: builds }
  })

  router.get('/builds/:name', async (ctx) => {
    ctx.body = await DB.Build.query().eager('diffs.builds')
      .where('name', ctx.request.params.name)
  })

  router.post('/builds', async (ctx) => {
    let diff
    const build = await DB.Build.query().insert(ctx.request.body)
    const older = await diffmgr.findLastDiffableBuild(build)
    if (older) {
       diff = await diffmgr.build(build, older)
    }
    ctx.body = {
      status: 'ok',
      diff: {
        build: older.name,
        file: older.filename,
        url: diff ? `${conf.PUBLIC_DOMAIN}/view/${diff}` : null,
      }
    }
  })

  /* Manual */
  router.route({
    method: 'post',
    path: '/diffs/manual',
    validate: { type: 'json', body: Schema.manual },
    handler: async (ctx) => {
      const rval = await diffmgr.manual(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        status:'ok',
        url: `${conf.PUBLIC_DOMAIN}/view/${rval.name}`
      }
    },
  })

  return app
}

module.exports = App
