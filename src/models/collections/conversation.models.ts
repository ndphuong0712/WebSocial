import { ConversationType, FileType } from '@constants/enum'
import FileAttachmentType from '@models/fileAttachment'
import { ObjectId } from 'mongodb'

class Conversation {
  _id: ObjectId
  type: ConversationType
  participants: ObjectId[]
  //Group
  // name: string | null
  // avatar: FileAttachmentType | null
  // admin: ObjectId | null
  // adminRights: ObjectId[] | null
  /////////////////
  createdAt: Date
  updatedAt: Date

  constructor({ type, participants }: CreateConversationType) {
    const date = new Date()
    this._id = new ObjectId()
    this.type = type
    this.participants = participants.map(id => new ObjectId(id))
    // this.name = name ?? null
    // this.avatar = avatar === undefined ? null : { url: '', id: '', type: FileType.Image }
    // this.admin = admin ? new ObjectId(admin) : null
    // this.adminRights = adminRights ? [] : null
    this.createdAt = date
    this.updatedAt = date
  }
}

type CreateConversationType = {
  type: ConversationType
  participants: string[]
  // name?: string
  // avatar?: string
  // admin?: string
  // adminRights?: []
}

export { Conversation as default, CreateConversationType }
