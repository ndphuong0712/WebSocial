import { createLikeController, unlikeController } from '@controllers/like.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { postIdParamsValidator } from '@middlewares/post.middlewares'
import { Router } from 'express'

const likeRouter = Router()

likeRouter.use(accessTokenValidator)
likeRouter.post('/:postId', postIdParamsValidator, createLikeController)
likeRouter.delete('/:postId', postIdParamsValidator, unlikeController)

export default likeRouter
