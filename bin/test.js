const Knex = require('knex')
const { Model } = require('objection')

/* Define connection to the DataBase */
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: { filename: '/tmp/diff.db'}
});
/* Give the knex object to objection */
Model.knex(knex);

const Diff = require('../src/db/Diff')
const File = require('../src/db/File')
const Build = require('../src/db/Build')

const main = async () => {
  await Build.query().insert({name: 'dasdas', url: 'dasdasdasdas'})
  await Build.query().insert({name: 'dasdas', url: 'dasdasdasdas'})
  let builds = await Build.query()
  console.dir(builds)
}

main()
