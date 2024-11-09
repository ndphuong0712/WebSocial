import { Audience } from '@constants/enum'
import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import validate from '@utils/validate'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import commentService from 'src/services/comment.services'
import followService from 'src/services/follow.services'
import postService from 'src/services/post.services'

const createCommentValidator = validate(
  checkSchema(
    {
      postId: {
        isMongoId: true,
        custom: {
          options: async (value, { req }) => {
            const userId = (req as Request).tokenDecode?._id as string
            const post = await postService.getPost(value)
            if (!post) throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'PostId not found' })
            if (userId === post.userId.toString()) return
            if (post.audience === Audience.Private) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.FORBIDDEN,
                message: 'You do not have the right to comment on this post'
              })
            } else if (post.audience === Audience.Followers) {
              const followerIds = await followService.getAllFollowerIds(post.userId.toString())
              const checkFollowers = followerIds.some(followerId => followerId.toString() === userId)
              if (!checkFollowers) {
                throw new ErrorWithStatus({
                  status: HTTP_STATUS.FORBIDDEN,
                  message: 'You do not have the right to comment on this post'
                })
              }
            }
          }
        },
        errorMessage: 'Invalid postId'
      },
      originalCommentId: {
        isMongoId: true,
        custom: {
          options: async (value, { req }) => {
            const comment = await commentService.getComment(value)
            if (comment?.postId.toString() !== req.body.postId || comment?.originalCommentId !== null) throw new Error()
          }
        },
        errorMessage: 'Invalid originalCommentId',
        optional: true
      },
      content: {
        isString: true,
        errorMessage: 'Content must be a string'
      }
    },
    ['body']
  )
)

const deleteCommentValidator = validate(
  checkSchema(
    {
      commentId: {
        isMongoId: true,
        errorMessage: 'Invalid commentId'
      }
    },
    ['params']
  )
)

const getCommentsByPostValidator = validate(
  checkSchema(
    {
      sort: {
        isIn: {
          options: [[1, -1]]
        },
        toInt: true,
        errorMessage: 'Invalid sort',
        optional: true
      }
    },
    ['query']
  )
)

export { createCommentValidator, deleteCommentValidator, getCommentsByPostValidator }
