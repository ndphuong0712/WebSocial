import ENV from '@constants/env'
import Bookmark from '@models/collections/bookmark.models'
import Follow from '@models/collections/follow.models'
import Like from '@models/collections/like.models'
import Post from '@models/collections/post.models'
import RefreshToken from '@models/collections/refreshToken.models'
import User from '@models/collections/user.models'
import { Db, MongoClient } from 'mongodb'

class Database {
  private db: Db
  constructor() {
    const mongo = new MongoClient(ENV.MONGODB_CONNECTION_STRING)
    this.db = mongo.db(ENV.DB_NAME)
    this.createIndex()
  }
  async createIndex() {
    if (!(await this.users.indexExists(['timeVerifyEmail_1', 'fullname_text']))) {
      await Promise.all([
        this.users.createIndex({ timeVerifyEmail: 1 }, { expireAfterSeconds: 190 }),
        this.users.createIndex({ fullname: 'text' }, { default_language: 'none' })
      ])
    }
  }

  get users() {
    return this.db.collection<User>('user')
  }

  get refreshTokens() {
    return this.db.collection<RefreshToken>('refreshToken')
  }

  get follows() {
    return this.db.collection<Follow>('follow')
  }

  get posts() {
    return this.db.collection<Post>('post')
  }

  get likes() {
    return this.db.collection<Like>('like')
  }

  get bookmarks() {
    return this.db.collection<Bookmark>('bookmark')
  }
}
const database = new Database()
export default database
