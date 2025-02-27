require('dotenv').config()
// const { readFileSync } = require('node:fs')
// const path = require('node:path')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  migrations: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_URL,
      port: 5432,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: true,
      // ssl: {
      //   ca: readFileSync(path.join(__dirname, '../ca-certificate.crt')),
      // },
    },
    migrations: {
      directory: './database/migrations',
    },
  },
}
