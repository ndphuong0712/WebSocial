import { ObjectId } from 'mongodb'
import database from './database.services'
import { Audience } from '@constants/enum'
import Post, { createPostType, updatePostType } from '@models/collections/post.models'
import mediaService from './media.services'
import { deleteCloudinaryFile } from '@utils/cloudinary'

const postService = {
  async isPostPublicExist(postId: string) {
    const post = await database.posts.findOne(
      { _id: new ObjectId(postId), audience: Audience.Public, originalPostId: null },
      { projection: { _id: 1 } }
    )
    return !!post
  },

  getMediaPost({ userId, postId }: { userId: string; postId: string }) {
    return database.posts.findOne(
      { _id: new ObjectId(postId), userId: new ObjectId(userId) },
      { projection: { _id: 0, media: 1 } }
    )
  },

  getPost(postId: string) {
    return database.posts.findOne({ _id: new ObjectId(postId) }, { projection: { createdAt: 0, updatedAt: 0 } })
  },

  async createPost({
    userId,
    audience,
    originalPostId,
    content,
    files
  }: Omit<createPostType, 'media'> & { files: Express.Multer.File[] }) {
    const media = await mediaService.handleUploadMultipleFilesToCloudinary(files)
    await database.posts.insertOne(new Post({ userId, audience, originalPostId, content, media }))
  },

  async updatePost({ postId, userId, audience, content, deleteMedia, oldMedia, files }: updatePostType) {
    if (audience === undefined && content === undefined && deleteMedia.length === 0 && files.length === 0) {
      return
    }
    const media = await mediaService.handleUploadMultipleFilesToCloudinary(files)
    let newMedia = oldMedia.filter(v1 => !deleteMedia.some(v2 => v2 === v1.id))
    newMedia = [...newMedia, ...media]
    const updateObj: any = { media: newMedia, updatedAt: new Date() }
    if (audience !== undefined) updateObj.audience = audience
    if (content !== undefined) updateObj.content = content
    await Promise.all([
      database.posts.updateOne({ _id: new ObjectId(postId), userId: new ObjectId(userId) }, { $set: updateObj }),
      ...deleteMedia.map(id => deleteCloudinaryFile(id))
    ])
  }
}

export default postService
