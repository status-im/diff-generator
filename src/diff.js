const log = require('loglevel')
const join = require('path').join

const DB = require('./db')

const TEMP_PATH = '/var/tmp'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class Diff {
  constructor (diffoscope) {
    this.dos = diffoscope
  }

  async manual (obj) {
    const diff = await DB.Diff.query().insertGraph({
      name: obj.name,
      type: 'manual',
      status: 'new',
      builds: [
        { name: obj.name, type: 'manual', fileUrl: obj.east },
        { name: obj.name, type: 'manual', fileUrl: obj.west },
      ]
    })
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

  async updateDiffStatus(id, status) {
    return await DB.Diff.query().update({status}).where('id', id)
  }

  async run (diff) {
    let rval
    /* generate the diff report */
    try {
      rval = await this.dos.gen(
        diff.name, [diff.builds[0].fileUrl, diff.builds[1].fileUrl]
      )
    } catch(ex) {
      log.error('Diff failed: %s', ex.message)
      throw ex
      this.updateDiffStatus(diff.id, 'failure')
      return
    }
    this.updateDiffStatus(diff.id, 'success')
    return rval
  }

}

module.exports = Diff
