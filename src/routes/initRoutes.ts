import { Express } from 'express'
import authRouter from './auth.routes'
import followRouter from './follow.routes'
import userRouter from './user.routes'

const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/follows', followRouter)
  app.use('/users', userRouter)
}

export default initRoutes
