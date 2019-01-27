const log = require('loglevel')
const Koa = require('koa')
const mount = require('koa-mount')
const GraphQL = require('koa-graphql');
const JSON = require('koa-json')
const Logger = require('koa-logger')
const JsonError = require('koa-json-error')
const JoiRouter = require('koa-joi-router')
const BodyParser = require('koa-bodyparser')

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
     .use(router.middleware())
     .use(BodyParser({onerror:console.error}))

  /* Declare the GraphQL endpoint */
  app.use(mount('/graphql', GraphQL({
      schema: gQLschema,
      graphiql: true,
    })))

  /* Prefix for all paths defined below */
  router.prefix('/api')

  /* Static healthcheck response */
  router.get('/health', async (ctx) => {
    ctx.body = 'OK'
  })

  //router.route({
  //  method: 'post',
  //  path: '/commit/:sha/build',
  //  validate: { type: 'json', body: Schema.build },
  //  handler: async (ctx) => {
  //    db.addBuild(ctx.request.body)
  //    const builds = db.findDiffableBuilds(ctx.params.sha)
  //    if (builds.length > 1) {
  //      diff.builds(builds)
  //    }
  //    ctx.status = 201
  //    ctx.body = { status: 'ok' }
  //  },
  //})

  //router.get('/builds', async (ctx) => {
  //  const commits = db.getBuilds()
  //  ctx.body = {
  //    count: commits.length,
  //    data: commits,
  //  }
  //})

  //router.get('/commit/:sha/builds', async (ctx) => {
  //  const commits = db.getBuilds({commit: ctx.params.sha})
  //  ctx.body = {
  //    count: commits.length,
  //    data: commits,
  //  }
  //})

  //router.route({
  //  method: 'post',
  //  path: '/manual',
  //  validate: { type: 'json', body: Schema.manual },
  //  handler: async (ctx) => {
  //    const body = ctx.request.body
  //    const path = await diff.manual(body.east, body.west)
  //    ctx.status = 201
  //    ctx.body = { status:'ok', url: `${domain}/${path}` }
  //  },
  //})
  //
  //router.get('/manual/:x/vs/:y', async (ctx) => {
  //  const diffs = db.getDiffs({filename: ctx.params.x})
  //  ctx.body = { count: diffs.length, data: diffs }
  //})

  //router.get('/diffs', async (ctx) => {
  //  const diffs = db.getDiffs()
  //  ctx.body = { count: diffs.length, data: diffs }
  //})

  //router.get('/todiff', async (ctx) => {
  //  const diffs = db.findDiffableBuilds()
  //  ctx.body = { count: diffs.length, data: diffs }
  //})

  return app
}

module.exports = App
