import ENV from '@constants/env'
import HTTP_STATUS from '@constants/httpStatus'
import ErrorWithStatus from '@models/error'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL_ADDRESS,
    pass: ENV.EMAIL_PASSWORD
  }
})

const sendMail = async ({ email, title, content }: { email: string; title: string; content: string }) => {
  try {
    await transporter.sendMail({
      from: ENV.EMAIL_ADDRESS,
      to: email,
      subject: title,
      html: content
    })
  } catch (e) {
    throw new ErrorWithStatus({ status: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: (e as any).message })
  }
}

const sendRegisterMail = ({ email, username, link }: { email: string; username: string; link: string }) => {
  let content = fs.readFileSync(path.resolve('src', 'templates', 'registerMail.html'), 'utf-8')
  content = content.replace('{{username}}', username).replace('{{link}}', link)
  return sendMail({ email, title: 'Xác thực tài khoản', content })
}

const sendForgetPasswordMail = ({ email, link }: { email: string; link: string }) => {
  let content = fs.readFileSync(path.resolve('src', 'templates', 'forgetPasswordMail.html'), 'utf-8')
  content = content.replace('{{link}}', link)
  return sendMail({ email, title: 'Khôi phục mật khẩu', content })
}

export { sendRegisterMail, sendForgetPasswordMail }
