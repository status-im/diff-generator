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
        build_id: {type: 'integer'},
        url: {type: 'string', minLength: 10, maxLength: 255},
        type: {type: 'string', minLength: 3, maxLength: 10},
        created: {type: 'date'},
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
          from: 'files.build_id',
          to: 'builds.id'
        },
      },
      diffs: {
        relation: Model.HasManyRelation,
        modelClass: Animal,
        join: {
          to: 'diffs.id'
        }
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toIOSString()
  }
}

module.exports = File
