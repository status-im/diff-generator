const fs = require('fs')
const log = require('loglevel')
const join = require('path').join
const Axios = require('axios')
const rmdir = require("rimraf")
const exec = require('child_process').execFileSync

const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class DiffoScope {
  constructor (output_path, temp_path, jquery_url = JQUERY_URL) {
    this.output_path = output_path
    this.temp_path = temp_path
    this.jquery_url = jquery_url
    this.createDirs()
  }

  createDirs () {
    for (let dir of [this.output_path, this.temp_path]) {
      if (!fs.existsSync(dir)) {
        log.info(`Creating dir: ${dir}`)
        fs.mkdirSync(dir, { recursive: true })
      }
    }
  }

  async pull (dir, url) {
    /* we download the files, otherwise we can't diff */
    const name = url.split('/').pop()
    const path = join(dir, name)
    log.info(`Downloading: ${url}`)
    const resp = await Axios.request(url)
    fs.writeFileSync(path, resp.data)
    log.info(`Saved to: ${path}`)
    return { name, path, dir }
  }

  async pullAll (name, urls) {
    const dir = join(this.temp_path, name)
    fs.mkdirSync(dir)
    const files = await Promise.all(urls.map(u => this.pull(dir, u)))
    return { dir, files }
  }

  async gen (name, urls) {
    log.info(`Generating diff: ${name}`)
    /* are the files different? */
    let diff = false
    /* output path */
    const path = join(this.output_path, name)
    /* download URLs for diffing */
    const cached = await this.pullAll(name, urls)
    /* assemble arguments */
    const args = [
      '--debug',
      '--no-progress',
      '--force-details',
      '--css=/common.css',
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
      log.info(`Deleting: ${cached.dir}`)
      rmdir.sync(cached.dir)
    }
    log.info(`Diff successful: ${path} (differnt: ${diff})`)
    return { diff, path, name }
  }
}

module.exports = DiffoScope
