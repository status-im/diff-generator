const fs = require('fs')
const log = require('loglevel')
const join = require('path').join
const util = require('util')
const Axios = require('axios')
const exec = util.promisify(require('child_process').exec)

const TEMP_PATH = '/var/tmp'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class Diff {
  constructor (db, output_path) {
    this.db = db
    this.output_path = output_path
  }

  async pull (url) {
    /* we download the files, otherwise we can't diff */
    const name = url.split('/').pop()
    const path = join(TEMP_PATH, name)
    const resp = await Axios.request(url)
    fs.writeFileSync(path, resp.data)
    return { name, path }
  }

  async manual (east, west) {
    const diff = this.db.addDiff({east, west})
    return await this.run(diff)
  }

  async run (diff) {
    /* generate the diff report */
    try {
      return await this.gen(
        join(east.filename, 'vs', west.fielanem),
        [east.url, west.url]
      )
    } catch(ex) {
      log.error('Diff failed: %s', ex.message)
      this.db.updateDiff(diff, 'FAILURE')
    }
  }

  async gen (name, urls) {
    const out_path = join(this.output_path, name)
    /* download URLs for diffing */
    const files = urls.map(u => this.pull(u))
    /* assemble arguments */
    const args = [
      '--no-progress',
      `--jquery="${JQUERY_URL}"`,
      `--max-report-size=${MAX_REPORT_SIZE}`,
      `--html-dir=${out_path}`,
      files[0].path, files[1].path,
    ]
    const command = `diffoscope ${args.join(' ')}`
    /* execute */
    try {
      log.info(`Running: ${command}`)
      const proc = await exec(command)
    } catch(ex) {
      log.error(ex.message)
      throw ex
    } finally { /* cleanup downloaded files */
      files.forEach(f => fs.unlink(f.path))
    }
    log.info(`Success: ${proc}`)
    return out_path
  }
}

module.exports = Diff
