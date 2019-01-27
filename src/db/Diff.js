const { Model } = require('objection')

class Diff extends Model {
  static get tableName() {
    return 'diffs';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['type', 'status'],
      properties: {
        id: {type: 'integer'},
        type: {type: 'string', minLength: 3, maxLength: 30},
        status: {type: 'string', minLength: 4, maxLength: 20},
        created: {type: 'date'},
      }
    }
  }

  static get relationMappings() {
    const File = require('./file')
    return {
      east: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          to: 'diffs.east_id',
        },
      },
      west: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          to: 'diffs.west_id',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toIOSString()
  }
}

module.exports = Diff
