const fs = require('fs')
const log = require('loglevel')
const sqlite = require('better-sqlite3')

const urlToArtifact = (url) => ({
  name: url.split('/').pop(),
  type: url.split('.').pop(),
  url: url,
})

class DB {
  constructor(path, interval) {
    this.db = sqlite(path)
    this.initDB()
  }

  initDB () {
    /* make sure the database has correct schema */
    const schema = fs.readFileSync(`${__dirname}/schema.sql`, 'utf8')
    this.db.exec(schema)
    /* prepare helper methods */
    this.db.function('filename', (url) => url.split('/').pop())
    /* prepare statements to run */
    this._insertBuild = this.db.prepare(`
      INSERT INTO builds (sha, name, url, type, filename, created)
      VALUES (@commit, @name, @url, @type, filename(@url), CURRENT_TIMESTAMP)
    `)
    this._updateBuild = this.db.prepare(`
      UPDATE builds
      SET sha = @commit, name = @name, url = @url
      WHERE id == @id
    `)
    this._getBuilds = this.db.prepare(`
      SELECT * FROM builds
    `)
    this._getBuild = this.db.prepare(`
      SELECT * FROM builds
      WHERE sha = @commit AND name = @name AND type = @type
    `)
    /* diffs */
    this._insertDiffs = this.db.prepare(`
      INSERT INTO diffs (options, created, east, west)
      VALUES (@options, CURRENT_TIMESTAMP, @east, @west)
    `)
    this._getDiffs = this.db.prepare(`
      SELECT * FROM diffs
    `)
    this._getBuildsWithoutDiffs = this.db.prepare(`
      SELECT * FROM builds
      LEFT JOIN diffs ON
        (diffs.east = builds.id) OR
        (diffs.west = builds.id)
      WHERE east IS NULL AND west IS NULL
    `)
  }

  addBuild (obj) {
    log.info(`Storing build: ${obj.name}`)
    return this._insertBuild.run(obj)
  }

  getBuild (obj) {
    return this._getBuild.get(obj)
  }

  getBuilds (where = {}) {
    return this._getBuilds.all()
  }

  addBuildFromUrl (url) {
    return this.addBuild({commit: null, name: obj.name, url: obj.left, type: 'manual'})
  }

  addDiff (obj) {
    log.info(`Creating diff`)
    /* if given sides of diff are strings they are URLs and we need to add new builds */
    typeof obj.east === 'string' && this.addBuildFromUrl(obj.left)
    typeof obj.west === 'string' && this.addBuildFromUrl(obj.right)
    return this._insertDiff.run(obj)
  }

  getDiffs () {
    return this._getDiffs.all()
  }

  /**
   * Check for available Artifacts with the same commit that can be diffed.
   **/
  findDiffableBuilds (commit) {
    return this._getBuildsWithoutDiffs.all()
  }
}

module.exports = DB
