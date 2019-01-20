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
  constructor (output_path) {
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

  async on (name, urls) {
    /* download URLs for diffing */
    const files = urls.map(u => this.pull(u))
    /* assemble arguments */
    const args = [
      '--no-progress',
      `--jquery="${JQUERY_URL}"`,
      `--max-report-size=${MAX_REPORT_SIZE}`,
      `--html-dir=${join(this.output_path, name)}`,
      files[0].path, files[1].path,
    ]
    const command = `diffoscope ${args.join(' ')}`
    /* execute */
    try {
      log.info(`Running: ${command}`)
      const proc = await exec(command)
    } catch(ex) {
      log.error(ex.message)
      return null
    } finally { /* cleanup downloaded files */
      files.forEach(f => fs.unlink(f.path))
    }
    log.info(`Success: ${proc}`)
  }
}

module.exports = Diff
