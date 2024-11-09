import { ObjectId } from 'mongodb'

class Comment {
  _id: ObjectId
  userId: ObjectId
  postId: ObjectId
  originalCommentId: ObjectId | null
  content: string
  createdAt: Date
  constructor({ userId, postId, originalCommentId, content }: createCommentType) {
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.postId = new ObjectId(postId)
    this.originalCommentId = originalCommentId ? new ObjectId(originalCommentId) : null
    this.content = content
    this.createdAt = new Date()
  }
}

type createCommentType = {
  userId: string
  postId: string
  originalCommentId?: string
  content: string
}

export { Comment as default, createCommentType }
