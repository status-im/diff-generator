const fs = require('fs')
const log = require('loglevel')
const path = require('path')
const axios = require('axios')

const OUTPUT_PATH = '/tmp'

class Url {
  constructor(url) {
    this.url = url
  }

  async save() {
    const filename = this.url.split('/').pop()
    this.path = path.join(OUTPUT_PATH, filename)
    const writer = fs.createWriteStream(this.path)
    const resp = await axios.get(this.url)
    resp.data.pipe(writer)
  }
}
module.exports = Url
