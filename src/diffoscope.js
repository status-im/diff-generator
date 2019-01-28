const fs = require('fs')
const log = require('loglevel')
const join = require('path').join
const Axios = require('axios')
const shortid = require('shortid')
const exec = require('child_process').execFileSync

const TEMP_PATH = '/var/tmp'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class DiffoScope {
  constructor (output_path, temp_path = TEMP_PATH, jquery_url = JQUERY_URL) {
    this.output_path = output_path
    this.temp_path = temp_path
    this.jquery_url = jquery_url
  }

  async pull (url) {
    /* we download the files, otherwise we can't diff */
    const name = url.split('.').pop()
    const dir = join(TEMP_PATH, shortid.generate())
    const path = join(dir, name)
    fs.mkdirSync(dir)
    log.debug(`Downloading: ${url}`)
    const resp = await Axios.request(url)
    fs.writeFileSync(path, resp.data)
    log.debug(`Saved to: ${path}`)
    return { name, path }
  }

  async gen (name, urls) {
    log.info(`Generating diff: ${name}`)
    /* are the files different? */
    let diff = false
    /* output path */
    const path = join(this.output_path, name)
    /* download URLs for diffing */
    const files = await Promise.all(urls.map(u => this.pull(u)))
    /* assemble arguments */
    const args = [
      '--debug',
      '--no-progress',
      `--max-report-size=${MAX_REPORT_SIZE}`,
      `--html-dir=${path}`,
      files[0].path, files[1].path,
    ]
    const command = `diffoscope ${args.join(' ')}`
    /* execute */
    try {
      log.info(`Running: ${command}`)
      let proc = exec('diffoscope', args, {stdio: 'inherit'})
    } catch(ex) {
      /* 0 mean same, 1 minens different, >1 means error */
      if (ex.status === 1) {
        diff = true
      } else {
        log.error(`Status code: ${ex.status}`)
        log.error(`Error: ${ex.message}`)
        throw ex
      }
    } finally { /* cleanup downloaded files */
      files.forEach(f => {
        log.debug(`Removing: ${f.path}`)
        fs.unlinkSync(f.path)
      })
    }
    log.info(`Diff successful: ${path} (differnt: ${diff})`)
    return { diff, path, name }
  }
}

module.exports = DiffoScope
