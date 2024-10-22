import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import deleteFile from '@utils/deleteFile'
import { NextFunction, Request, Response } from 'express'

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (req.files) {
    await deleteFile((req.files as Express.Multer.File[]).map(file => file.path))
  }
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json({ message: err.message, errors: err.errors })
    return
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
}

export default errorHandler
