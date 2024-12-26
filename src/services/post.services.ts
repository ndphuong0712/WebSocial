import { ObjectId } from 'mongodb'
import database from './database.services'
import { Audience } from '@constants/enum'
import Post, { createPostType, updatePostType } from '@models/collections/post.models'
import mediaService from './media.services'
import { deleteCloudinaryFile } from '@utils/cloudinary'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { PaginationTimeType } from '@models/pagination'

const postService = {
  async isPostPublicExist(postId: string) {
    const post = await database.posts.findOne(
      { _id: new ObjectId(postId), audience: Audience.Public, originalPostId: null },
      { projection: { _id: 1 } }
    )
    return !!post
  },

  getMediaPost({ userId, postId }: { userId: string; postId: string }) {
    return database.posts.findOne(
      { _id: new ObjectId(postId), userId: new ObjectId(userId) },
      { projection: { _id: 0, media: 1 } }
    )
  },

  getPost(postId: string) {
    return database.posts.findOne({ _id: new ObjectId(postId) }, { projection: { createdAt: 0, updatedAt: 0 } })
  },

  async createPost({
    userId,
    audience,
    originalPostId,
    content,
    files
  }: Omit<createPostType, 'media'> & { files: Express.Multer.File[] }) {
    const media = await mediaService.handleUploadMultipleFilesToCloudinary(files)
    await database.posts.insertOne(new Post({ userId, audience, originalPostId, content, media }))
  },

  async updatePost({ postId, userId, audience, content, deleteMedia, oldMedia, files }: updatePostType) {
    if (audience === undefined && content === undefined && deleteMedia.length === 0 && files.length === 0) {
      return
    }
    const media = await mediaService.handleUploadMultipleFilesToCloudinary(files)
    let newMedia = oldMedia.filter(v1 => !deleteMedia.some(v2 => v2 === v1.id))
    newMedia = [...newMedia, ...media]
    const updateObj: any = { media: newMedia, updatedAt: new Date() }
    if (audience !== undefined) updateObj.audience = audience
    if (content !== undefined) updateObj.content = content
    const [result] = await Promise.all([
      database.posts.findOneAndUpdate(
        { _id: new ObjectId(postId), userId: new ObjectId(userId) },
        { $set: updateObj },
        { returnDocument: 'after' }
      ),
      ...deleteMedia.map(id => deleteCloudinaryFile(id))
    ])
    return result
  },

  async getDetailPost({ userId, postId }: { userId?: string; postId: string }) {
    const userIdObj = new ObjectId(userId)
    const [post]: any = await database.posts
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
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
            from: 'like',
            localField: '_id',
            foreignField: 'postId',
            as: 'numberLikes'
          }
        },
        {
          $lookup: {
            from: 'comment',
            localField: '_id',
            foreignField: 'postId',
            as: 'numberComments'
          }
        },
        {
          $lookup: {
            from: 'post',
            localField: '_id',
            foreignField: 'originalPostId',
            as: 'numberShares'
          }
        },
        {
          $lookup: {
            from: 'like',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [
              {
                $match: {
                  userId: userIdObj
                }
              }
            ],
            as: 'isLike'
          }
        },
        {
          $lookup: {
            from: 'bookmark',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [
              {
                $match: {
                  userId: userIdObj
                }
              }
            ],
            as: 'isBookmark'
          }
        },
        {
          $lookup: {
            from: 'follow',
            localField: 'userId',
            foreignField: 'followingId',
            pipeline: [
              {
                $match: {
                  followerId: userIdObj
                }
              }
            ],
            as: 'isFollow'
          }
        },
        {
          $addFields: {
            numberLikes: {
              $size: '$numberLikes'
            },
            numberComments: {
              $size: '$numberComments'
            },
            numberShares: {
              $size: '$numberShares'
            },
            isLike: {
              $gt: [
                {
                  $size: '$isLike'
                },
                0
              ]
            },
            isBookmark: {
              $gt: [
                {
                  $size: '$isBookmark'
                },
                0
              ]
            },
            isFollow: {
              $gt: [
                {
                  $size: '$isFollow'
                },
                0
              ]
            }
          }
        },
        {
          $project: {
            audience: 1,
            originalPostId: 1,
            content: 1,
            media: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: 1,
              username: 1,
              avatar: 1
            },
            numberLikes: 1,
            numberComments: 1,
            numberShares: 1,
            isLike: 1,
            isBookmark: 1,
            isFollow: 1
          }
        }
      ])
      .toArray()
    if (!post) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'PostId not found' })
    }
    if (userId !== post?.user._id.toString() && post.audience !== Audience.Public) {
      if (post.audience === Audience.Private || post.isFollow === false) {
        throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: 'You cannot access this post' })
      }
    }
    return post
  },

  async getBasicInfoPost({ userId, postId }: { userId?: string; postId: string }) {
    const [post] = await database.posts
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId)
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'userResult'
          }
        },
        {
          $unwind: {
            path: '$userResult'
          }
        },
        {
          $lookup: {
            from: 'follow',
            let: {
              userId: '$userId'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$followerId', new ObjectId(userId)]
                      },
                      {
                        $eq: ['$followingId', '$$userId']
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
            isFollow: {
              $cond: [
                {
                  $eq: [
                    {
                      $size: '$isFollow'
                    },
                    1
                  ]
                },
                true,
                false
              ]
            },
            user: {
              _id: '$userResult._id',
              username: '$userResult.username',
              avatar: '$userResult.avatar'
            }
          }
        },
        {
          $unset: 'userResult'
        }
      ])
      .toArray()
    if (!post) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'PostId not found' })
    }
    if (userId !== post?.user._id.toString() && post.audience !== Audience.Public) {
      if (post.audience === Audience.Private || post.isFollow === false) {
        throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: 'You cannot access this post' })
      }
    }
    return post
  },

  getNewsFeed({ userId, lastTime, limit }: { userId: string } & PaginationTimeType) {
    const userIdObj = new ObjectId(userId)
    return database.follows
      .aggregate([
        {
          $match: { followerId: userIdObj }
        },
        {
          $lookup: { from: 'post', localField: 'followingId', foreignField: 'userId', as: 'posts' }
        },
        {
          $unwind: { path: '$posts' }
        },
        {
          $replaceRoot: { newRoot: '$posts' }
        },
        {
          $match: {
            audience: { $in: [Audience.Public, Audience.Followers] },
            createdAt: { $lt: lastTime ?? new Date() }
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: limit
        },
        {
          $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'user' }
        },
        {
          $unwind: { path: '$user' }
        },
        {
          $lookup: { from: 'like', localField: '_id', foreignField: 'postId', as: 'numberLikes' }
        },
        {
          $lookup: { from: 'comment', localField: '_id', foreignField: 'postId', as: 'numberComments' }
        },
        {
          $lookup: { from: 'post', localField: '_id', foreignField: 'originalPostId', as: 'numberShares' }
        },
        {
          $lookup: {
            from: 'like',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: userIdObj } }],
            as: 'isLike'
          }
        },
        {
          $lookup: {
            from: 'bookmark',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: userIdObj } }],
            as: 'isBookmark'
          }
        },
        {
          $addFields: {
            numberLikes: { $size: '$numberLikes' },
            numberComments: { $size: '$numberComments' },
            numberShares: { $size: '$numberShares' },
            isLike: { $gt: [{ $size: '$isLike' }, 0] },
            isBookmark: { $gt: [{ $size: '$isBookmark' }, 0] }
          }
        },
        {
          $project: {
            user: { _id: 1, username: 1, avatar: 1 },
            audience: 1,
            originalPostId: 1,
            content: 1,
            media: 1,
            createdAt: 1,
            updatedAt: 1,
            numberLikes: 1,
            numberComments: 1,
            numberShares: 1,
            isLike: 1,
            isBookmark: 1
          }
        }
      ])
      .toArray()
  },

  getNewsFeedWithoutLogin(lastTime: Date | undefined) {
    return database.posts
      .aggregate([
        {
          $match: { audience: Audience.Public, createdAt: { $lt: lastTime ?? new Date() } }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: { from: 'user', localField: 'userId', foreignField: '_id', as: 'user' }
        },
        {
          $unwind: { path: '$user' }
        },
        {
          $lookup: { from: 'like', localField: '_id', foreignField: 'postId', as: 'numberLikes' }
        },
        {
          $lookup: { from: 'comment', localField: '_id', foreignField: 'postId', as: 'numberComments' }
        },
        {
          $lookup: { from: 'post', localField: '_id', foreignField: 'originalPostId', as: 'numberShares' }
        },
        {
          $addFields: {
            numberLikes: { $size: '$numberLikes' },
            numberComments: { $size: '$numberComments' },
            numberShares: { $size: '$numberShares' }
          }
        },
        {
          $project: {
            user: { _id: 1, username: 1, avatar: 1 },
            audience: 1,
            originalPostId: 1,
            content: 1,
            media: 1,
            createdAt: 1,
            updatedAt: 1,
            numberLikes: 1,
            numberComments: 1,
            numberShares: 1
          }
        }
      ])
      .toArray()
  },

  getPostsByUser({ userId, myId, lastTime, limit }: { userId: string; myId?: string } & PaginationTimeType) {
    return database.users
      .aggregate([
        {
          $match: { _id: new ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'follow',
            let: { followingId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$followerId', new ObjectId(myId)] }, { $eq: ['$followingId', '$$followingId'] }]
                  }
                }
              }
            ],
            as: 'isFollow'
          }
        },
        {
          $addFields: { isFollow: { $gt: [{ $size: '$isFollow' }, 0] } }
        },
        {
          $lookup: {
            from: 'post',
            localField: '_id',
            foreignField: 'userId',
            let: { isFollow: '$isFollow' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$audience', 0] },
                      {
                        $and: [
                          { $or: [{ $eq: ['$$isFollow', true] }, { $eq: ['$userId', new ObjectId(myId)] }] },
                          { $eq: ['$audience', 1] }
                        ]
                      },
                      { $and: [{ $eq: ['$audience', 2] }, { $eq: ['$userId', new ObjectId(myId)] }] }
                    ]
                  }
                }
              }
            ],
            as: 'post'
          }
        },
        {
          $unwind: { path: '$post' }
        },
        {
          $lookup: { from: 'like', localField: 'post._id', foreignField: 'postId', as: 'numberLikes' }
        },
        {
          $lookup: { from: 'comment', localField: 'post._id', foreignField: 'postId', as: 'numberComments' }
        },
        {
          $lookup: { from: 'post', localField: 'post._id', foreignField: 'originalPostId', as: 'numberShares' }
        },
        {
          $lookup: {
            from: 'like',
            localField: 'post._id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: new ObjectId(myId) } }],
            as: 'isLike'
          }
        },
        {
          $lookup: {
            from: 'bookmark',
            localField: 'post._id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: new ObjectId(myId) } }],
            as: 'isBookmark'
          }
        },
        {
          $addFields: {
            user: { _id: '$_id', username: '$username', avatar: '$avatar' },
            _id: '$post._id',
            audience: '$post.audience',
            originalPostId: '$post.originalPostId',
            content: '$post.content',
            media: '$post.media',
            createdAt: '$post.createdAt',
            updatedAt: '$post.updatedAt',
            numberLikes: { $size: '$numberLikes' },
            numberComments: { $size: '$numberComments' },
            numberShares: { $size: '$numberShares' },
            isLike: { $gt: [{ $size: '$isLike' }, 0] },
            isBookmark: { $gt: [{ $size: '$isBookmark' }, 0] }
          }
        },
        {
          $project: {
            user: 1,
            _id: 1,
            audience: 1,
            originalPostId: 1,
            content: 1,
            media: 1,
            createdAt: 1,
            updatedAt: 1,
            numberLikes: 1,
            numberComments: 1,
            numberShares: 1,
            isLike: 1,
            isBookmark: 1
          }
        },
        {
          $match: { createdAt: { $lt: lastTime ?? new Date() } }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: limit
        }
      ])
      .toArray()
  },

  getLikePostsByUser({ userId, lastTime, limit }: { userId: string } & PaginationTimeType) {
    const userIdObj = new ObjectId(userId)
    return database.likes
      .aggregate([
        {
          $match: { userId: userIdObj, createdAt: { $lt: lastTime ?? new Date() } }
        },
        {
          $lookup: { from: 'post', localField: 'postId', foreignField: '_id', as: 'post' }
        },
        {
          $lookup: { from: 'user', localField: 'post.userId', foreignField: '_id', as: 'user' }
        },
        {
          $lookup: {
            from: 'follow',
            localField: 'user._id',
            foreignField: 'followingId',
            pipeline: [{ $match: { followerId: userIdObj } }],
            as: 'isFollow'
          }
        },
        {
          $unwind: { path: '$post' }
        },
        {
          $unwind: { path: '$user' }
        },
        {
          $addFields: { isFollow: { $gt: [{ $size: '$isFollow' }, 0] } }
        },
        {
          $match: {
            $or: [{ 'post.audience': 0 }, { 'post.audience': 1, isFollow: true }, { 'user._id': userIdObj }]
          }
        },
        {
          $lookup: { from: 'like', localField: 'post._id', foreignField: 'postId', as: 'numberLikes' }
        },
        {
          $lookup: { from: 'comment', localField: 'post._id', foreignField: 'postId', as: 'numberComments' }
        },
        {
          $lookup: { from: 'post', localField: 'post._id', foreignField: 'originalPostId', as: 'numberShares' }
        },
        {
          $lookup: {
            from: 'bookmark',
            localField: 'post._id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: userIdObj } }],
            as: 'isBookmark'
          }
        },
        {
          $addFields: {
            _id: '$post._id',
            audience: '$post.audience',
            originalPostId: '$post.originalPostId',
            content: '$post.content',
            media: '$post.media',
            createdAt: '$post.createdAt',
            updatedAt: '$post.updatedAt',
            numberLikes: { $size: '$numberLikes' },
            numberComments: { $size: '$numberComments' },
            numberShares: { $size: '$numberShares' },
            isBookmark: { $gt: [{ $size: '$isBookmark' }, 0] },
            isLike: true,
            likeAt: '$createdAt'
          }
        },
        {
          $unset: [
            'userId',
            'postId',
            'post',
            'user.email',
            'user.password',
            'user.accountStatus',
            'user.fullname',
            'user.dateOfBirth',
            'user.gender',
            'user.biography',
            // 'user.links',
            'user.createdAt',
            'user.updatedAt'
          ]
        },
        {
          $sort: { likeAt: -1 }
        },
        { $limit: limit }
      ])
      .toArray()
  },

  getBookmarkPostsByUser({ userId, lastTime, limit }: { userId: string } & PaginationTimeType) {
    const userIdObj = new ObjectId(userId)
    return database.bookmarks
      .aggregate([
        {
          $match: { userId: userIdObj, createdAt: { $lt: lastTime ?? new Date() } }
        },
        {
          $lookup: { from: 'post', localField: 'postId', foreignField: '_id', as: 'post' }
        },
        {
          $lookup: { from: 'user', localField: 'post.userId', foreignField: '_id', as: 'user' }
        },
        {
          $lookup: {
            from: 'follow',
            localField: 'user._id',
            foreignField: 'followingId',
            pipeline: [{ $match: { followerId: userIdObj } }],
            as: 'isFollow'
          }
        },
        {
          $unwind: { path: '$post' }
        },
        {
          $unwind: { path: '$user' }
        },
        {
          $addFields: { isFollow: { $gt: [{ $size: '$isFollow' }, 0] } }
        },
        {
          $match: {
            $or: [{ 'post.audience': 0 }, { 'post.audience': 1, isFollow: true }, { 'user._id': userIdObj }]
          }
        },
        {
          $lookup: { from: 'like', localField: 'post._id', foreignField: 'postId', as: 'numberLikes' }
        },
        {
          $lookup: { from: 'comment', localField: 'post._id', foreignField: 'postId', as: 'numberComments' }
        },
        {
          $lookup: { from: 'post', localField: 'post._id', foreignField: 'originalPostId', as: 'numberShares' }
        },
        {
          $lookup: {
            from: 'like',
            localField: 'post._id',
            foreignField: 'postId',
            pipeline: [{ $match: { userId: userIdObj } }],
            as: 'isLike'
          }
        },
        {
          $addFields: {
            _id: '$post._id',
            audience: '$post.audience',
            originalPostId: '$post.originalPostId',
            content: '$post.content',
            createdAt: '$post.createdAt',
            updatedAt: '$post.updatedAt',
            media: '$post.media',
            numberLikes: { $size: '$numberLikes' },
            numberComments: { $size: '$numberComments' },
            numberShares: { $size: '$numberShares' },
            isLike: { $gt: [{ $size: '$isLike' }, 0] },
            isBookmark: true,
            bookmarkAt: '$createdAt'
          }
        },
        {
          $unset: [
            'userId',
            'postId',
            'post',
            'user.email',
            'user.password',
            'user.accountStatus',
            'user.fullname',
            'user.dateOfBirth',
            'user.gender',
            'user.biography',
            // 'user.links',
            'user.createdAt',
            'user.updatedAt'
          ]
        },
        {
          $sort: { bookmarkAt: -1 }
        },
        { $limit: limit }
      ])
      .toArray()
  },

  deletePost({ userId, postId }: { userId: string; postId: string }) {
    return database.posts.deleteOne({ _id: new ObjectId(postId), userId: new ObjectId(userId) })
  }
}

export default postService
