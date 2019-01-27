const { Model } = require('objection')

class File extends Model {
  static get tableName() {
    return 'files';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['url', 'type'],
      properties: {
        id: {type: 'integer'},
        buildId: {type: 'integer'},
        url:     {type: 'string', minLength: 9, maxLength: 255},
        type:    {type: 'string', minLength: 3, maxLength: 10},
        created: {type: 'string', minLength: 8, maxLength: 30},
      }
    }
  }

  static get relationMappings() {
    const Diff = require('./Diff')
    const Build = require('./Build')
    return {
      build: {
        relation: Model.BelongsToOneRelation,
        modelClass: Build,
        join: {
          from: 'files.buildId',
          to: 'builds.id'
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
  }
}

module.exports = File
