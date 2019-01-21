const log = require('loglevel')
const Logger = require('koa-logger')

const DB = require('./db')
const App = require('./app')
const Diff = require('./diff')

/* DEFAULTS */
const LOG_LEVEL        = process.env.LOG_LEVEL        || 'INFO'
const LISTEN_PORT      = process.env.LISTEN_PORT      || 8000
const PUBLIC_DOMAIN    = process.env.PUBLIC_DOMAIN    || `http://localhost:${LISTEN_PORT}`
const DB_PATH          = process.env.DB_PATH          || '/tmp/diffgen.db'
const DB_SAVE_INTERVAL = process.env.DB_SAVE_INTERVAL || 5000
const DIFF_OUTPUT_PATH = process.env.DIFF_OUTPUT_PATH || '/tmp/diffs'

/* set the logging level (TRACE, DEBUG, INFO, WARN, ERROR, SILENT) */
log.setDefaultLevel(log.levels[LOG_LEVEL])

const db = new DB(DB_PATH, DB_SAVE_INTERVAL)
const diff = new Diff(DIFF_OUTPUT_PATH)
const app = App(PUBLIC_DOMAIN, db, diff)

app.use(Logger())

app.listen(LISTEN_PORT)

console.log(`Started at: http://localhost:${LISTEN_PORT}/`)
