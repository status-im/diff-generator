const log = require('loglevel')
const Koa = require('koa')
const JSON = require('koa-json')
const Logger = require('koa-logger')
const JsonError = require('koa-json-error')
const JoiRouter = require('koa-joi-router')
const BodyParser = require('koa-bodyparser')

const Schema = require('./schema')

const App = (domain, db, diff) => {
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

  /* prefix for all paths defined below */
  router.prefix('/api')

  /* statis healthcheck response */
  router.get('/health', async (ctx) => {
    ctx.body = 'OK'
  })

  router.route({
    method: 'post',
    path: '/commit/:sha/build',
    validate: { type: 'json', body: Schema.build },
    handler: async (ctx) => {
      const id = await db.addBuild(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        url: `${domain}/commit/${ctx.params.sha}/${ctx.request.body.build_id}`,
      }
    },
  })

  router.route({
    method: 'post',
    path: '/commit/:sha/builds',
    validate: { type: 'json', body: Schema.builds },
    handler: async (ctx) => {
      const body = ctx.request.body
      Object.keys(body.artifacts).map(async platform =>
        await db.addBuild({
          commit: ctx.params.sha,
          platform: platform,
          build_id: body.build_id,
          build_url: body.build_url,
          artifact_url: body.artifacts[platform],
        })
      )
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        url: `${domain}/commit/${ctx.params.sha}/${ctx.request.body.build_id}`,
      }
    },
  })

  router.get('/builds', async (ctx) => {
    const commits = await db.getBuilds()
    ctx.body = {
      count: commits.length,
      data: commits,
    }
  })

  router.get('/commit/:sha/builds', async (ctx) => {
    const commits = await db.getBuilds({commit: ctx.params.sha})
    ctx.body = {
      count: commits.length,
      data: commits,
    }
  })

  router.route({
    method: 'post',
    path: '/manual',
    validate: { type: 'json', body: Schema.manual },
    handler: async (ctx) => {
      const body = ctx.request.body
      const path = `manual/${'y'}/vs/${'x'}`
      db.addDiff(body)
      diff.on(path, [body.left, body.right])
      ctx.status = 201
      ctx.body = { status:'ok', url: `${domain}/${path}` }
    },
  })
  
  router.get('/manual/:x/vs/:y', async (ctx) => {
    const diffs = await db.getDiffs({filename: ctx.params.x})
    ctx.body = { count: diffs.length, data: diffs }
  })

  router.get('/diffs', async (ctx) => {
    const diffs = await db.getDiffs()
    ctx.body = { count: diffs.length, data: diffs }
  })

  return app
}

module.exports = App
