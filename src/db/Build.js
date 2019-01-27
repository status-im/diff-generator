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
        id: {type: 'integer'},
        url: {type: 'string', minLength: 10, maxLength: 255},
        name: {type: 'string', minLength: 5, maxLength: 30},
        created: {type: 'date'},
      }
    }
  }

  static get relationMappings() {
    const File = require('./file')
    return {
      builds: {
        relation: Model.HasManyRelation,
        modelClass: File,
        join: {
          from: 'builds.id',
          to: 'files.build_id',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toIOSString()
  }
}

module.exports = Build
