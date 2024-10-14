import { createHash } from 'node:crypto'

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex')

export default hashPassword
