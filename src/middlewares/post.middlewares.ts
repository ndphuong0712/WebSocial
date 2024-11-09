import { Audience } from '@constants/enum'
import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import enumToArrayNumber from '@utils/enumToArrayNumber'
import validate from '@utils/validate'
import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import postService from 'src/services/post.services'

const getMediaPost = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  const mediaPost = await postService.getMediaPost({ userId, postId })
  if (!mediaPost) {
    return next(new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Post not found' }))
  }
  req.mediaPost = mediaPost.media
  next()
})

const postIdParamsValidator = validate(
  checkSchema(
    {
      postId: {
        isMongoId: true,
        errorMessage: new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid postId' })
      }
    },
    ['params']
  )
)

const createPostValidator = validate(
  checkSchema(
    {
      audience: {
        isIn: {
          options: [enumToArrayNumber(Audience)]
        },
        toInt: true,
        errorMessage: `Audience must be a value from 0 to ${enumToArrayNumber(Audience).length - 1}`
      },
      originalPostId: {
        isMongoId: true,
        custom: {
          options: async (value: string, { req }) => {
            if (req.files.length > 0) {
              throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Shared post must not have media' })
            }
            const check = await postService.isPostPublicExist(value)
            if (!check) throw new Error()
          }
        },
        optional: true,
        errorMessage: 'Invalid originalPosstId'
      },
      content: {
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (req.files.length > 0 || value !== '') {
              return true
            }
          },
          errorMessage: 'Content must not be empty'
        },
        errorMessage: 'Content must be a string'
      }
    },
    ['body']
  )
)

const updatePostValidator = validate(
  checkSchema(
    {
      audience: {
        isIn: {
          options: [enumToArrayNumber(Audience)]
        },
        toInt: true,
        optional: true,
        errorMessage: `Audience must be a value from 0 to ${enumToArrayNumber(Audience).length - 1}`
      },
      content: {
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            try {
              if (req.files.length > 0 || value !== '') {
                return true
              }
              const deleteMedia = JSON.parse(req.body.deleteMedia)
              const mediaLength = (req as Request).mediaPost?.length as number
              if (deleteMedia.length < mediaLength) return true
            } catch {
              return false
            }
          },
          errorMessage: 'Content must not be empty'
        },
        optional: true,
        errorMessage: 'Content must be a string'
      },
      deleteMedia: {
        isString: {
          bail: true
        },
        customSanitizer: {
          options: (value, { req }) => {
            try {
              const newValue = JSON.parse(value)
              return newValue.filter((v1: string) => (req as Request).mediaPost?.some(v2 => v2.id === v1))
            } catch {
              return null
            }
          }
        },
        custom: {
          options: (value, { req }) => {
            if (value) return true
          }
        },

        errorMessage: 'DeleteMedia must be an array'
      }
    },
    ['body']
  )
)

export { createPostValidator, postIdParamsValidator, updatePostValidator, getMediaPost }
