import Bookmark, { createBookmarkType } from '@models/collections/bookmark.models'
import postService from './post.services'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { Audience } from '@constants/enum'
import followService from './follow.services'
import database from './database.services'
import { ObjectId } from 'mongodb'

const bookmarkService = {
  async createBookmark({ postId, userId }: createBookmarkType) {
    const post = await postService.getPost(postId)
    if (!post) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'Post not found' })
    }
    if (post.userId.toString() !== userId) {
      if (post.audience === Audience.Private) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.FORBIDDEN,
          message: 'You do not have permission to bookmark this post'
        })
      } else if (post.audience === Audience.Followers) {
        const followerIds = await followService.getAllFollowerIds(post.userId.toString())
        if (!followerIds.some(followerId => followerId.toString() === userId)) {
          throw new ErrorWithStatus({
            status: HTTP_STATUS.FORBIDDEN,
            message: 'You do not have permission to bookmark this post'
          })
        }
      }
    }
    await database.bookmarks.updateOne(
      { userId: new ObjectId(userId), postId: post._id },
      { $setOnInsert: new Bookmark({ userId, postId }) },
      { upsert: true }
    )
  },

  unbookmark({ postId, userId }: createBookmarkType) {
    return database.bookmarks.deleteOne({ postId: new ObjectId(postId), userId: new ObjectId(userId) })
  }
}

export default bookmarkService
