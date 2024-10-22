import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import likeService from 'src/services/like.services'

const createLikeController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  await likeService.createLike({ userId, postId })
  res.json({ message: 'Like post successfully' })
})

const unlikeController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  await likeService.unlike({ userId, postId })
  res.json({ message: 'Unlike post successfully' })
})

export { createLikeController, unlikeController }
