const log = require('loglevel')
const join = require('path').join

const TEMP_PATH = '/var/tmp'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class Diff {
  constructor (database, diffoscope) {
    this.db = database
    this.dos = diffoscope
  }

  async manual (east, west) {
    const diff = this.db.addDiff({east, west})
    return await this.run(diff)
  }

  async builds (builds) {
    const newest = builds[0]
    builds = builds.slice(1)
    builds.forEach(async build => {
      const diff = this.db.addDiff({east: newest, west: build})
      return await this.run(diff)
    })
  }

  async run (diff) {
    /* generate the diff report */
    try {
      return await this.dos.gen(
        join(diff.east.filename, 'vs', diff.west.filename),
        [diff.east.url, diff.west.url]
      )
    } catch(ex) {
      log.error('Diff failed: %s', ex.message)
      throw ex
      this.db.updateDiff(diff.id, 'FAILURE')
    }
  }

}

module.exports = Diff
