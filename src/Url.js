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
    this.name = this.url.split('/').pop()
    this.path = path.join(OUTPUT_PATH, this.name)
    const resp = await Axios.request(this.url)
    fs.writeFileSync(this.path, resp.data);
  }
  
  close() {
  }
}
module.exports = Url
