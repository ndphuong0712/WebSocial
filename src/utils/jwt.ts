import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import { TokenDecodeType, TokenPayloadType } from '@models/token'
import jwt from 'jsonwebtoken'

const signToken = ({
  payload,
  secretKey,
  options = {}
}: {
  payload: TokenPayloadType
  secretKey: string
  options: jwt.SignOptions
}) =>
  new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) reject(err)
      else resolve(token as string)
    })
  })

const verifyToken = ({ token, secretKey }: { token: string; secretKey: string }) =>
  new Promise<TokenDecodeType>((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decode) => {
      if (err) {
        if (err.message === 'jwt expired')
          reject(new ErrorWithStatus({ status: HTTP_STATUS.UNAUTHORIZED, message: err.message }))
        else reject(new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: err.message }))
      } else resolve(decode as TokenDecodeType)
    })
  })

export { signToken, verifyToken }
