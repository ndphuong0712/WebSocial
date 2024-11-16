import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import conversationService from 'src/services/conversation.services'

const messageIdParamsValidator = validate(
  checkSchema({
    messageId: {
      isMongoId: {
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'messageId must be a mongoId' })
      }
    }
  })
)

const createMessageValidator = validate(
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
            const conversationId = value
            const check = await conversationService.checkUserInConversation({ userId, conversationId })
            if (!check)
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: 'conversationId not found or userId not in conversation'
              })
          }
        }
      },
      content: {
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (req.files.length > 0 || value !== '') {
              return true
            }
          }
        },
        errorMessage: new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: 'content must be a string and not empty'
        })
      }
    },
    ['body']
  )
)

export { createMessageValidator, messageIdParamsValidator }
