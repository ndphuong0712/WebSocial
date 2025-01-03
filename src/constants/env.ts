import 'dotenv/config'
const ENV = {
  PORT: process.env.PORT as string,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING as string,
  DB_NAME: process.env.DB_NAME as string,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  VERIFY_EMAIL_TOKEN_SECRET_KEY: process.env.VERIFY_EMAIL_TOKEN_SECRET_KEY as string,
  VERIFY_EMAIL_TOKEN_EXPIRES_IN: process.env.VERIFY_EMAIL_TOKEN_EXPIRES_IN as string,
  ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  FORGET_PASSWORD_TOKEN_SECRET_KEY: process.env.FORGET_PASSWORD_TOKEN_SECRET_KEY as string,
  FORGET_PASSWORD_TOKEN_EXPIRES_IN: process.env.FORGET_PASSWORD_TOKEN_EXPIRES_IN as string,
  CLIENT_URL_LOGIN: process.env.CLIENT_URL_LOGIN as string,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
  GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  CLIENT_URL_VERIFY_EMAIL: process.env.CLIENT_URL_VERIFY_EMAIL as string,
  CLIENT_URL_RESET_PASSWORD: process.env.CLIENT_URL_RESET_PASSWORD as string,
  CLIENT_URL: process.env.CLIENT_URL as string
}

export default ENV
