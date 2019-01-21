const log = require('loglevel')
const SQ = require('sequelize')

class DB {
  constructor(path, interval) {
    this.db = new SQ({
      dialect: 'sqlite',
      storage: path,
      operatorsAliases: false,
    })
    this.initDB()
  }

  initDB () {
    /* define the schema for the database */
    this.Build = this.db.define('builds', {
      id: { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },
      commit: SQ.STRING,
      build_id: SQ.STRING,
      build_url: SQ.STRING,
      platform: SQ.STRING,
      artifact_url: SQ.STRING,
    })
    this.Diff = this.db.define('diffs', {
      id: { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },
      artifact_a: { type: SQ.INTEGER, references: { model: this.Build, key: 'id' } },
      artifact_b: { type: SQ.INTEGER, references: { model: this.Build, key: 'id' } },
    })
    this.Build.sync()
    this.Diff.sync()
  }

  async addBuild (obj) {
    let rval = await this.getBuild(obj)
    if (rval !== null) {
      log.info(`Updating commit: ${obj.commit}`)
      return await rval.update(obj)
    } else {
      log.info(`Storing commit: ${obj.commit}`)
      return await this.insertBuild(obj)
    }
  }

  async getBuild (obj) {
    return await this.Build.findOne({ where: {
      commit: obj.commit,
      build_id: obj.build_id,
      platform: obj.platform,
    }})
  }

  async getBuilds (where = {}) {
    return await this.Build.findAll({ where })
  }
}

module.exports = DB
