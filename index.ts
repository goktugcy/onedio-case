import express from 'express'
import dotenv from 'dotenv'
import { createRoutes } from './src/server/routes'
import connectDB from './src/database/mongodb'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger'

export const app = express()
dotenv.config()
app.use(express.json())

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3001

connectDB()

createRoutes()
  .then((routes) => {
    app.use(routes)
  })
  .catch((err) => {
    console.log(err)
  })

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => {
  console.log(`Server ${host}:${port} is running`)
})
