import { TokenDecodeType } from '@models/token'

declare module 'express' {
  interface Request {
    tokenDecode?: TokenDecodeType
  }
}
