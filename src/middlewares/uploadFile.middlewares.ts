import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import uploadFile from '@utils/uploadFile'
import { NextFunction, Request, Response } from 'express'

const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  await uploadFile(['image']).single('avatar')(req, res, err => {
    if (err) return next(new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: 'Invalid file upload' }))
    next()
  })
}

export { uploadAvatar }
