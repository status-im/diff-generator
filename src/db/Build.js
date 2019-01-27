const { Model } = require('objection')

class Build extends Model {
  static get tableName() {
    return 'builds';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'url'],
      properties: {
        id:        {type: 'integer'},
        created:   {type: 'string', minLength: 8,  maxLength: 30},
        /* Mandatory */
        name:      {type: 'string', minLength: 5,  maxLength: 50},
        fileUrl:   {type: 'string', minLength: 10, maxLength: 255},
        sourceUrl: {type: 'string', minLength: 10, maxLength: 255},
      }
    }
  }

  static get relationMappings() {
    const Diff = require('./Diff')
    return {
      diffs: {
        relation: Model.HasManyRelation,
        modelClass: Diff,
        join: {
          from: 'builds.id',
          to: [
            'diffs.eastId',
            'diffs.westId',
          ],
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
  }
}

module.exports = Build
