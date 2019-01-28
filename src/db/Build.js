const shortid = require('shortid')
const { ref } = require('objection')
const { Model } = require('objection')

class Build extends Model {
  static get tableName() {
    return 'build'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['type', 'fileUrl'],
      properties: {
        id:        {type: 'integer'},
        created:   {type: 'string', minLength: 8, maxLength: 30},
        /* Mandatory */
        name:      {type: 'string', minLength: 3, maxLength: 50},
        type:      {type: 'string', minLength: 3, maxLength: 50},
        fileUrl:   {type: 'string', minLength: 3, maxLength: 255},
        filename:  {type: 'string', minLength: 3, maxLength: 255},
        /* Optional */
        buildUrl:  {type: 'string', minLength: 3, maxLength: 255},
      }
    }
  }

  static get relationMappings() {
    const Diff = require('./Diff')
    return {
      diffs: {
        relation: Model.ManyToManyRelation,
        modelClass: Diff,
        join: {
          from: 'build.id',
          through: {
            from: 'build_diffs.buildId',
            to: 'build_diffs.diffId'
          },
          to: 'diff.id',
        },
      },
    }
  }

  $beforeInsert () {
    this.created = new Date().toISOString()
    this.filename = this.fileUrl.split('/').pop()
    if (this.name === undefined) {
      this.name = shortid.generate()
    }
  }
}

module.exports = Build
