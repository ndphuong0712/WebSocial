import Comment, { createCommentType } from '@models/collections/comment.models'
import database from './database.services'
import { ObjectId } from 'mongodb'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { Audience } from '@constants/enum'

const commentService = {
  getComment(commentId: string) {
    return database.comments.findOne({ _id: new ObjectId(commentId) })
  },

  createComment(data: createCommentType) {
    return database.comments.insertOne(new Comment(data))
  },

  deleteComment({ userId, commentId }: { userId: string; commentId: string }) {
    return database.comments.deleteOne({ _id: new ObjectId(commentId), userId: new ObjectId(userId) })
  },

  async getCommentsByPost({ userId, postId, sort }: { userId: string; postId: string; sort: 1 | -1 }) {
    const [data] = await database.posts
      .aggregate([
        { $match: { _id: new ObjectId(postId) } },
        {
          $lookup: {
            from: 'follow',
            localField: 'userId',
            foreignField: 'followingId',
            pipeline: [
              {
                $match: {
                  followerId: new ObjectId(userId)
                }
              }
            ],
            as: 'follows'
          }
        },
        {
          $addFields: {
            isFollow: {
              $size: '$follows'
            }
          }
        },
        {
          $lookup: {
            from: 'comment',
            localField: '_id',
            foreignField: 'postId',
            pipeline: [
              {
                $lookup: {
                  from: 'user',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'user'
                }
              },
              {
                $unwind: '$user'
              },
              {
                $sort: {
                  createdAt: sort === -1 ? -1 : 1
                }
              },
              {
                $project: {
                  originalCommentId: 1,
                  content: 1,
                  user: {
                    _id: 1,
                    username: 1,
                    avatar: 1
                  },
                  createdAt: 1
                }
              }
            ],
            as: 'comments'
          }
        },
        {
          $project: {
            isFollow: 1,
            userId: 1,
            audience: 1,
            comments: 1,
            _id: 0
          }
        }
      ])
      .toArray()
    if (!data) throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'PostId not found' })
    if (userId !== data.userId.toString() && data.audience !== Audience.Public) {
      if (data.audience === Audience.Private || data.isFollow === false) {
        throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: 'You cannot access commnet in this post' })
      }
    }
    const comments: any[] = []
    const children: any = {}
    data.comments.forEach((comment: any) => {
      if (comment.originalCommentId === null) comments.push(comment)
      else {
        const id = comment.originalCommentId.toString()
        if (!children[id]) children[id] = []
        sort === -1 ? children[id].unshift(comment) : children[id].push(comment)
      }
    })
    return comments.map(comment => ({ ...comment, children: children[comment._id.toString()] ?? [] }))
  }
}

export default commentService
