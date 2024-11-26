import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import notificationService from 'src/services/notification.services'

const updateHasNotificationFalseController = wrapRequestHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.tokenDecode?._id as string
    const { conversationId, lastMessageId } = req.body
    await notificationService.updateHasNotificationFalse({ userId, conversationId, lastMessageId })
    res.json({ message: 'update notification successfully' })
  }
)

const getNotificationsByUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const notifications = await notificationService.getNotificationsByUser(userId)
  res.json({ message: 'Get all notfications by user successfully', data: notifications })
})

export { updateHasNotificationFalseController, getNotificationsByUserController }
