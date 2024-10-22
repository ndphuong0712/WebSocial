import FileAttachmentType from '@models/fileAttachment'
import wrapRequestHandler from '@utils/wrapRequestHandler'
import { NextFunction, Request, Response } from 'express'
import postService from 'src/services/post.services'

const createPostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const files = req.files
  await postService.createPost({ userId, files, ...req.body })
  res.json({ message: 'Create post successfully' })
})

const updatePostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const oldMedia = req.mediaPost as FileAttachmentType[]
  const postId = req.params.postId
  const { audience, content, deleteMedia } = req.body
  const files = req.files as Express.Multer.File[]
  await postService.updatePost({ postId, userId, audience, content, deleteMedia, oldMedia, files })
  res.json({ message: 'Update post successfully' })
})

export { createPostController, updatePostController }
