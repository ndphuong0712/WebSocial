import Notification, { CreateNotificationType } from '@models/collections/notification.models'
import database from './database.services'
import { ObjectId } from 'mongodb'

const notificationService = {
  createNotification({ userIds, conversationId }: { userIds: string[]; conversationId: string }) {
    return database.notifications.insertMany(userIds.map(userId => new Notification({ userId, conversationId })))
  },

  // Cập nhật lại trạng thái thông báo là true của tất cả người dùng trong cuộc trò chuyện trừ người gửi tin nhắn
  updateNotificationByConversation({ userId, conversationId }: { userId: string; conversationId: string }) {
    return database.notifications.updateMany(
      { conversationId: new ObjectId(conversationId), userId: { $ne: new ObjectId(userId) } },
      { $set: { hasNotification: true } }
    )
  },

  // Cập nhật lại trạng thái thông báo là false của người dùng
  updateHasNotificationFalse({
    userId,
    conversationId,
    lastMessageId
  }: {
    userId: string
    conversationId: string
    lastMessageId: string
  }) {
    return database.notifications.updateOne(
      { userId: new ObjectId(userId), conversationId: new ObjectId(conversationId) },
      { $set: { lastMessageId: new ObjectId(lastMessageId), hasNotification: false } }
    )
  },

  getNotificationsByUser(userId: string) {
    return database.notifications.find({ userId: new ObjectId(userId) }).toArray()
  }
}

export default notificationService
