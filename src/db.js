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
    this.commits = this.db.getCollection('commits')
    if (!this.commits) {
      this.commits = this.db.addCollection('commits')
    }
    /* just to make sure we save on close */
    this.db.on('close', () => this.save())
  }

  async save () {
    this.db.saveDatabase((err) => {
      if (err) { console.error('error saving', err) }
    })
  }

  async updateCommit (sha, obj) {
    log.info(`Updating commit: ${sha}`)
    rval = await this.commits.update(obj)
    return rval.$loki
  }

  async insertCommit (sha, obj) {
    log.info(`Storing commit: ${sha}`)
    rval = await this.commits.insert({sha, ...obj})
    return rval.$loki
  }

  async addCommit (sha, obj) {
    let rval = await this.getCommit(sha)
    if (rval !== null) {
      return await this.updateCommit(sha, merge(rval, obj))
    } else {
      return await this.insertCommit(sha, obj)
    }
  }

  async getCommit (sha) {
    return await this.commits.findOne({sha: sha})
  }

  async getCommits () {
    const commits = await this.commits.chain().simplesort('$loki').data()
    /* strip the loki attributes */
    return commits.map((c) => {
      const {$loki, meta, ...comment} = c
      return comment
    })
    
  }
}

module.exports = DB
