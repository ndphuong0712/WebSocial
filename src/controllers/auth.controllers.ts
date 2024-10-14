import ENV from '@constants/env'
import { TokenDecodeType } from '@models/token'
import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import authService from 'src/services/auth.services'

const registerController = wrapRequestHandler(async (req: Request, res: Response) => {
  const userId = await authService.register(req.body)
  // Gửi mail
  const token = await authService.signVerifyEmailToken({ _id: userId.toString() })
  /////////////////////////////
  res.json({ message: 'Register successfully', token })
})

const verifyEmailController = wrapRequestHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.tokenDecode?._id as string)
  res.json({ message: result ? 'Verify email successfully' : 'Verify email failed or email has been verified' })
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
  const userId = req.body.userId as ObjectId
  const token = await authService.signForgetPasswordToken({ _id: userId.toString() })
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
    return res.redirect(ENV.LOGIN_CLIENT_URL)
  }
  const { refreshToken, accessToken } = await authService.loginGoogle(code as string)
  res.redirect(`${ENV.LOGIN_CLIENT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
})

export {
  registerController,
  verifyEmailController,
  loginController,
  refreshTokenController,
  logoutController,
  sendMailForgetPasswordController,
  resetPasswordController,
  loginGoogleController
}
