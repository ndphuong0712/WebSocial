import Like, { createLikeType } from '@models/collections/like.models'
import postService from './post.services'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { Audience } from '@constants/enum'
import followService from './follow.services'
import { ObjectId } from 'mongodb'
import database from './database.services'

const likeService = {
  async createLike({ postId, userId }: createLikeType) {
    const post = await postService.getPost(postId)
    if (!post) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'Post not found' })
    }
    if (post.userId.toString() !== userId) {
      if (post.audience === Audience.Private) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.FORBIDDEN,
          message: 'You do not have permission to like this post'
        })
      } else if (post.audience === Audience.Followers) {
        const followerIds = await followService.getAllFollowerIds(post.userId.toString())
        if (!followerIds.some(followerId => followerId.toString() === userId)) {
          throw new ErrorWithStatus({
            status: HTTP_STATUS.FORBIDDEN,
            message: 'You do not have permission to like this post'
          })
        }
      }
    }
    await database.likes.updateOne(
      { userId: new ObjectId(userId), postId: post._id },
      { $setOnInsert: new Like({ userId, postId }) },
      { upsert: true }
    )
  },

  unlike({ postId, userId }: createLikeType) {
    return database.likes.deleteOne({ postId: new ObjectId(postId), userId: new ObjectId(userId) })
  }
}

export default likeService
