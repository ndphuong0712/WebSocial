import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import conversationService from 'src/services/conversation.services'
import notificationService from 'src/services/notification.services'

const findOrCreateConversationFriendController = wrapRequestHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const myId = req.tokenDecode?._id as string
    const userId = req.body.userId as string
    const { conversationId, isCreate } = await conversationService.findOrCreateFriendConversation({ myId, userId })
    if (isCreate) {
      await notificationService.createNotification({
        userIds: [myId, userId],
        conversationId: conversationId.toString()
      })
    }
    res.json({ message: 'Find or create conversation successfully', data: { conversationId, isCreate } })
  }
)

const getAllConversationsByUserController = wrapRequestHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.tokenDecode?._id as string
    const conversations = await conversationService.getAllConversationsByUser(userId)
    res.json({ message: 'Get all conversations by user successfully', data: conversations })
  }
)

const getInfoConversationController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const conversationId = req.params.conversationId
  const conversation = await conversationService.getInfoConversation({ userId, conversationId })
  res.json({ message: 'Get information conversation successfully', data: conversation })
})

const getConversationsByUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const conversations = await conversationService.getConversationsByUser(userId)
  res.json({ message: 'Get conversations by user', data: conversations })
})

export {
  findOrCreateConversationFriendController,
  getInfoConversationController,
  getConversationsByUserController,
  getAllConversationsByUserController
}
