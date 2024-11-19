import express, { NextFunction, Request, Response } from 'express'
import initRoutes from '@routes/initRoutes'
import errorHandler from '@middlewares/error.middlewares'
import cors from 'cors'
import ENV from '@constants/env'

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('public'))

initRoutes(app)

app.use(errorHandler)

const port = ENV.PORT
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
