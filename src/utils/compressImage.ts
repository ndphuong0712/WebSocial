import PATH from '@constants/path'
import path from 'path'
import sharp from 'sharp'

const compressImage = async (file: Express.Multer.File) => {
  sharp.cache(false)
  const compressImagePath = path.resolve(PATH.IMAGES, file.filename)
  await sharp(file.path).jpeg().toFile(compressImagePath)
  return compressImagePath
}

export default compressImage
