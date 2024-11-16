import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import messageService from 'src/services/message.services'
import notificationService from 'src/services/notification.services'

const createMessageController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const { conversationId, content } = req.body
  const files = req.files as Express.Multer.File[]
  const [message] = await Promise.all([
    messageService.createMessage({ userId, files, conversationId, content }),
    notificationService.updateNotificationByConversation({ userId, conversationId })
  ])
  await notificationService.updateHasNotificationFalse({
    userId,
    conversationId,
    lastMessageId: message._id.toString()
  })
  res.json({ message: 'Create message successfully', data: message })
})

const deleteMessageController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const messageId = req.params.messageId
  await messageService.deleteMessage({ userId, messageId })
  res.json({ message: 'Delete message successfully' })
})

const getMessagesByConversationController = wrapRequestHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { conversationId } = req.params
    const messages = await messageService.getMessagesByConversation(conversationId)
    res.json({ message: 'Get messages by conversation successfully', data: messages })
  }
)

export { createMessageController, deleteMessageController, getMessagesByConversationController }
