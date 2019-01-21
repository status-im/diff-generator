const log = require('loglevel')
const Joi = require('joi')
const Loki = require('lokijs')
const merge = require('deepmerge')

class DB {
  constructor(path, interval) {
    this.db = new Loki(path, {
      autoload: true,
      autosave: true,
      autosaveInterval: interval,
      autoloadCallback: this.initDB.bind(this),
    })
  }

  initDB() {
    this.builds = this.db.getCollection('builds')
    if (!this.builds) {
      this.builds = this.db.addCollection('builds')
    }
    /* just to make sure we save on close */
    this.db.on('close', () => this.save())
  }

  async save () {
    this.db.saveDatabase((err) => {
      if (err) { console.error('error saving', err) }
    })
  }

  async updateBuild (obj) {
    log.info(`Updating commit: ${obj.commit}`)
    let rval = await this.builds.update(obj)
    return rval.$loki
  }

  async insertBuild (obj) {
    log.info(`Storing commit: ${obj.commit}`)
    let rval = await this.builds.insert(obj)
    return rval.$loki
  }

  async addBuild (obj) {
    console.dir(obj)
    let rval = await this.getBuild(obj.commit)
    if (rval !== null) {
      return await this.updateBuild(merge(rval, obj))
    } else {
      return await this.insertBuild(obj)
    }
  }

  async getBuild (commit) {
    return await this.builds.findOne({commit: commit})
  }

  async getBuilds (query) {
    let req = await this.builds.chain()
    if (query) {
      req = req.find(query)
    }
    const builds = await req.simplesort('$loki').data()
    /* strip the loki attributes */
    return builds.map((c) => {
      const {$loki, meta, ...comment} = c
      return comment
    })
  }
}

module.exports = DB
