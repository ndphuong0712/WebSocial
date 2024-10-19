import {
  changeAvatarController,
  changePasswordController,
  getMeController,
  getUserController,
  searchUserController,
  updateMeController
} from '@controllers/user.controllers'
import { accessTokenValidator, optionalAccessTokenValidator } from '@middlewares/auth.middlewares'
import { uploadAvatar } from '@middlewares/uploadFile.middlewares'
import {
  changePasswordValidator,
  searchUserValidator,
  updateMeValidator,
  userIdParamsValidator
} from '@middlewares/user.middllewares'
import { Router } from 'express'

const userRouter = Router()

userRouter.get('/me', accessTokenValidator, getMeController)

//Public
userRouter.use(optionalAccessTokenValidator)
userRouter.get('/:userId', userIdParamsValidator, getUserController)
userRouter.get('/', searchUserValidator, searchUserController)

//Private
userRouter.use(accessTokenValidator)
userRouter.patch('/me', updateMeValidator, updateMeController)
userRouter.patch('/avatar', uploadAvatar, changeAvatarController)
userRouter.patch('/password', changePasswordValidator, changePasswordController)

export default userRouter
