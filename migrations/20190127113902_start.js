exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('build', table => {
      table.increments('id').primary()
      table.integer('buildId').unsigned()
        .references('id').inTable('build')
        .onDelete('SET NULL')
      table.string('type')
      table.string('name')
      table.string('fileUrl')
      table.string('buildUrl')
      table.date('created')
    })
    .createTable('diff', table => {
      table.increments('id').primary()
      table.string('type')
      table.string('status')
      table.date('created')
      table.integer('eastId').unsigned()
        .references('id').inTable('build')
        .onDelete('SET NULL')
      table.integer('westId').unsigned()
        .references('id').inTable('build')
        .onDelete('SET NULL')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('build')
    .dropTableIfExists('diff')
}
