import {
  createMessageController,
  deleteMessageController,
  getMessagesByConversationController
} from '@controllers/message.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { conversationIdParamsValidator } from '@middlewares/conversation.middlewares'
import { createMessageValidator, messageIdParamsValidator } from '@middlewares/message.middlewares'
import { uploadMedia } from '@middlewares/uploadFile.middlewares'
import { Router } from 'express'

const messageRouter = Router()

messageRouter.use(accessTokenValidator)
messageRouter.post('/', uploadMedia, createMessageValidator, createMessageController)
messageRouter.delete('/:messageId', messageIdParamsValidator, deleteMessageController)
messageRouter.get('/:conversationId', conversationIdParamsValidator, getMessagesByConversationController)

export default messageRouter
