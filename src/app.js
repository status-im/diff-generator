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

  router.get('/health', async (ctx) => {
    ctx.body = 'OK'
  })

  router.route({
    method: 'post',
    path: '/commit/:sha/builds',
    validate: { type: 'json', body: Schema.build },
    handler: async (ctx) => {
      let id = await db.addBuild(
        { commit: ctx.params.sha, ...ctx.request.body }
      )
      ctx.status = 201
      ctx.body = {
        status: 'ok',
        url: [
          domain, 'commit',
          ctx.params.sha,
          ctx.request.body.build_id
        ].join('/')
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
      diff.on('xyz', ctx.request.body.files)
      ctx.status = 201
      ctx.body = {
        status:'ok',
        url: `${domain}/manual/${'y'}/vs/${'x'}`
      }
    },
  })
  
  return app
}

module.exports = App
