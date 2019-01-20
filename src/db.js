const log = require('loglevel')
const Joi = require('joi')
const Loki = require('lokijs')

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
    this.comments = this.db.getCollection('comments')
    if (!this.comments) {
      this.comments = this.db.addCollection('comments')
    }
    /* just to make sure we save on close */
    this.db.on('close', () => this.save())
  }

  async save () {
    this.db.saveDatabase((err) => {
      if (err) { console.error('error saving', err) }
    })
  }

  async addCommit (sha, obj) {
    log.info(`Storing commit ${sha}: ${obj}`)
    return await this.commits.insert({sha, ...obj})
  }

  async getCommit (sha) {
    const rval = await this.commits.findOne({sha: sha})
    return rval ? rval.comment_id : null
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
