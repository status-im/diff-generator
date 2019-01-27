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
        id:      {type: 'integer'},
        url:     {type: 'string', minLength: 10, maxLength: 255},
        name:    {type: 'string', minLength: 5,  maxLength: 30},
        created: {type: 'string', minLength: 8,  maxLength: 30},
      }
    }
  }

  static get relationMappings() {
    const File = require('./File')
    return {
      builds: {
        relation: Model.HasManyRelation,
        modelClass: File,
        join: {
          from: 'builds.id',
          to: 'files.buildId',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
  }
}

module.exports = Build
