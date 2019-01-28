const log = require('loglevel')
const join = require('path').join

const DB = require('./db')

const TEMP_PATH = '/var/tmp'
const JQUERY_URL = 'https://code.jquery.com/jquery-3.3.1.min.js'
/* 0 disables limits on report size */
const MAX_REPORT_SIZE = 0

class Diff {
  constructor (diffoscope) {
    this.dos = diffoscope
  }

  async manual (obj) {
    const diff = await DB.Diff.query().insertGraph({
      name: obj.name,
      type: 'manual',
      status: 'new',
      builds: [
        { name: obj.name, type: 'manual', fileUrl: obj.east },
        { name: obj.name, type: 'manual', fileUrl: obj.west },
      ]
    })
    return await this.run(diff)
  }

  /* we start the builds asynchroniusly, returns names of diffs */
  async builds (newest, builds) {
    return await Promise.all(builds.map(async toDiff => 
      await this.build(newest, toDiff)
    ))
  }

  async build (newBuild, oldBuild) {
    const diff = await DB.Diff.query().insertGraph({
      type: 'auto',
      status: 'new',
      builds: [{id: newBuild.id}, {id: oldBuild.id}]
    }, {relate: true}).eager('builds')
    this.run(diff)
    return diff.name
  }

  async updateDiffStatus(id, status) {
    return await DB.Diff.query().update({status}).where('id', id)
  }

  async run (diff) {
    let rval
    /* generate the diff report */
    try {
      rval = await this.dos.gen(
        diff.name, [diff.builds[0].fileUrl, diff.builds[1].fileUrl]
      )
    } catch(ex) {
      log.error('Diff failed: %s', ex.message)
      this.updateDiffStatus(diff.id, 'failure')
      throw ex
    }
    this.updateDiffStatus(diff.id, 'success')
    return rval
  }

  /* This finds other builds with same commit that have
   * no diffs with that commit. */
  async findDiffableBuilds(build) {
    /* find diffs of this build to exclude them */
    let buildDiffs = await DB.Diff.query()
      .select('builds.id')
      .joinRelation('builds')
      .where('builds.id', build.id)
      /* find builds of the same commit,
       * that haven't been diffed with this build */
    return await DB.Build.query()
      .leftJoinRelation('diffs')
      .where('build.commit', build.commit)
      .where('build.type', build.type)
      .andWhere('build.id', '!=', build.id)
      .andWhere(builder => {
        builder
          .where('diffs.id', null)
          .orWhereNotIn('diffs.id', buildDiffs)
      })
      .orderBy('build.id', 'desc')
  }

  async findLastDiffableBuild(build) {
    return (await this.findDiffableBuilds(build)).pop()
  }
}

module.exports = Diff
