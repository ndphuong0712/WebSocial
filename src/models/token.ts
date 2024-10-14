type TokenDecodeType = {
  _id: string
  iat: number
  exp: number
}
type TokenPayloadType = Pick<TokenDecodeType, '_id'> & { exp?: number }

export { TokenPayloadType, TokenDecodeType }
