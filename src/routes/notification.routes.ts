import {
  getAllNotificationsByUserController,
  updateHasNotificationFalseController
} from '@controllers/notification.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { updateHasNotificationFalseValidator } from '@middlewares/notification.middlewares'
import { userIdParamsValidator } from '@middlewares/user.middllewares'
import { Router } from 'express'

const notificationRouter = Router()

notificationRouter.use(accessTokenValidator)
notificationRouter.patch(
  '/hasNotificationFalse',
  updateHasNotificationFalseValidator,
  updateHasNotificationFalseController
)
notificationRouter.get('/', getAllNotificationsByUserController)

export default notificationRouter
