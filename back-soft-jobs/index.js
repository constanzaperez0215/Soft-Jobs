import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { jwtSing, jwtDecode } from './src/utils/auth/jwt.js'
import { verificarCredenciales, registrarUsuario, getUser } from './src/models/models.js'
import { authToken } from './src/middlewares/authToken.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    await verificarCredenciales(email, password)

    console.log('Credenciales verificadas correctamente')

    const token = jwtSing({ email })
    console.log('Token generado:', token)

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error en el login:', JSON.stringify(error, null, 2))
    res.status(error.code || 500).json(error)
  }
})

app.post('/usuarios', async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body
    await registrarUsuario({ email, password, rol, lenguage })
    res.status(201).json({ status: true, message: 'Usuario registrado con éxito' })
  } catch (error) {
    res.status(error.code || 500).json({ message: 'Error en la conexión', error })
  }
})

app.get('/usuarios', authToken, async (req, res) => {
  try {
    const authorization = req.header('Authorization')
    console.log('Authorization Header:', authorization)

    const [, token] = authorization.split(' ')
    console.log('token Get:', token)

    const { email } = jwtDecode(token)
    console.log('email:', email)

    const user = await getUser(email)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

app.all('*', (req, res) => {
  res.status(404).json({ code: 404, message: 'La ruta no existe' })
})

app.listen(PORT, () => console.log('Conectados al servidor 3000'))
