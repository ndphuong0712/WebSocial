import {
  followController,
  followerController,
  followingController,
  unfollowController
} from '@controllers/follow.controllers'
import { accessTokenValidator } from '@middlewares/auth.middlewares'
import { followValidator } from '@middlewares/follow.middlewares'
import { userIdParamsValidator } from '@middlewares/user.middllewares'
import { Router } from 'express'

const followRouter = Router()

//Public
followRouter.get('/followings/:userId', userIdParamsValidator, followingController)
followRouter.get('/followers/:userId', userIdParamsValidator, followerController)

//Private
followRouter.use(accessTokenValidator)
followRouter.post('/:userId', followValidator, followController)
followRouter.delete('/:userId', userIdParamsValidator, unfollowController)

export default followRouter
