const fs = require('fs')
const log = require('loglevel')
const path = require('path')
const Axios = require('axios')

const OUTPUT_PATH = '/tmp'

class Url {
  constructor(url) {
    this.url = url
  }

  async save() {
    const filename = this.url.split('/').pop()
    this.path = path.join(OUTPUT_PATH, filename)
    const resp = await Axios.request(this.url)
    fs.writeFileSync(this.path, resp.data);
  }
  
  close() {
  }
}
module.exports = Url
