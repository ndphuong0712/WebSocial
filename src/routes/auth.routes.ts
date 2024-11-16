import {
  loginController,
  loginGoogleController,
  logoutController,
  meController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  sendMailForgetPasswordController,
  verifyEmailController
} from '@controllers/auth.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  sendMailForgetPasswordValidator,
  verifyEmailValidator
} from '@middlewares/auth.middlewares'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/register', registerValidator, registerController)
authRouter.post('/verifyEmail', verifyEmailValidator, verifyEmailController)
authRouter.post('/login', loginValidator, loginController)
authRouter.post('/refreshToken', refreshTokenValidator, refreshTokenController)
authRouter.post('/logout', logoutController)
authRouter.post('/sendMailForgetPassword', sendMailForgetPasswordValidator, sendMailForgetPasswordController)
authRouter.post('/resetPassword', resetPasswordValidator, resetPasswordController)
authRouter.get('/google', loginGoogleController)

authRouter.use(accessTokenValidator)
authRouter.get('/me', meController)

export default authRouter
