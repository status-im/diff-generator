const fs = require('fs')
const log = require('loglevel')
const sqlite = require('better-sqlite3')

const urlToArtifact = (url) => ({
  name: url.split('/').pop(),
  type: url.split('.').pop(),
  url: url,
})

class DB {
  constructor(path) {
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
      INSERT INTO builds (\`commit\`, name, url, type, filename, created)
      VALUES (@commit, @name, @url, @type, filename(@url), CURRENT_TIMESTAMP)
    `)
    this._updateBuild = this.db.prepare(`
      UPDATE builds
         SET \`commit\` = @commit, name = @name, url = @url
       WHERE id == @id
    `)
    this._getBuilds = this.db.prepare(`
      SELECT * FROM builds
    `)
    this._getBuild = this.db.prepare(`
      SELECT * FROM builds
       WHERE \`commit\` = @commit
         AND name = @name
         AND type = @type
    `)
    this._getBuildById = this.db.prepare(`
      SELECT * FROM builds
       WHERE id = ?
    `)
    /* diffs */
    this._insertDiff = this.db.prepare(`
      INSERT INTO diffs (options, created, east, west)
      VALUES (@options, CURRENT_TIMESTAMP, @east, @west)
    `)
    this._updateDiff = this.db.prepare(`
      UPDATE diffs
         SET status = @status
       WHERE id == @id
    `)
    this._getDiffById = this.db.prepare(`
      SELECT *
        FROM diffs
       WHERE id = ?
    `)
    this._getDiffs = this.db.prepare(`
      SELECT * FROM diffs
    `)
    this._getBuildsWithoutDiffs = this.db.prepare(`
      SELECT builds.id AS id, \`commit\`, name, url, type, filename
        FROM builds
      LEFT JOIN diffs ON
        (diffs.east = builds.id) OR
        (diffs.west = builds.id)
      WHERE east IS NULL
        AND west IS NULL
        AND builds.\`commit\` = ?
      ORDER BY builds.id DESC
    `)
  }

  insertBuild (obj) {
    log.info(`Storing build: ${obj.url} (${obj.name})`)
    return this._insertBuild.run(obj).lastInsertRowid
  }

  getBuild (obj) {
    return this._getBuild.get(obj)
  }

  getBuildById (id) {
    return this._getBuildById.get(id)
  }

  updateBuild (obj) {
    log.info(`Updating build: ${obj.name}`)
    return this._updateBuild.run(obj).lastInsertRowid
  }

  getBuildById (id) {
    return this._getBuildById.get(id)
  }

  getBuilds () {
    return this._getBuilds.all()
  }

  addBuild (obj) {
    const build = this.getBuild(obj)
    if (!build) {
      return this.insertBuild(obj)
    } else {
      return this.updateBuild(obj)
    }
  }

  addBuildFromUrl (url) {
    return this.insertBuild({
      commit: null,
      name: 'manual',
      type: 'manual',
      url: url,
    })
  }

  addDiff (obj) {
    log.info(`Creating diff`)
    /* if given sides of diff are strings they are URLs and we need to add new builds */
    if (typeof obj.east === 'string') { obj.east = this.addBuildFromUrl(obj.east) }
    if (typeof obj.west === 'string') { obj.west = this.addBuildFromUrl(obj.west) }
    if (typeof obj.east === 'object') { obj.east = obj.east.id }
    if (typeof obj.west === 'object') { obj.west = obj.west.id }
    const rval = this._insertDiff.run({options: 'DEFAULT', ...obj})
    return this.getDiff(rval.lastInsertRowid)
  }

  updateDiff (id, status) {
    log.info(`Updating diff: ${id} (status: ${status})`)
    return this._updateDiff.run({id, status}).lastInsertRowid
  }

  getDiff (id) {
    const diff = this._getDiffById.get(id)
    return {
      ...diff,
      east: this.getBuildById(diff.east),
      west: this.getBuildById(diff.west),
    }
  }

  getDiffs () {
    return this._getDiffs.all()
  }

  /* Check for available Artifacts with the same commit that can be diffed. */
  findDiffableBuilds (commit) {
    return this._getBuildsWithoutDiffs.all(commit)
  }
}

module.exports = DB
