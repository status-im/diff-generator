exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('builds', table => {
      table.increments('id').primary()
      table.integer('buildId').unsigned()
        .references('id').inTable('builds')
        .onDelete('SET NULL')
      table.string('fileUrl')
      table.string('buildUrl')
      table.string('type')
      table.date('created')
    })
    .createTable('diffs', table => {
      table.increments('id').primary()
      table.string('type')
      table.string('status')
      table.date('created')
      table.integer('eastId').unsigned()
        .references('id').inTable('builds')
        .onDelete('SET NULL')
      table.integer('westId').unsigned()
        .references('id').inTable('builds')
        .onDelete('SET NULL')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('builds')
    .dropTableIfExists('diffs')
}
