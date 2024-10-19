import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import followService from 'src/services/follow.services'

const followController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const followerId = req.tokenDecode?._id as string
  const followingId = req.params.userId
  await followService.follow({ followerId, followingId })
  res.json({ message: 'Follow Successfully' })
})

const unfollowController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const followerId = req.tokenDecode?._id as string
  const followingId = req.params.userId
  await followService.unfollow({ followerId, followingId })
  res.json({ message: 'Unfollow Successfully' })
})

const followingController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId
  const myId = req.tokenDecode?._id
  const users = await followService.getAllFollowings({ userId, myId })
  res.json({ message: 'Get followings successfully', data: { users } })
})

const followerController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId
  const myId = req.tokenDecode?._id
  const users = await followService.getAllFollowers({ userId, myId })
  res.json({ message: 'Get followers successfully', data: { users } })
})

export { followController, unfollowController, followingController, followerController }
