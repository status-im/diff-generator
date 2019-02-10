const log = require('loglevel')
const logPrefix = require('@natlibfi/loglevel-message-prefix')
const Logger = require('koa-logger')
const Knex = require('knex')
const { Model } = require('objection')
const { graphql } = require('graphql')
const { builder } = require('objection-graphql')

const DB = require('./db')
const App = require('./app')
const conf = require('./config')
const DiffManager = require('./DiffManager')
const DiffoScope = require('./diffoscope')

/* set the logging level (TRACE, DEBUG, INFO, WARN, ERROR, SILENT) */
log.setDefaultLevel(log.levels[conf.LOG_LEVEL])
logPrefix(log, {prefixFormat:'%p:'})

/* Define connection to the DataBase */
const knex = Knex({
  client: 'sqlite3',
  debug: false,
  useNullAsDefault: true,
  connection: { filename: conf.DB_PATH },
  migrations: { tableName: 'migrations' },
  log: { warn: log.warn, error: log.error, info: log.info },
})

/* Give the knex object to objection */
Model.knex(knex)

/* Define the GraphQL schema */
const gQLschema = builder()
  .model(DB.Diff)
  .model(DB.Build)
  .build()

const dos = new DiffoScope(conf.DIFFS_PATH, conf.TEMP_PATH)
const diffmgr = new DiffManager(dos)
const app = App(diffmgr, gQLschema)

app.use(Logger())

app.listen(conf.LISTEN_PORT)

console.log(`Started at: http://localhost:${conf.LISTEN_PORT}/`)
