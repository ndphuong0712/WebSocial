import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import messageService from 'src/services/message.services'

const updateHasNotificationFalseValidator = validate(
  checkSchema(
    {
      conversationId: {
        isMongoId: true,
        errorMessage: new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: 'conversationId must be a mongoId'
        })
      },
      lastMessageId: {
        isMongoId: {
          errorMessage: new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'lastMessageId must be a mongoId'
          })
        },
        custom: {
          options: async (value, { req }) => {
            const messageId = value
            const conversationId = req.body.conversationId
            const check = await messageService.checkMessageInConversation({ messageId, conversationId })
            if (!check) {
              throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid lastMessageId' })
            }
          }
        }
      }
    },
    ['body']
  )
)

export { updateHasNotificationFalseValidator }
