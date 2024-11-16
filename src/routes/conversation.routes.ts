import {
  findOrCreateConversationFriendController,
  getAllConversationsByUserController,
  getConversationsByUserController,
  getInfoConversationController
} from '@controllers/conversation.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import {
  conversationIdParamsValidator,
  findOrCreateConversationFriendValidator
} from '@middlewares/conversation.middlewares'
import { userIdParamsValidator } from '@middlewares/user.middllewares'
import { Router } from 'express'

const conversationRouter = Router()

conversationRouter.use(accessTokenValidator)
conversationRouter.post(
  '/findOrCreateConversationFriend',
  findOrCreateConversationFriendValidator,
  findOrCreateConversationFriendController
)
conversationRouter.get('/all', getAllConversationsByUserController)
conversationRouter.get('/:conversationId', conversationIdParamsValidator, getInfoConversationController)
conversationRouter.get('/', getConversationsByUserController)

export default conversationRouter
