const expect = require('chai').expect
const sinon = require('sinon')

const sample = require('./sample')
const DB = require('../src/db')

const BUILDS = sample.genBuilds(4)

let db

describe('DB', () => {
  beforeEach(() => {
    db = new DB(':memory:')
    BUILDS.forEach((build) => db.insertBuild(build))
  })

  describe('insertBuild', () => {
    it('should add build to DB', () => {
      let id = db.insertBuild(sample.BUILD)
      expect(id).to.be.a('number')
      expect(db.getBuildById(id))
        .excluding('created')
        .to.deep.equal({
          ...sample.BUILD, id: id,
          filename: sample.BUILD.url.split('/').pop(),
      })
    })
  })

  describe('getBuild', () => {
    it('should get build based on commit, name, and type ', () => {
      let builds = db.getBuilds()
      expect(builds)
        .excluding(['created', 'id', 'filename'])
        .to.deep.equal(BUILDS)
    })
  })

  describe('getBuildById', () => {
    it('should return build with right ID', () => {
      expect(db.getBuildById(1))
        .excluding('created')
        .to.deep.equal({
          ...BUILDS[0], id: 1,
          filename: sample.BUILD.url.split('/').pop(),
      })
    })
  })

  describe('updateBuild', () => {
    it('should update existing build', () => {
      let build = db.getBuildById(4)
      db.updateBuild({...build, url: 'TEST-URL'})
      build = db.getBuildById(4)
      expect(build)
        .excluding(['created', 'filename'])
        .to.deep.equal({
          ...build, id: 4, url: 'TEST-URL',
      })
    })
  })
})
