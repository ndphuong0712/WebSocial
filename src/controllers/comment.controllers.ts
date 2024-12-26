import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import commentService from 'src/services/comment.services'

const createCommentController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.body.postId
  const originalCommentId = req.body.originalCommentId
  const content = req.body.content
  const comment = await commentService.createComment({ userId, postId, originalCommentId, content })
  res.json({ message: 'Create comment successfully', data: comment })
})

const deleteCommentController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const commentId = req.params.commentId
  await commentService.deleteComment({ userId, commentId })
  res.json({ message: 'Delete comment successfully' })
})

const getCommentsByPostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  const sort: 1 | -1 = req.query.sort as any
  const comments = await commentService.getCommentsByPost({ userId, postId, sort })
  res.json({ message: 'Get comments successfully', data: comments })
})

export { createCommentController, deleteCommentController, getCommentsByPostController }
