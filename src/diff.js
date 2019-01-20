const log = require('loglevel')
const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class Diff {
  constructor(output_path) {
    this.output_path = output_path
  }

  async on(name, first, second, exclude = '') {
    const args = [
      '--no-progress',
      `--exclude="${exclude}"`,
      `--jquery="${JQUERY_URL}"`,
      `--max-report-size=${MAX_REPORT_SIZE}`,
      `--html-dir=${path.join(this.output_path, name)}`,
      first,
      second,
    ]
    const command = `diffoscope ${args.join(' ')}`
    try {
      log.info(`Running: ${command}`)
      const proc = await exec(command)
    } catch(ex) {
      log.error(ex.message)
      return null
    }
    log.info(`Success: ${proc}`)
  }
}

module.exports = Diff
