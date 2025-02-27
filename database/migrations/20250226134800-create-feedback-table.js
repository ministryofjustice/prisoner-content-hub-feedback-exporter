exports.up = knex => {
  return knex.schema.createTable('feedback', table => {
    table.increments('id').primary()
    table.string('sessionId').notNullable()
    table.string('feedbackId').notNullable()
    table.date('date').notNullable()
    table.string('title').notNullable()
    table.string('url').notNullable()
    table.string('contentType').notNullable()
    table.string('series')
    table.string('categories')
    table.string('topics')
    table.string('sentiment')
    table.string('establishment').notNullable()
    table.text('comment')
  })
}

exports.down = knex => knex.schema.dropTableIfExists('feedback')
