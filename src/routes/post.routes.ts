import { createPostController, updatePostController } from '@controllers/post.controller'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import {
  createPostValidator,
  getMediaPost,
  postIdParamsValidator,
  updatePostValidator
} from '@middlewares/post.middlewares'
import { uploadMedia } from '@middlewares/uploadFile.middlewares'
import { Router } from 'express'

const postRouter = Router()

//Private
postRouter.use(accessTokenValidator)
postRouter.post('/', uploadMedia, createPostValidator, createPostController)
postRouter.patch(
  '/:postId',
  postIdParamsValidator,
  getMediaPost,
  uploadMedia,
  updatePostValidator,
  updatePostController
)

export default postRouter
