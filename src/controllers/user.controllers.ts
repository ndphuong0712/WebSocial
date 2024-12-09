import { searchUserType, updateUserType } from '@models/collections/user.models'
import filterData from '@utils/filterData'
import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import { userService } from 'src/services/user.services'

const updateMeController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const data = filterData<updateUserType>(req.body, [
    'biography',
    'dateOfBirth',
    'fullname',
    'gender',
    // 'links',
    'username'
  ])
  await userService.updateInfo({ userId, userInfo: data })
  res.json({ message: 'Updated information successfully' })
})

const changeAvatarController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const file = req.file as Express.Multer.File
  const data = await userService.changeAvatar({ userId, file })
  res.json({ message: 'Change avatar successfully', data })
})

const changePasswordController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const currentPassword = req.body.currentPassword as string
  const newPassword = req.body.newPassword as string
  await userService.changePassword({ userId, currentPassword, newPassword })
  res.json({ message: 'Change password successfully' })
})

const getUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId
  const myId = req.tokenDecode?._id
  const data = await userService.getUser({ userId, myId })
  res.json({ message: 'Get user successfully', data })
})

const getMeController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const data = await userService.getMe(userId)
  res.json({ message: 'Get me successfully', data })
})

const searchUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id
  const { search, fullname } = req.query as any as searchUserType
  const lastTime = req.query.page as Date | undefined
  const data = await userService.searchUser({ fullname, userId, search, lastTime, limit: 10 })
  res.json({ message: 'Search user successfully', data })
})

export {
  updateMeController,
  changeAvatarController,
  changePasswordController,
  getUserController,
  getMeController,
  searchUserController
}
