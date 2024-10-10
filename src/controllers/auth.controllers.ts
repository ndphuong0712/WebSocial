import { Request, Response } from 'express'

const registerController = (req: Request, res: Response) => {
  res.json({ message: 'Đăng kí thành công' })
}

export { registerController }
