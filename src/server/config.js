const env = process.env
/* DEFAULTS */
module.exports = {
  LOG_LEVEL:     (env.LOG_LEVEL     || 'INFO'),
  LISTEN_PORT:   (env.LISTEN_PORT   || 8000),
  PUBLIC_DOMAIN: (env.PUBLIC_DOMAIN || `http://localhost:${this.LISTEN_PORT}`),
  DB_PATH:       (env.DB_PATH       || '/tmp/diff.db'),
  TEMP_PATH:     (env.TEMP_PATH     || '/tmp/diffs/tmp'),
  DIFFS_PATH:    (env.DIFFS_PATH    || '/tmp/diffs'),
}
