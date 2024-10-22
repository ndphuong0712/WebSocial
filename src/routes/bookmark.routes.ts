import { createBookmarkController, unbookmarkController } from '@controllers/bookmark.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { postIdParamsValidator } from '@middlewares/post.middlewares'
import { Router } from 'express'

const bookmarkRouter = Router()

bookmarkRouter.use(accessTokenValidator)
bookmarkRouter.post('/:postId', postIdParamsValidator, createBookmarkController)
bookmarkRouter.delete('/:postId', postIdParamsValidator, unbookmarkController)

export default bookmarkRouter
