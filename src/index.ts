import express, { Request, Response } from 'express'
import 'dotenv/config'
import initRoutes from '@routes/initRoutes'

const app = express()

app.use(express.json())

initRoutes(app)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
