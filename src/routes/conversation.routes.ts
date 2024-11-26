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
//Lấy tất cả cuộc trò chuyện
conversationRouter.get('/all', getAllConversationsByUserController)
conversationRouter.get('/:conversationId', conversationIdParamsValidator, getInfoConversationController)
//Lấy cuộc trò chuyện cá nhân hoặc cuộc trò chuyện đã có tin nhắn
conversationRouter.get('/', getConversationsByUserController)

export default conversationRouter
