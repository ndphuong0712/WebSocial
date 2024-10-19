import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import authService from 'src/services/auth.services'
import database from 'src/services/database.services'
import { userService } from 'src/services/user.services'

const registerValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: 'Please provide a valid email address'
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await userService.isExistEmail(value)
            if (isExist) throw new Error()
          },
          errorMessage: 'Email has been used'
        }
      },
      username: {
        matches: {
          options: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi,
          errorMessage:
            'Username must be between 1 and 32 characters long; Usernames may only contain letters, numbers, periods and underscores, no consecutive periods, and may not begin or end with a period'
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await userService.isExistUsername(value)
            if (isExist) throw new Error()
          },
          errorMessage: 'Username has been used'
        }
      },
      fullname: {
        matches: { options: /^(?!.*\s\s)(?!^\s.*)(?!.*\s$)[\p{L}\s]{1,50}$/giu },
        isLength: {
          options: {
            min: 1,
            max: 50
          }
        },
        errorMessage: 'Fullname contains only letters and spaces, must be between 1 and 50 characters long'
      },
      password: {
        isLength: {
          options: { min: 8, max: 32 }
        },
        isStrongPassword: true,
        errorMessage:
          'Password must be between 8 and 32 characters long; contain at least one uppercase letter, one lowercase letter, one number, one special character'
      },
      confirmPassword: {
        custom: {
          options: (value, { req }) => value === req.body.password
        },
        errorMessage: 'password and confirm password must match'
      }
    },
    ['body']
  )
)

const verifyEmailValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const tokenDecode = await authService.verifyEmailToken(value)
            ;(req as Request).tokenDecode = tokenDecode
          }
        },
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid token' })
      }
    },
    ['body']
  )
)

const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        errorMessage: 'Invalid email'
      },
      password: {
        isString: true,
        isLength: {
          options: {
            min: 8,
            max: 32
          }
        },
        errorMessage: 'Password must be between 8 and 32 characters long'
      }
    },
    ['body']
  )
)

const refreshTokenValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const [refreshToken, tokenDecode] = await Promise.all([
              database.refreshTokens.findOne({ token: value }),
              authService.verifyRefreshToken(value)
            ])
            if (!refreshToken)
              throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: 'Invalid refresh token' })
            ;(req as Request).tokenDecode = tokenDecode
          }
        },
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid refresh token' })
      }
    },
    ['body']
  )
)

const sendMailForgetPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: 'invalid email'
        },
        custom: {
          options: async (value, { req }) => {
            const user = await userService.getUserIdByEmail(value)
            if (!user) throw new Error()
            req.body.userId = user._id
          },
          errorMessage: 'Email not found'
        }
      }
    },
    ['body']
  )
)

const resetPasswordValidator = validate(
  checkSchema(
    {
      token: {
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const tokenDecode = await authService.verifyForgetPasswordToken(value)
            ;(req as Request).tokenDecode = tokenDecode
          }
        },
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid token' })
      },
      password: {
        isLength: {
          options: { min: 8, max: 32 }
        },
        isStrongPassword: true,
        errorMessage:
          'Password must be between 8 and 32 characters long; contain at least one uppercase letter, one lowercase letter, one number, one special character'
      },
      confirmPassword: {
        custom: {
          options: (value, { req }) => value === req.body.password
        },
        errorMessage: 'password and confirm password must match'
      }
    },
    ['body']
  )
)

const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: true,
        isString: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!(req as Request).tokenDecode) {
              const token = value.split(' ')[1]
              const tokenDecode = await authService.verifyAccessToken(token)
              ;(req as Request).tokenDecode = tokenDecode
            }
          }
        },
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid token' })
      }
    },
    ['headers']
  )
)

const optionalAccessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    return accessTokenValidator(req, res, next)
  }
  next()
}

export {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
  refreshTokenValidator,
  sendMailForgetPasswordValidator,
  resetPasswordValidator,
  accessTokenValidator,
  optionalAccessTokenValidator
}
