import express, { NextFunction, Request, Response } from 'express'
import initRoutes from '@routes/initRoutes'
import errorHandler from '@middlewares/error.middlewares'
import cors from 'cors'
import { createServer } from 'http'
import ENV from '@constants/env'
import handleSocket from './socket'

const app = express()
const httpServer = createServer(app)

handleSocket(httpServer)

app.use(cors())
app.use(express.json())

app.use(express.static('public'))

initRoutes(app)

app.use(errorHandler)

const port = ENV.PORT
httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
