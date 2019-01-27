module.exports = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: '/tmp/diff.db'
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
  migrations: {
    tableName: 'migrations'
  },
}
