import { ObjectId } from 'mongodb'
import database from './database.services'

const userService = {
  async isExistEmail(email: string) {
    const user = await database.users.findOne({ email })
    return !!user
  },

  async isExistUsername(username: string) {
    const user = await database.users.findOne({ username })
    return !!user
  },

  getUserIdByEmail(email: string) {
    return database.users.findOne({ email, accountStatus: 1 }, { projection: { _id: 1 } })
  },

  getUserById(userId: string) {
    return database.users.findOne(
      { _id: new ObjectId(userId), accountStatus: 1 },
      { projection: { accountStatus: 0, password: 0, email: 0, createdAt: 0, updatedAt: 0 } }
    )
  }
}

export { userService }
