import ENV from '@constants/env'
import { TokenDecodeType } from '@models/token'
import { sendForgetPasswordMail, sendRegisterMail } from '@utils/mail'
import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import authService from 'src/services/auth.services'
import conversationService from 'src/services/conversation.services'
import { userService } from 'src/services/user.services'

const registerController = wrapRequestHandler(async (req: Request, res: Response) => {
  const userId = await authService.register(req.body)
  const token = await authService.signVerifyEmailToken({ _id: userId.toString() })

  //Gửi mail
  await sendRegisterMail({
    email: req.body.email,
    username: req.body.username,
    link: `${ENV.CLIENT_URL_VERIFY_EMAIL}?token=${token}`
  })
  /////////////////////////////
  res.json({ message: 'Register successfully', token })
})

const verifyEmailController = wrapRequestHandler(async (req: Request, res: Response) => {
  const userId = req.tokenDecode?._id as string
  const result = await authService.verifyEmail(userId)
  if (result) {
    await conversationService.createPersonalConversation(userId)
  }
  res.json({ message: 'Verify email successfully' })
})

const loginController = wrapRequestHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body)
  res.json({ message: 'Login successfully', data })
})

const refreshTokenController = wrapRequestHandler(async (req: Request, res: Response) => {
  const data = await authService.handleRefreshToken(req.tokenDecode as TokenDecodeType, req.body.token)
  res.json({ message: 'Refresh token successfully', data })
})

const logoutController = wrapRequestHandler(async (req: Request, res: Response) => {
  if (req.body.token) {
    await authService.logout(req.body.token)
  }
  res.json({ message: 'Logout Successfully' })
})

const sendMailForgetPasswordController = wrapRequestHandler(async (req: Request, res: Response) => {
  //Gửi mail
  const email = req.body.email
  const userId = req.body.userId as ObjectId
  const token = await authService.signForgetPasswordToken({ _id: userId.toString() })
  await sendForgetPasswordMail({ email, link: `${ENV.CLIENT_URL_RESET_PASSWORD}?token=${token}` })
  //
  res.json({ message: 'Send mail forget pasword successfully', token })
})

const resetPasswordController = wrapRequestHandler(async (req: Request, res: Response) => {
  const password = req.body.password as string
  const userId = req.tokenDecode?._id as string
  await authService.resetPassword({ userId, password })
  res.json({ message: 'Reset password successfully' })
})

const loginGoogleController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { code, error } = req.query
  if (error) {
    return res.redirect(ENV.CLIENT_URL_LOGIN)
  }
  const { refreshToken, accessToken } = await authService.loginGoogle(code as string)
  res.redirect(`${ENV.CLIENT_URL_LOGIN}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
})

const meController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const data = await userService.getBasicInfoById(userId)
  res.json({ message: 'Get basic info successfully', data })
})

export {
  registerController,
  verifyEmailController,
  loginController,
  refreshTokenController,
  logoutController,
  sendMailForgetPasswordController,
  resetPasswordController,
  loginGoogleController,
  meController
}
