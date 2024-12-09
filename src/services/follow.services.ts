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

  getAllFollowings({ userId, myId }: { userId: string; myId?: string }) {
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
          $lookup: {
            from: 'follow',
            let: {
              followingId: '$followingId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$followingId', '$followingId']
                      },
                      {
                        $eq: ['$followerId', new ObjectId(myId)]
                      }
                    ]
                  }
                }
              }
            ],
            as: 'isFollow'
          }
        },
        {
          $addFields: {
            userId: '$user._id',
            username: '$user.username',
            fullname: '$user.fullname',
            avatar: '$user.avatar',
            followAt: '$createdAt',
            isFollow: {
              $gt: [
                {
                  $size: '$isFollow'
                },
                0
              ]
            },
            isMe: {
              $eq: ['$user._id', new ObjectId(myId)]
            }
          }
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            username: 1,
            fullname: 1,
            avatar: 1,
            followAt: 1,
            isFollow: 1,
            isMe: 1
          }
        },
        {
          $sort: {
            isMe: -1,
            isFollow: -1
          }
        }
      ])
      .toArray()
  },

  getAllFollowers({ userId, myId }: { userId: string; myId?: string }) {
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
          $lookup: {
            from: 'follow',
            let: {
              followingId: '$followerId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$followerId', new ObjectId(myId)]
                      },
                      {
                        $eq: ['$followingId', '$$followingId']
                      }
                    ]
                  }
                }
              }
            ],
            as: 'isFollow'
          }
        },
        {
          $addFields: {
            userId: '$user._id',
            username: '$user.username',
            fullname: '$user.fullname',
            avatar: '$user.avatar',
            followAt: '$createdAt',
            isFollow: {
              $gt: [
                {
                  $size: '$isFollow'
                },
                0
              ]
            },
            isMe: {
              $eq: ['$user._id', new ObjectId(myId)]
            }
          }
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            username: 1,
            fullname: 1,
            avatar: 1,
            followAt: 1,
            isFollow: 1,
            isMe: 1
          }
        },
        {
          $sort: {
            isMe: -1,
            isFollow: -1
          }
        }
      ])
      .toArray()
  }
}

export default followService
