import PATH from '@constants/path'
import multer, { diskStorage } from 'multer'
const uploadFile = (type: ('image' | 'video' | 'all')[] = []) => {
  let regex = /^[]/
  if (type.includes('all')) {
    regex = /./
  } else if (type.includes('image') && type.includes('video')) {
    regex = /^(image|video)/i
  } else if (type.includes('image')) {
    regex = /^image/i
  } else if (type.includes('video')) {
    regex = /^video/i
  }

  return multer({
    storage: diskStorage({
      destination(req, file, callback) {
        callback(null, PATH.IMAGES_TMP)
      },
      filename(req, file, callback) {
        callback(null, Date.now() + file.originalname)
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 10
    },
    fileFilter(req, file, callback) {
      if (!file.mimetype.match(regex)) {
        return callback(new Error())
      }
      callback(null, true)
    }
  })
}

export default uploadFile
