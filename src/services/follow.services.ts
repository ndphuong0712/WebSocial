import Follow, { followType } from '@models/collections/follow.models'
import database from './database.services'
import { ObjectId } from 'mongodb'

const followService = {
  follow({ followerId, followingId }: followType) {
    return database.follows.updateOne(
      { followerId: new ObjectId(followerId), followingId: new ObjectId(followingId) },
      { $setOnInsert: new Follow({ followerId, followingId }) },
      { upsert: true }
    )
  },

  unfollow({ followerId, followingId }: followType) {
    return database.follows.deleteOne({ followerId: new ObjectId(followerId), followingId: new ObjectId(followingId) })
  },

  async getAllFollowingIds(userId: string) {
    const followingIds = await database.follows
      .find({ followerId: new ObjectId(userId) }, { projection: { _id: 0, followingId: 1 } })
      .toArray()
    return followingIds.map(i => i.followingId)
  },

  async getAllFollowerIds(userId: string) {
    const followerIds = await database.follows
      .find({ followingId: new ObjectId(userId) }, { projection: { _id: 0, followerId: 1 } })
      .toArray()
    return followerIds.map(i => i.followerId)
  },

  async getAllFollowings({ userId, myId }: { userId: string; myId?: string }) {
    let isFollowUser: any = true
    if (!myId) {
      isFollowUser = false
    } else if (userId !== myId) {
      const userIds = await this.getAllFollowingIds(myId)
      isFollowUser = { $in: ['$userId', userIds] }
    }
    return database.follows
      .aggregate([
        {
          $match: {
            followerId: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'followingId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            _id: 0,
            userId: '$user._id',
            username: '$user.username',
            avatar: '$user.avatar',
            createdAt: 1
          }
        },
        {
          $addFields: {
            isFollowUser,
            isMe: { $eq: [new ObjectId(myId), '$userId'] }
          }
        },
        {
          $sort: { isMe: -1, isFollowUser: -1 }
        }
      ])
      .toArray()
  },

  async getAllFollowers({ userId, myId }: { userId: string; myId?: string }) {
    let isFollowUser: any = false
    if (myId) {
      const userIds = await this.getAllFollowingIds(myId)
      isFollowUser = { $in: ['$userId', userIds] }
    }
    return database.follows
      .aggregate([
        {
          $match: {
            followingId: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'followerId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            _id: 0,
            userId: '$user._id',
            username: '$user.username',
            avatar: '$user.avatar',
            createdAt: 1
          }
        },
        {
          $addFields: {
            isFollowUser,
            isMe: { $eq: [new ObjectId(myId), '$userId'] }
          }
        },
        {
          $sort: { isMe: -1, isFollowUser: -1 }
        }
      ])
      .toArray()
  }
}

export default followService
