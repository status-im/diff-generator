const shortid = require('shortid')
const { Model, ValidationError } = require('objection')

const VALID_STATES = ['wip', 'same', 'different', 'failure']

class Diff extends Model {
  static get tableName() {
    return 'diff';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['status'],
      properties: {
        id:      {type: 'integer'},
        created: {type: 'string', minLength: 8, maxLength: 30},
        /* Mandatory */
        name:    {type: 'string', minLength: 3, maxLength: 30},
        type:    {type: 'string', minLength: 3, maxLength: 30},
        status:  {type: 'string', minLength: 3, maxLength: 20},
      }
    }
  }

  static get relationMappings() {
    const Build = require('./Build')
    return {
      builds: {
        relation: Model.ManyToManyRelation,
        modelClass: Build,
        join: {
          from: 'diff.id',
          through: {
            from: 'build_diffs.diffId',
            to: 'build_diffs.buildId'
          },
          to: 'build.id',
        },
      },
    }
  }

  async nameExists(name) {
    const count = await Diff.query()
      .where('name', this.name)
      .count('id')
      .pluck('count(`id`)')
      .first()
    return count > 0
  }

  async $beforeInsert () {
    this.created = new Date().toISOString()
    if (this.name === undefined) {
      this.name = shortid.generate()
    }
    if (await this.nameExists(this.name)) {
      throw new Error(`Diff named "${this.name}" already exists!`)
    }
    if (!this.status in VALID_STATES) {
      throw new Error(`Status "${this.status}" is not valid!`)
    }
  }
}

module.exports = Diff
