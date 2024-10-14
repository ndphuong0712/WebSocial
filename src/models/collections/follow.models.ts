import { ObjectId } from 'mongodb'

class Follow {
  _id: ObjectId
  followerId: ObjectId
  followingId: ObjectId
  createdAt: Date
  constructor({ followerId, followingId }: followType) {
    this._id = new ObjectId()
    this.followerId = new ObjectId(followerId)
    this.followingId = new ObjectId(followingId)
    this.createdAt = new Date()
  }
}

type followType = {
  followerId: string
  followingId: string
}

export { Follow as default, followType }
