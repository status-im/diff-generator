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
        type:    {type: 'string', minLength: 3, maxLength: 30},
        status:  {type: 'string', minLength: 4, maxLength: 20},
        created: {type: 'string', minLength: 8, maxLength: 30},
      }
    }
  }

  static get relationMappings() {
    const File = require('./File')
    return {
      east: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'files.id',
          to: 'diffs.eastId',
        },
      },
      west: {
        relation: Model.BelongsToOneRelation,
        modelClass: File,
        join: {
          from: 'files.id',
          to: 'diffs.westId',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
  }
}

module.exports = Diff
