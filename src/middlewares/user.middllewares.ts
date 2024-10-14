import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { checkSchema } from 'express-validator'

const userIdParamsValidator = validate(
  checkSchema(
    {
      userId: {
        isMongoId: {
          errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid userId' })
        }
      }
    },
    ['params']
  )
)

export { userIdParamsValidator }
