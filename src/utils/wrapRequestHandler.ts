import { NextFunction, Request, RequestHandler, Response } from 'express'

const wrapRequestHandler = (reqHandler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await reqHandler(req, res, next)
  } catch (err) {
    next(err)
  }
}

export default wrapRequestHandler
