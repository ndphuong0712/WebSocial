import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
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
  const post = await postService.updatePost({ postId, userId, audience, content, deleteMedia, oldMedia, files })
  res.json({ message: 'Update post successfully', data: post })
})

const getDetailPostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id
  const postId = req.params.postId
  const post = await postService.getDetailPost({ userId, postId })
  res.json({ message: 'Get detail post successfully', data: post })
})

const getBasicInfoPostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id
  const postId = req.params.postId
  const post = await postService.getBasicInfoPost({ userId, postId })
  res.json({ message: 'Get basic info post successfully', data: post })
})

const newsFeedController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id
  const lastTime = req.query.lastTime as Date | undefined
  let posts
  if (userId) posts = await postService.getNewsFeed({ userId, lastTime, limit: 10 })
  else posts = await postService.getNewsFeedWithoutLogin(lastTime)
  res.json({ message: 'Get news feed successfully', data: posts })
})

const getPostsByUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const myId = req.tokenDecode?._id
  const userId = req.params.userId
  const lastTime = req.query.lastTime as Date | undefined
  const posts = await postService.getPostsByUser({ userId, myId, lastTime, limit: 10 })
  res.json({ message: 'Get posts by user successfully', data: posts })
})

const getLikePostsByUserController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const lastTime = req.query.lastTime as Date | undefined
  const posts = await postService.getLikePostsByUser({ userId, lastTime, limit: 10 })
  res.json({ message: 'Get like posts by user successfully', data: posts })
})

const getLBookmarkPostsByUserController = wrapRequestHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.tokenDecode?._id as string
    const lastTime = req.query.lastTime as Date | undefined
    const posts = await postService.getBookmarkPostsByUser({ userId, lastTime, limit: 10 })
    res.json({ message: 'Get bookmark posts by user successfully', data: posts })
  }
)

const deletePostController = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.tokenDecode?._id as string
  const postId = req.params.postId
  const result = await postService.deletePost({ postId, userId })
  if (result.deletedCount === 0) {
    throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Delete post failed' })
  }
  res.json({ message: 'Delete post successfully' })
})
export {
  createPostController,
  updatePostController,
  getDetailPostController,
  getBasicInfoPostController,
  newsFeedController,
  getPostsByUserController,
  getLikePostsByUserController,
  getLBookmarkPostsByUserController,
  deletePostController
}
