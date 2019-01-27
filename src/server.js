const log = require('loglevel')
const logPrefix = require('@natlibfi/loglevel-message-prefix')
const Logger = require('koa-logger')
const Knex = require('knex')
const { Model } = require('objection')
const { graphql } = require('graphql')
const { builder } = require('objection-graphql')

const DB = require('./db')
const App = require('./app')
const Diff = require('./diff')
const DiffoScope = require('./diffoscope')

/* DEFAULTS */
const LOG_LEVEL     = process.env.LOG_LEVEL     || 'INFO'
const LISTEN_PORT   = process.env.LISTEN_PORT   || 8000
const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN || `http://localhost:${LISTEN_PORT}`
const DB_PATH       = process.env.DB_PATH       || '/tmp/diff.db'
const TEMP_PATH     = process.env.TEMP_PATH     || '/tmp/download'
const DIFFS_PATH    = process.env.DIFFS_PATH    || '/tmp/diffs'

/* set the logging level (TRACE, DEBUG, INFO, WARN, ERROR, SILENT) */
log.setDefaultLevel(log.levels[LOG_LEVEL])
logPrefix(log, {prefixFormat:'%p:'})

/* Define connection to the DataBase */
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: { filename: DB_PATH },
  migrations: { tableName: 'migrations' },
})

/* Give the knex object to objection */
Model.knex(knex);

/* Define the GraphQL schema */
const gQLschema = builder()
  .model(DB.Diff)
  .model(DB.File)
  .model(DB.Build)
  .build()

const dos = new DiffoScope(DIFFS_PATH, TEMP_PATH)
const diff = new Diff(dos)
const app = App(PUBLIC_DOMAIN, diff, gQLschema)

app.use(Logger())

app.listen(LISTEN_PORT)

console.log(`Started at: http://localhost:${LISTEN_PORT}/`)
