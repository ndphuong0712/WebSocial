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

  getAllFollowings(userId: string) {
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
        }
      ])
      .toArray()
  },

  getAllFollowers(userId: string) {
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
        }
      ])
      .toArray()
  }
}

export default followService
