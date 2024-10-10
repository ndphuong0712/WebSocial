import { Express } from 'express'
import authRouter from './auth.routes'

const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
}

export default initRoutes
