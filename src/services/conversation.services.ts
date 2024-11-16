import { ObjectId } from 'mongodb'
import database from './database.services'
import Conversation from '@models/collections/conversation.models'
import { ConversationType } from '@constants/enum'
import FileAttachmentType from '@models/fileAttachment'

const conversationService = {
  createPersonalConversation(userId: string) {
    return database.conversations.insertOne(
      new Conversation({ participants: [userId], type: ConversationType.Personal })
    )
  },

  async findOrCreateFriendConversation({ myId, userId }: { myId: string; userId: string }) {
    let conversation = await database.conversations.findOne({
      participants: { $all: [new ObjectId(myId), new ObjectId(userId)] },
      type: ConversationType.Friend
    })
    if (conversation) {
      return { conversationId: conversation._id, isCreate: false }
    }
    const { insertedId } = await database.conversations.insertOne(
      new Conversation({ type: ConversationType.Friend, participants: [myId, userId] })
    )
    return { conversationId: insertedId, isCreate: true }
  },

  async checkUserInConversation({ userId, conversationId }: { userId: string; conversationId: string }) {
    const check = await database.conversations.findOne(
      { _id: new ObjectId(conversationId), participants: new ObjectId(userId) },
      { projection: { _id: 1 } }
    )
    return !!check
  },

  getAllConversationsByUser(userId: string) {
    return database.conversations.find({ participants: new ObjectId(userId) }).toArray()
  },

  async getInfoConversation({ conversationId, userId }: { conversationId: string; userId: string }) {
    const conversation = await database.conversations.findOne({ _id: new ObjectId(conversationId) })
    if (conversation?.type === ConversationType.Personal) {
      const user = await database.users.findOne({ _id: new ObjectId(userId) })
      conversation.name = user?.username as string
      conversation.avatar = user?.avatar as FileAttachmentType
    } else if (conversation?.type === ConversationType.Friend) {
      const friendId = conversation.participants.find(id => id.toString() !== userId)
      const friend = await database.users.findOne({ _id: new ObjectId(friendId) })
      conversation.name = friend?.username as string
      conversation.avatar = friend?.avatar as FileAttachmentType
    }
    return conversation
  },

  // Lấy các cuộc trò chuyện đã có tin nhắn
  async getConversationsByUser(userId: string) {
    const userIdObj = new ObjectId(userId)
    return database.conversations
      .aggregate([
        // Các cuộc trò chuyện có userId
        { $match: { participants: userIdObj } },
        // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
        {
          $lookup: {
            from: 'message',
            localField: '_id',
            foreignField: 'conversationId',
            pipeline: [
              { $sort: { createdAt: -1 } },
              {
                $addFields: {
                  content: { $cond: [{ $eq: ['$deletedAt', null] }, '$content', null] },
                  media: { $cond: [{ $eq: ['$deletedAt', null] }, '$media', null] }
                }
              }
            ],
            as: 'messages'
          }
        },
        { $addFields: { lastMessage: { $first: '$messages' } } },
        // Lấy các cuộc trò chuyện đã có tin nhắn và cuộc trò chuyện cá nhân
        { $match: { $or: [{ lastMessage: { $ne: null } }, { type: 0 }] } },
        // Lấy name và avatar của cuộc trò chuyện cá nhân và bạn bè
        {
          $lookup: {
            from: 'user',
            localField: 'participants',
            foreignField: '_id',
            let: { type: '$type' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $and: [{ $eq: ['$$type', 1] }, { $ne: [new ObjectId('67123b7af2ae020119ff20ca'), '$_id'] }] },
                      { $and: [{ $eq: ['$$type', 0] }, { $eq: [new ObjectId('67123b7af2ae020119ff20ca'), '$_id'] }] }
                    ]
                  }
                }
              }
            ],
            as: 'result'
          }
        },
        { $addFields: { result: { $first: '$result' } } },
        // Lấy thông tin user nhắn tin nhắn cuối
        { $lookup: { from: 'user', localField: 'lastMessage.userId', foreignField: '_id', as: 'user' } },
        { $addFields: { user: { $first: '$user' } } },
        // Sắp xếp cuộc trò chuyện theo thời gian tin nhắn cuối cùng gần đây nhất
        { $sort: { 'lastMessage.createdAt': -1 } },
        // Chọn các trường cần lấy
        { $addFields: { lastMessage: { username: '$user.username' } } },
        {
          $project: {
            _id: 1,
            type: 1,
            name: { $cond: [{ $ne: ['$type', 2] }, '$result.username', '$name'] },
            avatar: { $cond: [{ $ne: ['$type', 2] }, '$result.avatar', '$avatar'] },
            lastMessage: 1
          }
        }
      ])
      .toArray()
  }
}
export default conversationService
