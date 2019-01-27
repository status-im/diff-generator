exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('files', table => {
      table.increments('id').primary()
      table.integer('buildId').unsigned()
        .references('id').inTable('builds')
        .onDelete('SET NULL')
      table.string('url')
      table.string('type')
      table.date('created')
    })
    .createTable('builds', table => {
      table.increments('id').primary()
      table.string('name')
      table.string('url')
      table.date('created')
    })
    .createTable('diffs', table => {
      table.increments('id').primary()
      table.string('type')
      table.string('status')
      table.date('created')
      table.integer('eastId').unsigned()
        .references('id').inTable('files')
        .onDelete('SET NULL')
      table.integer('westId').unsigned()
        .references('id').inTable('files')
        .onDelete('SET NULL')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('files')
    .dropTableIfExists('builds')
    .dropTableIfExists('diffs')
}
