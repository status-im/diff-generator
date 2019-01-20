const log = require('loglevel')
const Koa = require('koa')
const JSON = require('koa-json')
const Logger = require('koa-logger')
const JsonError = require('koa-json-error')
const JoiRouter = require('koa-joi-router')
const BodyParser = require('koa-bodyparser')

const Url = require('./Url')
const Schema = require('./schema')

const App = (diff) => {
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

  //router.route({
  //  method: 'post',
  //  path: '/commit/:id',
  //  validate: {
  //    type: 'json',
  //    body: Schema.commit,
  //  },
  //  handler: async (ctx) => {
  //    await ghc.update(ctx.params.pr)
  //    ctx.status = 201
  //    ctx.body = {status:'ok'}
  //  }
  //})
  
  router.route({
    method: 'post',
    path: '/manual',
    validate: {
      type: 'json',
      body: Schema.manual,
    },
    handler: async (ctx) => {
      const first  = new Url(ctx.request.body.files[0])
      const second = new Url(ctx.request.body.files[1])
      await first.save()
      await second.save()
      diff.on('xyz', first.path, second.path)
      ctx.status = 201
      ctx.body = {status:'ok'}
    }
  })
  
  return app
}

module.exports = App
