import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import conversationService from 'src/services/conversation.services'
import { userService } from 'src/services/user.services'

const conversationIdParamsValidator = validate(
  checkSchema(
    {
      conversationId: {
        isMongoId: {
          errorMessage: new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'conversationId must be a mongoId'
          })
        },
        custom: {
          options: async (value, { req }) => {
            const userId = (req as Request).tokenDecode?._id as string
            const conversationId = (req as Request).params.conversationId
            const check = await conversationService.checkUserInConversation({ userId, conversationId })
            if (!check)
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'conversationId not found or userId not in conversation'
              })
          }
        }
      }
    },
    ['params']
  )
)

const findOrCreateConversationFriendValidator = validate(
  checkSchema(
    {
      userId: {
        isMongoId: true,
        custom: {
          options: async (value, { req }) => {
            if (value === (req as Request).tokenDecode?._id) {
              throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'userId cannot be me' })
            }
            const user = await userService.getUserById(value)
            if (!user) throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'userId not found' })
          }
        },
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'userId must be a mongoId' })
      }
    },
    ['body']
  )
)

export { findOrCreateConversationFriendValidator, conversationIdParamsValidator }
