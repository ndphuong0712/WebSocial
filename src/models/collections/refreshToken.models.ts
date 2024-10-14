import { ObjectId } from 'mongodb'

class RefreshToken {
  _id: ObjectId
  userId: ObjectId
  token: string
  createdAt: Date
  updatedAt: Date

  constructor({ userId, token }: refreshTokenType) {
    const date = new Date()
    this._id = new ObjectId()
    this.userId = userId
    this.token = token
    this.createdAt = this.updatedAt = date
  }
}

type refreshTokenType = Pick<RefreshToken, 'userId' | 'token'>

export { RefreshToken as default, refreshTokenType }
