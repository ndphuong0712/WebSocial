import { Express } from 'express'
import authRouter from './auth.routes'
import followRouter from './follow.routes'

const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/follows', followRouter)
}

export default initRoutes
