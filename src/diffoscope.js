const fs = require('fs')
const log = require('loglevel')
const join = require('path').join
const Axios = require('axios')
const rmdir = require("rimraf")
const exec = require('child_process').execFileSync

const TEMP_PATH = '/tmp/diffs/downloads'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class DiffoScope {
  constructor (output_path, temp_path = TEMP_PATH, jquery_url = JQUERY_URL) {
    this.output_path = output_path
    this.temp_path = temp_path
    this.jquery_url = jquery_url
  }

  async pull (path, url) {
    /* we download the files, otherwise we can't diff */
    const name = url.split('/').pop()
    fs.mkdirSync(dir)
    log.info(`Downloading: ${url}`)
    const resp = await Axios.request(url)
    fs.writeFileSync(path, resp.data)
    log.info(`Saved to: ${path}`)
    return { name, path, dir }
  }

  async pullAll (diffName, urls) {
    const path = join(TEMP_PATH, diffName)
    const files = await Promise.all(urls.map(u => this.pull(path, u)))
    return { path, files }
  }

  async gen (name, urls) {
    log.info(`Generating diff: ${name}`)
    /* are the files different? */
    let diff = false
    /* output path */
    const path = join(this.output_path, name)
    /* download URLs for diffing */
    const cached = await this.pullAll(url)
    /* assemble arguments */
    const args = [
      '--debug',
      '--no-progress',
      `--max-report-size=${MAX_REPORT_SIZE}`,
      `--html-dir=${path}`,
      cached.files[0].path, cached.files[1].path,
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
      rmdir(cached.path)
    }
    log.info(`Diff successful: ${path} (differnt: ${diff})`)
    return { diff, path, name }
  }
}

module.exports = DiffoScope
