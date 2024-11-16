import { ObjectId } from 'mongodb'

class Notification {
  _id: ObjectId
  userId: ObjectId
  conversationId: ObjectId
  lastMessageId: ObjectId | null
  hasNotification: boolean

  constructor({ userId, conversationId }: CreateNotificationType) {
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.conversationId = new ObjectId(conversationId)
    this.lastMessageId = null
    this.hasNotification = false
  }
}

type CreateNotificationType = {
  userId: string
  conversationId: string
}

export { Notification as default, CreateNotificationType }
