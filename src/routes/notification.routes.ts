import {
  getNotificationsByUserController,
  updateHasNotificationFalseController
} from '@controllers/notification.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { updateHasNotificationFalseValidator } from '@middlewares/notification.middlewares'
import { Router } from 'express'

const notificationRouter = Router()

notificationRouter.use(accessTokenValidator)
notificationRouter.patch(
  '/hasNotificationFalse',
  updateHasNotificationFalseValidator,
  updateHasNotificationFalseController
)
notificationRouter.get('/', getNotificationsByUserController)

export default notificationRouter
