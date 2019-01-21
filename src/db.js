const log = require('loglevel')
const SQ = require('sequelize')

const urlToArtifact = (url) => ({
  name: url.split('/').pop(),
  type: url.split('.').pop(),
  url: url,
})

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
    /* Build is a success CI job that provides one or multiple artifacts */
    this.Build = this.db.define('builds', {
      id:     { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },
      commit: { type: SQ.STRING, required: true },
      name:   { type: SQ.STRING, required: true },
      url:    { type: SQ.STRING, required: true },
    }, {underscored: true})
    /* Artifact is a file, one of 2 used in a Diff */
    this.Artifact = this.db.define('artifacts', {
      id:     { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },
      url:    { type: SQ.STRING,  required: true },
      name:   { type: SQ.STRING,  required: true },
      type:   { type: SQ.STRING },
    }, {underscored: true})
    this.Build.hasMany(this.Artifact, {as: 'Artifacts'})
    /* for many-to-many relationships */
    this.ArtifactDiffs = this.db.define('artifact_diffs')
    /* Diff is a generated report on difference between two artifacts */
    this.Diff = this.db.define('diffs', {
      id:     { type: SQ.INTEGER, primaryKey: true, autoIncrement: true },
      options:{ type: SQ.STRING,  required: false },
    }, {underscored: true})
    /* TODO set limit of 2 for this association */
    this.Diff.belongsToMany(this.Artifact, {through: this.ArtifactDiffs});
    this.Artifact.belongsToMany(this.Diff, {through: this.ArtifactDiffs});
    /* save changes */
    this.Build.sync()
    this.Artifact.sync()
    this.Diff.sync()
    this.ArtifactDiffs.sync()
  }

  async addBuild (obj) {
    let rval = await this.getBuild(obj)
    if (rval !== null) {
      log.info(`Updating commit: ${obj.commit}`)
      return await rval.update(obj)
    } else {
      log.info(`Storing commit: ${obj.commit}`)
      return await this.Build.build(obj).save()
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

  async addBuild (obj) {
    let rval = await this.getBuild(obj)
    if (rval !== null) {
      log.info(`Updating commit: ${obj.commit}`)
      return await rval.update(obj)
    } else {
      log.info(`Storing commit: ${obj.commit}`)
      return await this.Build.build(obj).save()
    }
  }

  async addDiff (obj) {
    log.info(`Creating diff`)
    const left = await this.Artifact.build(urlToArtifact(obj.left)).save()
    const right = await this.Artifact.build(urlToArtifact(obj.right)).save()
    const diff = await this.Diff.build({options: obj.options}).save()
    await diff.addArtifact(left)
    await diff.addArtifact(right)
    return diff.save()
  }

  async getDiffs () {
    return this.Diff.findAll({include: [this.Artifact]})
  }
}

module.exports = DB
