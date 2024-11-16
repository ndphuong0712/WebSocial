import Message, { CreateMessageType } from '@models/collections/message.models'
import mediaService from './media.services'

import { ObjectId } from 'mongodb'
import database from './database.services'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { deleteCloudinaryFile } from '@utils/cloudinary'

const messageService = {
  async createMessage({
    userId,
    conversationId,
    content,
    files
  }: Omit<CreateMessageType, 'media'> & { files: Express.Multer.File[] }) {
    const media = await mediaService.handleUploadMultipleFilesToCloudinary(files)
    const message = new Message({ userId, conversationId, content, media })
    await database.messages.insertOne(message)
    return message
  },

  async checkMessageInConversation({ messageId, conversationId }: { messageId: string; conversationId: string }) {
    const message = await database.messages.findOne(
      { _id: new ObjectId(messageId), conversationId: new ObjectId(conversationId) },
      { projection: { _id: 1 } }
    )
    return !!message
  },

  async deleteMessage({ userId, messageId }: { userId: string; messageId: string }) {
    const message = await database.messages.findOneAndUpdate(
      { _id: new ObjectId(messageId), userId: new ObjectId(userId), deletedAt: null },
      { $set: { deletedAt: new Date() } }
    )
    if (!message) throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid messageId' })
    await Promise.all([message.media.map(m => deleteCloudinaryFile(m.id))])
  },

  async getMessagesByConversation(conversationId: string) {
    return database.messages
      .aggregate([
        // Lọc các tin nhắn trong cuộc trò chuyện này
        { $match: { conversationId: new ObjectId(conversationId) } },
        // Lấy thông tin user gửi tin nhắn này
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            pipeline: [{ $project: { username: 1, avatar: 1 } }],
            as: 'user'
          }
        },
        { $unwind: { path: '$user' } },
        // Không lấy nội dung của tin nhắn đã bị xóa
        {
          $addFields: {
            content: { $cond: [{ $eq: ['$deletedAt', null] }, '$content', null] },
            media: { $cond: [{ $eq: ['$deletedAt', null] }, '$media', null] }
          }
        },
        // Sắp xếp tin nhắn gần đây nhất
        { $sort: { createdAt: -1 } }
      ])
      .toArray()
  }
}

export default messageService
