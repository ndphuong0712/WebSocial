import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import bookmarkService from 'src/services/bookmark.services'

const createBookmarkController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  await bookmarkService.createBookmark({ userId, postId })
  res.json({ message: 'Bookmark post successfully' })
})

const unbookmarkController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  await bookmarkService.unbookmark({ userId, postId })
  res.json({ message: 'Unbookmark post successfully' })
})

export { createBookmarkController, unbookmarkController }
