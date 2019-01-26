const log = require('loglevel')
const logPrefix = require('@natlibfi/loglevel-message-prefix')
const Logger = require('koa-logger')

const DB = require('./db')
const App = require('./app')
const Diff = require('./diff')
const DiffoScope = require('./diffoscope')

/* DEFAULTS */
const LOG_LEVEL        = process.env.LOG_LEVEL        || 'INFO'
const LISTEN_PORT      = process.env.LISTEN_PORT      || 8000
const PUBLIC_DOMAIN    = process.env.PUBLIC_DOMAIN    || `http://localhost:${LISTEN_PORT}`
const DB_PATH          = process.env.DB_PATH          || '/tmp/diffgen.db'
const TEMP_PATH        = process.env.DB_PATH          || '/tmp/download'
const DIFF_OUTPUT_PATH = process.env.DIFF_OUTPUT_PATH || '/tmp/diffs'

/* set the logging level (TRACE, DEBUG, INFO, WARN, ERROR, SILENT) */
log.setDefaultLevel(log.levels[LOG_LEVEL])
logPrefix(log, {prefixFormat:'%p:'})

const db = new DB(DB_PATH)
const dos = new DiffoScope(DIFF_OUTPUT_PATH, TEMP_PATH)
const diff = new Diff(db, dos)
const app = App(PUBLIC_DOMAIN, db, diff)

app.use(Logger())

app.listen(LISTEN_PORT)

console.log(`Started at: http://localhost:${LISTEN_PORT}/`)
