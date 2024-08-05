import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_KEY = process.env.JWT_KEY

export const jwtSing = (payload) => jwt.sign(payload, JWT_KEY, { expiresIn: '1h' })

export const jwtVerify = (token) => {
  try {
    jwt.verify(token, JWT_KEY)
    return console.log('pasaste el jwt verify')
  } catch (error) {
    throw new Error('Token inválido jwt')
  }
}

export const jwtDecode = (token) => jwt.decode(token, JWT_KEY)
