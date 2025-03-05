exports.up = knex => {
  return knex.schema.alterTable('feedback', table => {
    table.dateTime('date').alter()
  })
}

exports.down = () => false
