const { Model } = require('objection')

class Diff extends Model {
  static get tableName() {
    return 'diff';
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
    const Build = require('./Build')
    return {
      east: {
        relation: Model.BelongsToOneRelation,
        modelClass: Build,
        join: {
          from: 'build.id',
          to: 'diff.eastId',
        },
      },
      west: {
        relation: Model.BelongsToOneRelation,
        modelClass: Build,
        join: {
          from: 'build.id',
          to: 'diff.westId',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
  }
}

module.exports = Diff
