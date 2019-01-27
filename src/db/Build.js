const { Model } = require('objection')

class Build extends Model {
  static get tableName() {
    return 'build';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name', 'url'],
      properties: {
        id:        {type: 'integer'},
        created:   {type: 'string', minLength: 8, maxLength: 30},
        /* Mandatory */
        name:      {type: 'string', minLength: 5, maxLength: 50},
        type:      {type: 'string', minLength: 5, maxLength: 50},
        fileUrl:   {type: 'string', minLength: 8, maxLength: 255},
        buildUrl:  {type: 'string', minLength: 8, maxLength: 255},
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
          from: 'build.id',
          to: [
            'diff.eastId',
            'diff.westId',
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
