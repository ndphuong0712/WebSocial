import {
  createPostController,
  deletePostController,
  getBasicInfoPostController,
  getDetailPostController,
  getLBookmarkPostsByUserController,
  getLikePostsByUserController,
  getPostsByUserController,
  newsFeedController,
  updatePostController
} from '@controllers/post.controllers'
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
postRouter.get('/basicInfo/:postId', postIdParamsValidator, getBasicInfoPostController)
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
postRouter.delete('/:postId', postIdParamsValidator, deletePostController)

export default postRouter
