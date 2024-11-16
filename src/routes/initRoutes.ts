import { Express } from 'express'
import authRouter from './auth.routes'
import followRouter from './follow.routes'
import userRouter from './user.routes'
import postRouter from './post.routes'
import likeRouter from './like.routes'
import bookmarkRouter from './bookmark.routes'
import commentRouter from './comment.routes'
import conversationRouter from './conversation.routes'
import messageRouter from './message.routes'
import notificationRouter from './notification.routes'

const initRoutes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/follows', followRouter)
  app.use('/users', userRouter)
  app.use('/posts', postRouter)
  app.use('/likes', likeRouter)
  app.use('/bookmarks', bookmarkRouter)
  app.use('/comments', commentRouter)
  app.use('/conversations', conversationRouter)
  app.use('/messages', messageRouter)
  app.use('/notifications', notificationRouter)
}

export default initRoutes
