import {
  createCommentController,
  deleteCommentController,
  getCommentsByPostController
} from '@controllers/comment.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import {
  createCommentValidator,
  deleteCommentValidator,
  getCommentsByPostValidator
} from '@middlewares/comment.middlewares'
import { postIdParamsValidator } from '@middlewares/post.middlewares'
import { Router } from 'express'

const commentRouter = Router()

commentRouter.use(accessTokenValidator)
commentRouter.get('/:postId', postIdParamsValidator, getCommentsByPostValidator, getCommentsByPostController)
commentRouter.post('/', createCommentValidator, createCommentController)
commentRouter.delete('/:commentId', deleteCommentValidator, deleteCommentController)

export default commentRouter
