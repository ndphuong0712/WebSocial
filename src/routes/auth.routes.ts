import {
  loginController,
  loginGoogleController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  sendMailForgetPasswordController,
  verifyEmailController
} from '@controllers/auth.controllers'
import {
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

export default authRouter
