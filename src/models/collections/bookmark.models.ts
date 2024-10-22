import { ObjectId } from 'mongodb'

class Bookmark {
  _id: ObjectId
  userId: ObjectId
  postId: ObjectId
  createdAt: Date
  constructor({ userId, postId }: createBookmarkType) {
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.postId = new ObjectId(postId)
    this.createdAt = new Date()
  }
}

type createBookmarkType = {
  userId: string
  postId: string
}

export { Bookmark as default, createBookmarkType }
