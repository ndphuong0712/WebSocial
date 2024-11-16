import User, { loginType, registerType } from '@models/collections/user.models'
import database from './database.services'
import { TokenDecodeType, TokenPayloadType } from '@models/token'
import { signToken, verifyToken } from '@utils/jwt'
import ENV from '@constants/env'
import { Accountstatus } from '@constants/enum'
import { ObjectId } from 'mongodb'
import hashPassword from '@utils/hashPassword'
import ErrorWithStatus from '@models/error'
import HTTP_STATUS from '@constants/httpStatus'
import RefreshToken from '@models/collections/refreshToken.models'
import axios from 'axios'
import conversationService from './conversation.services'

const authService = {
  async register(userRegister: registerType) {
    userRegister.password = hashPassword(userRegister.password)
    const { insertedId } = await database.users.insertOne(new User(userRegister))
    return insertedId
  },

  signVerifyEmailToken(payload: TokenPayloadType) {
    return signToken({
      payload,
      secretKey: ENV.VERIFY_EMAIL_TOKEN_SECRET_KEY,
      options: { expiresIn: ENV.VERIFY_EMAIL_TOKEN_EXPIRES_IN }
    })
  },

  signAccessToken(payload: TokenPayloadType) {
    return signToken({
      payload,
      secretKey: ENV.ACCESS_TOKEN_SECRET_KEY,
      options: { expiresIn: ENV.ACCESS_TOKEN_EXPIRES_IN }
    })
  },

  signRefreshToken(payload: TokenPayloadType, expiresIn: boolean = true) {
    let options = {}
    if (expiresIn) options = { expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN }
    return signToken({
      payload,
      secretKey: ENV.REFRESH_TOKEN_SECRET_KEY,
      options
    })
  },

  signForgetPasswordToken(payload: TokenPayloadType) {
    return signToken({
      payload,
      secretKey: ENV.FORGET_PASSWORD_TOKEN_SECRET_KEY,
      options: { expiresIn: ENV.FORGET_PASSWORD_TOKEN_EXPIRES_IN }
    })
  },

  verifyEmailToken(token: string) {
    return verifyToken({ token, secretKey: ENV.VERIFY_EMAIL_TOKEN_SECRET_KEY })
  },

  verifyAccessToken(token: string) {
    return verifyToken({ token, secretKey: ENV.ACCESS_TOKEN_SECRET_KEY })
  },

  verifyRefreshToken(token: string) {
    return verifyToken({ token, secretKey: ENV.REFRESH_TOKEN_SECRET_KEY })
  },

  verifyForgetPasswordToken(token: string) {
    return verifyToken({ token, secretKey: ENV.FORGET_PASSWORD_TOKEN_SECRET_KEY })
  },

  async verifyEmail(userId: string) {
    const result = await database.users.updateOne(
      { _id: new ObjectId(userId), accountStatus: Accountstatus.Unverified },
      { $set: { accountStatus: Accountstatus.Verified, updatedAt: new Date() }, $unset: { timeVerifyEmail: '' } }
    )
    return result.matchedCount === 1
  },

  async login(userLogin: loginType) {
    const user = await database.users.findOne({
      email: userLogin.email,
      password: hashPassword(userLogin.password),
      accountStatus: Accountstatus.Verified
    })
    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: 'Password or username is incorrect'
      })
    }
    const [refreshToken, accessToken] = await Promise.all([
      this.signRefreshToken({ _id: user._id.toString() }),
      this.signAccessToken({ _id: user._id.toString() })
    ])
    await database.refreshTokens.insertOne(new RefreshToken({ userId: user._id, token: refreshToken }))
    return { refreshToken, accessToken, user: { _id: user._id, username: user.username, avatar: user.avatar } }
  },

  async handleRefreshToken(tokenDecode: TokenDecodeType, oldRefreshToken: string) {
    const [refreshToken, accessToken] = await Promise.all([
      this.signRefreshToken({ _id: tokenDecode._id, exp: tokenDecode.exp }, false),
      this.signAccessToken({ _id: tokenDecode._id })
    ])
    await database.refreshTokens.updateOne(
      { token: oldRefreshToken },
      { $set: { token: refreshToken, updatedAt: new Date() } }
    )
    return { refreshToken, accessToken }
  },

  logout(refreshToken: string) {
    return database.refreshTokens.deleteOne({ token: refreshToken })
  },

  resetPassword({ userId, password }: { userId: string; password: string }) {
    return database.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashPassword(password), updatedAt: new Date() } }
    )
  },

  async loginGoogle(code: string) {
    const { access_token, id_token } = await getGoogleOauthToken(code as string)
    const userInfo = await getGoogleUserInfo(access_token, id_token)
    let user = await database.users.findOne({ email: userInfo.email })
    if (user && user.accountStatus === Accountstatus.Unverified) {
      await database.users.deleteOne({ email: userInfo.email })
    }
    if (!user || user.accountStatus === Accountstatus.Unverified) {
      user = new User({
        username: '',
        email: userInfo.email,
        fullname: userInfo.name,
        password: '',
        avartar: userInfo.picture
      })
      user.username = user._id.toString()
      user.accountStatus = Accountstatus.Verified
      delete user.timeVerifyEmail
      await Promise.all([
        database.users.insertOne(user),
        conversationService.createPersonalConversation(user._id.toString())
      ])
    }
    const [refreshToken, accessToken] = await Promise.all([
      this.signRefreshToken({ _id: user._id.toString() }),
      this.signAccessToken({ _id: user._id.toString() })
    ])
    await database.refreshTokens.insertOne(new RefreshToken({ userId: user._id, token: refreshToken }))
    return { refreshToken, accessToken }
  }
}

const getGoogleOauthToken = async (code: string) => {
  const body = {
    code,
    client_id: ENV.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: ENV.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: ENV.GOOGLE_OAUTH_REDIRECT_URI,
    grant_type: 'authorization_code'
  }
  const { data } = await axios.post('https://oauth2.googleapis.com/token', body)
  return data
}

const getGoogleUserInfo = async (access_token: string, id_token: string) => {
  const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
    params: { access_token },
    headers: { Authorization: `Bearer ${id_token}` }
  })
  return data
}

export default authService
