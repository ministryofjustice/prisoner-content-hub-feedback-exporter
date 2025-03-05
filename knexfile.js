require('dotenv').config()
const { readFileSync } = require('node:fs')
const path = require('node:path')

module.exports = {
  migrations: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_URL,
      port: 5432,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: false,
        cert: readFileSync(path.join(__dirname, './global-bundle.pem')),
      },
    },
    migrations: {
      directory: './database/migrations',
    },
  },
}
