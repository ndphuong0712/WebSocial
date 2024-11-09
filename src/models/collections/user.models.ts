import { Accountstatus, FileType, Gender } from '@constants/enum'
import FileAttachmentType from '@models/fileAttachment'
import { ObjectId } from 'mongodb'

class User {
  _id: ObjectId
  username: string
  email: string
  password: string
  accountStatus: Accountstatus
  fullname: string
  dateOfBirth: Date | null
  gender: Gender
  biography: string
  avatar: FileAttachmentType
  links: string[]
  createdAt: Date
  updatedAt: Date
  timeVerifyEmail?: Date
  constructor({
    username,
    email,
    password,
    fullname,
    avartar
  }: {
    username: string
    email: string
    password: string
    fullname: string
    avartar?: string
  }) {
    const date = new Date()
    this._id = new ObjectId()
    this.username = username
    this.email = email
    this.password = password
    this.accountStatus = Accountstatus.Unverified
    this.fullname = fullname
    this.dateOfBirth = null
    this.gender = Gender.Unknown
    this.biography = ''
    this.avatar = {
      url: avartar ?? '',
      id: '',
      type: FileType.Image
    }
    this.links = []
    this.createdAt = date
    this.updatedAt = date
    this.timeVerifyEmail = date
  }
}

type registerType = Pick<User, 'username' | 'email' | 'password' | 'fullname'> & { avatar?: string }
type loginType = Pick<User, 'email' | 'password'>
type updateUserType = Partial<Pick<User, 'username' | 'fullname' | 'dateOfBirth' | 'gender' | 'biography' | 'links'>>
type changePasswordType = {
  userId: string
  currentPassword: string
  newPassword: string
}
type searchUserType = {
  search: string
  fullname?: string
}

export { User as default, registerType, loginType, updateUserType, changePasswordType, searchUserType }
