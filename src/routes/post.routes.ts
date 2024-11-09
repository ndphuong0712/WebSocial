import {
  createPostController,
  getDetailPostController,
  getLBookmarkPostsByUserController,
  getLikePostsByUserController,
  getPostsByUserController,
  newsFeedController,
  updatePostController
} from '@controllers/post.controller'
import { accessTokenValidator, optionalAccessTokenValidator } from '@middlewares/auth.middlewares'
import { paginationTimeValidator } from '@middlewares/pagination.middlewares'
import {
  createPostValidator,
  getMediaPost,
  postIdParamsValidator,
  updatePostValidator
} from '@middlewares/post.middlewares'
import { uploadMedia } from '@middlewares/uploadFile.middlewares'
import { userIdParamsValidator } from '@middlewares/user.middllewares'
import { Router } from 'express'

const postRouter = Router()

postRouter.get('/likes', accessTokenValidator, paginationTimeValidator, getLikePostsByUserController)
postRouter.get('/bookmarks', accessTokenValidator, paginationTimeValidator, getLBookmarkPostsByUserController)

//Public
postRouter.use(optionalAccessTokenValidator)
postRouter.get('/newsFeed', paginationTimeValidator, newsFeedController)
postRouter.get('/:postId', postIdParamsValidator, getDetailPostController)
postRouter.get('/user/:userId', userIdParamsValidator, paginationTimeValidator, getPostsByUserController)

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
