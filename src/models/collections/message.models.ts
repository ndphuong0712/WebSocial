import FileAttachmentType from '@models/fileAttachment'
import { ObjectId } from 'mongodb'

class Message {
  _id: ObjectId
  userId: ObjectId
  conversationId: ObjectId
  content: string
  media: FileAttachmentType[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor({ userId, conversationId, content, media }: CreateMessageType) {
    this._id = new ObjectId()
    this.userId = new ObjectId(userId)
    this.conversationId = new ObjectId(conversationId)
    this.content = content
    this.media = media
    this.createdAt = this.updatedAt = new Date()
    this.deletedAt = null
  }
}

type CreateMessageType = {
  userId: string
  conversationId: string
  content: string
  media: FileAttachmentType[]
}

export { Message as default, CreateMessageType }
