import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

const validate =
  (checkSchema: RunnableValidationChains<ValidationChain>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await checkSchema.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorsMap = errors.mapped()
    for (const field in errorsMap) {
      if (errorsMap[field].msg instanceof ErrorWithStatus) {
        return next(errorsMap[field].msg)
      }
    }
    next(
      new ErrorWithStatus({ status: HTTP_STATUS.UNPROCESSABLE_ENTITY, message: 'Validation Error', errors: errorsMap })
    )
  }

export default validate
