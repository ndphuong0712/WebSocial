import { Audience } from '@constants/enum'
import FileAttachmentType from '@models/fileAttachment'
import { ObjectId } from 'mongodb'

class Post {
  _id: ObjectId
  userId: ObjectId
  audience: Audience
  originalPostId: ObjectId | null
  content: string
  media: FileAttachmentType[]
  // tags: ObjectId[]
  // hashtags: string[]
  createdAt: Date
  updatedAt: Date

  constructor({ userId, audience, originalPostId, content, media }: createPostType) {
    const date = new Date()
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.audience = audience
    this.originalPostId = originalPostId ? new ObjectId(originalPostId) : null
    this.content = content
    this.media = media
    // this.tags = tags.map(tag => new ObjectId(tag))
    // this.hashtags = hashtags
    this.createdAt = this.updatedAt = date
  }
}

type createPostType = {
  userId: string
  audience: Audience
  originalPostId?: string
  content: string
  media: FileAttachmentType[]
  // tags: string[]
  // hashtags: string[]
}

type updatePostType = {
  audience?: Audience
  content?: string
  deleteMedia: string[]
  userId: string
  postId: string
  oldMedia: FileAttachmentType[]
  files: Express.Multer.File[]
}

export { Post as default, createPostType, updatePostType }
