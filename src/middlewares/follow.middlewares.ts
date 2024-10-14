import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { userService } from 'src/services/user.services'

const followValidator = validate(
  checkSchema(
    {
      userId: {
        isMongoId: {
          errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid userId' })
        },
        custom: {
          options: async (value, { req }) => {
            if ((req as Request).tokenDecode?._id === value) {
              throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'You cannot follow yourself' })
            }
            const user = await userService.getUserById(value)
            if (!user) {
              throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'UserId not found' })
            }
          }
        }
      }
    },
    ['params']
  )
)

export { followValidator }
