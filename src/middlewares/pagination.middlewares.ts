import validate from '@utils/validate'
import { checkSchema } from 'express-validator'

const paginationValidator = validate(
  checkSchema(
    {
      page: {
        isInt: {
          options: {
            min: 1
          }
        },
        errorMessage: 'Page must be a number and > 0',
        toInt: true,
        optional: true
      }
    },
    ['query']
  )
)

const paginationTimeValidator = validate(
  checkSchema(
    {
      lastTime: {
        isISO8601: true,
        errorMessage: 'LastTime must be a time iso',
        toDate: true,
        optional: true
      }
    },
    ['query']
  )
)

export { paginationValidator, paginationTimeValidator }
