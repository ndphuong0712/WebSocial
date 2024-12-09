import { ObjectId } from 'mongodb'
import database from './database.services'
import { changePasswordType, searchUserType, updateUserType } from '@models/collections/user.models'
import { deleteCloudinaryFile } from '@utils/cloudinary'
import { Accountstatus, FileType } from '@constants/enum'
import hashPassword from '@utils/hashPassword'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import { PaginationTimeType } from '@models/pagination'
import mediaService from './media.services'

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
    return database.users.findOne({ email, accountStatus: Accountstatus.Verified }, { projection: { _id: 1 } })
  },

  getUserById(userId: string) {
    return database.users.findOne(
      { _id: new ObjectId(userId), accountStatus: Accountstatus.Verified },
      { projection: { accountStatus: 0, password: 0, email: 0, dateOfBirth: 0, gender: 0, createdAt: 0, updatedAt: 0 } }
    )
  },

  getUserIdByUsername(username: string) {
    return database.users.findOne({ username }, { projection: { _id: 1 } })
  },

  getBasicInfoById(userId: string) {
    return database.users.findOne({ _id: new ObjectId(userId) }, { projection: { _id: 1, username: 1, avatar: 1 } })
  },

  updateInfo({ userId, userInfo }: { userId: string; userInfo: updateUserType }) {
    return database.users.updateOne({ _id: new ObjectId(userId) }, { $set: { ...userInfo, updatedAt: new Date() } })
  },

  async changeAvatar({ userId, file }: { userId: string; file: Express.Multer.File }) {
    const { url, id, type } = await mediaService.handleUploadOneFileToCloudiary(file)
    const user = await database.users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { avatar: { url, id, type: FileType.Image }, updatedAt: new Date() } },
      { projection: { avatar: 1, _id: 0 } }
    )

    if (user?.avatar.id !== '') {
      await deleteCloudinaryFile(user?.avatar.id as string)
    }
    return { url, id, type }
  },

  async changePassword({ userId, currentPassword, newPassword }: changePasswordType) {
    const result = await database.users.updateOne(
      { _id: new ObjectId(userId), password: hashPassword(currentPassword) },
      { $set: { password: hashPassword(newPassword), updatedAt: new Date() } }
    )
    if (result.matchedCount === 0) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.UNAUTHORIZED, message: 'CurrentPassword is incorrect' })
    }
  },

  async getUser({ userId, myId }: { userId: string; myId?: string }) {
    const objUserId = new ObjectId(userId)
    const objmyId = new ObjectId(myId)
    const [user, numberFollowers, numberFollowings, isUserFollowMe, isFollowUser] = await Promise.all([
      database.users.findOne(
        { _id: objUserId },
        // { projection: { username: 1, fullname: 1, biography: 1, avatar: 1, links: 1 } }
        { projection: { username: 1, fullname: 1, biography: 1, avatar: 1 } }
      ),
      database.follows.countDocuments({ followingId: objUserId }),
      database.follows.countDocuments({ followerId: objUserId }),
      database.follows.findOne({ followerId: objUserId, followingId: objmyId }),
      database.follows.findOne({ followerId: objmyId, followingId: objUserId })
    ])

    if (!user) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: 'User not found' })
    }

    return {
      ...user,
      numberFollowers,
      numberFollowings,
      isUserFollowMe: isUserFollowMe !== null ? true : false,
      isFollowUser: isFollowUser !== null ? true : false
    }
  },

  async getMe(userId: string) {
    const objUserId = new ObjectId(userId)
    const [user, numberFollowers, numberFollowings] = await Promise.all([
      database.users.findOne(
        { _id: objUserId },
        {
          projection: {
            username: 1,
            email: 1,
            fullname: 1,
            dateOfBirth: 1,
            gender: 1,
            biography: 1,
            avatar: 1
            // links: 1
          }
        }
      ),
      database.follows.countDocuments({ followingId: objUserId }),
      database.follows.countDocuments({ followerId: objUserId })
    ])
    return { ...user, numberFollowers, numberFollowings }
  },

  searchUser({ search, fullname, userId, lastTime, limit }: searchUserType & PaginationTimeType & { userId?: string }) {
    const $match: any = { accountStatus: 1 }
    fullname !== undefined ? ($match.$text = { $search: search }) : ($match.username = new RegExp(search, 'i'))
    lastTime !== undefined ? ($match.createdAt = { $gt: lastTime }) : {}
    return database.users
      .aggregate([
        {
          $match
        },
        {
          $lookup: {
            from: 'follow',
            localField: '_id',
            foreignField: 'followingId',
            pipeline: [
              {
                $match: {
                  followerId: new ObjectId(userId)
                }
              }
            ],
            as: 'isFollow'
          }
        },
        {
          $addFields: {
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
            username: 1,
            fullname: 1,
            avatar: 1,
            isFollow: 1,
            createdAt: 1
          }
        },
        {
          $sort: {
            createdAt: 1
          }
        },
        {
          $limit: limit
        }
      ])
      .toArray()
  }
}

export { userService }
