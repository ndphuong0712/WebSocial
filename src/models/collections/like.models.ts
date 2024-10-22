import { ObjectId } from 'mongodb'

class Like {
  _id: ObjectId
  userId: ObjectId
  postId: ObjectId
  createdAt: Date
  constructor({ userId, postId }: createLikeType) {
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.postId = new ObjectId(postId)
    this.createdAt = new Date()
  }
}

type createLikeType = {
  userId: string
  postId: string
}

export { Like as default, createLikeType }
