import { Gender } from '@constants/enum'
import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import enumToArrayNumber from '@utils/enumToArrayNumber'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { userService } from 'src/services/user.services'

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

const updateMeValidator = validate(
  checkSchema(
    {
      username: {
        matches: {
          options: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi,
          errorMessage:
            'Username must be between 1 and 32 characters long; Usernames may only contain letters, numbers, periods and underscores, no consecutive periods, and may not begin or end with a period'
        },
        custom: {
          options: async (value, { req }) => {
            const user = await userService.getUserIdByUsername(value)
            const myId = (req as Request).tokenDecode?._id
            if (user && user._id.toString() !== myId) throw new Error()
          },
          errorMessage: 'Username has been used'
        },
        optional: true
      },
      fullname: {
        matches: { options: /^(?!.*\s\s)(?!^\s.*)(?!.*\s$)[\p{L}\s]{1,50}$/giu },
        isLength: {
          options: {
            min: 1,
            max: 50
          }
        },
        errorMessage: 'Fullname contains only letters and spaces, must be between 1 and 50 characters long',
        optional: true
      },
      dateOfBirth: {
        isISO8601: true,
        errorMessage: 'Date format is invalid. Expected an ISO 8601 string',
        toDate: true,
        optional: true
      },
      gender: {
        isIn: { options: [enumToArrayNumber(Gender)] },
        errorMessage: `Gender must be a value between 0 and ${enumToArrayNumber(Gender).length - 1}`,
        toInt: true,
        optional: true
      },
      biography: {
        isString: true,
        isLength: { options: { min: 0, max: 200 } },
        errorMessage: 'Biography must be a string and have a maximum length of 200',
        optional: true
      },
      links: {
        isArray: { options: { min: 0, max: 5 } },
        custom: {
          options: (value: any[], { req }) => {
            const regex =
              /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i
            for (let i of value) {
              if (!regex.test(i)) {
                return false
              }
            }
            return true
          }
        },
        errorMessage: 'Links must be an array of urls',
        optional: true
      }
    },
    ['body']
  )
)

const changePasswordValidator = validate(
  checkSchema(
    {
      currentPassword: {
        isString: true,
        notEmpty: true,
        errorMessage: 'CurrentPassword must be a string and not empty'
      },
      newPassword: {
        isLength: {
          options: { min: 8, max: 32 }
        },
        isStrongPassword: true,
        errorMessage:
          'NewPassword must be between 8 and 32 characters long; contain at least one uppercase letter, one lowercase letter, one number, one special character'
      },
      confirmNewPassword: {
        custom: {
          options: (value, { req }) => value === req.body.newPassword
        },
        errorMessage: 'NewPassword and confirmNewPassword must match'
      }
    },
    ['body']
  )
)

const searchUserValidator = validate(
  checkSchema(
    {
      search: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Search must be a string and not emty'
      },
      fullname: {
        isString: true,
        isEmpty: true,
        optional: true,
        errorMessage: 'Fullname must be a empty string'
      }
    },
    ['query']
  )
)

export { userIdParamsValidator, updateMeValidator, changePasswordValidator, searchUserValidator }
