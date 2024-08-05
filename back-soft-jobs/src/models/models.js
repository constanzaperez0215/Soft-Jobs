import { db } from '../database/sqlConection.js'
import bcrypt from 'bcryptjs'

export const verificarCredenciales = async (email, password) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1;'
  const value = [email]
  const { rows: [usuario], rowCount } = await db(query, value)

  console.log('Usuario:', usuario)
  console.log('Row count:', rowCount)

  // Verifica si se encontró un usuario
  if (rowCount === 0) {
    const newError = { code: 401, message: 'Email o contraseña incorrecta' }
    throw newError
  }
  const passwordEncriptada = usuario.password
  const passwordCorrecta = await bcrypt.compare(password, passwordEncriptada)
  console.log('Password Correcta:', passwordCorrecta)

  if (!passwordCorrecta) {
    const newError = { code: 401, message: 'Email o contraseña incorrecta' }
    throw newError
  }
}

export const registrarUsuario = async ({ email, password, rol, lenguage }) => {
  const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *;'
  const passwordEncriptada = bcrypt.hashSync(password)
  const values = [email, passwordEncriptada, rol, lenguage]
  const { rowCount } = await db(query, values)

  if (!rowCount) {
    const newError = { code: 500, message: 'No se pudo registar, intenta más tarde' }
    throw newError
  }
}

export const getUser = async (email) => {
  try {
    const query = 'SELECT email, rol, lenguage FROM usuarios WHERE email = $1;'
    const values = [email]
    const { rows } = await db(query, values)
    return rows
  } catch (error) {
    const newError = { code: 500, message: error }
    throw newError
  }
}
