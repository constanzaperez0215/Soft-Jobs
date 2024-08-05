import { jwtVerify } from '../utils/auth/jwt.js'

export const authToken = (req, res, next) => {
  const authorization = req.header('Authorization')
  console.log('Authorization Header Autoken:', authorization)

  if (authorization === undefined) {
    return res.status(401).json({ message: 'authorization no proporcionado' })
  }

  const [bearer, token] = authorization.split(' ')
  console.log('token', token)
  console.log('bearer', bearer)

  if (bearer.toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Bearer no proporcionado' })
  }

  if (token === undefined) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  try {
    jwtVerify(token)
    next()
  } catch (error) {
    res.status(401).json({ message: 'token no válido' })
  }
}
