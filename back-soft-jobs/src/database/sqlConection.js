import pkg from 'pg'
import dotenv from 'dotenv'
const { Pool } = pkg

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  allowExitOnIdle: true
})

export const db = async (query, values) => {
  try {
    const result = await pool.query(query, values)
    return result
  } catch (error) {
    console.error('[db_conect.js]=> db', error)
    const newError = { status: false, message: error }
    throw newError
  }
}
